import { Question, QuestionType } from "@/types/questions";
import { ProfileData } from "@/components/ProfileForm";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateQuestions(
  documentText: string,
  profile: ProfileData | undefined,
  questionType: QuestionType,
): Promise<Question[]> {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OpenRouter API key is missing");
      throw new Error("API key is required");
    }

    // Create prompt based on question type and profile
    const prompt = createPrompt(documentText, profile, questionType);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Quiz Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content:
              "You are an expert educator who creates high-quality quiz questions based on document content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    const jsonContent = data.choices[0].message.content;

    // Parse the JSON response
    try {
      const parsedQuestions = JSON.parse(jsonContent);
      return formatQuestions(parsedQuestions, questionType);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

function createPrompt(
  documentText: string,
  profile: ProfileData | undefined,
  questionType: QuestionType,
): string {
  let prompt = `Generate ${
    questionType === "mcq"
      ? "multiple choice"
      : questionType === "fillInBlanks"
        ? "fill in the blanks"
        : questionType === "trueFalse"
          ? "true/false"
          : "short answer"
  } 
                questions based on the following document content.\n\n`;

  // Add profile context if available
  if (profile) {
    prompt += `The questions should be appropriate for someone with the following profile:\n`;
    if (profile.name) prompt += `- Name: ${profile.name}\n`;
    if (profile.profession) prompt += `- Profession: ${profile.profession}\n`;
    if (profile.educationLevel)
      prompt += `- Education Level: ${profile.educationLevel}\n`;
    if (profile.subject) prompt += `- Subject Area: ${profile.subject}\n`;
    prompt += `\n`;
  }

  // Add document content
  prompt += `DOCUMENT CONTENT:\n${documentText}\n\n`;

  // Add specific instructions based on question type
  prompt += `Please generate 5 high-quality ${
    questionType === "mcq"
      ? "multiple choice"
      : questionType === "fillInBlanks"
        ? "fill in the blanks"
        : questionType === "trueFalse"
          ? "true/false"
          : "short answer"
  } questions.\n`;

  // Add format instructions
  prompt += `Return the questions in the following JSON format:\n`;

  if (questionType === "mcq") {
    prompt += `[
  {
    "text": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option text"
  },
  ...
]`;
  } else if (questionType === "fillInBlanks") {
    prompt += `[
  {
    "text": "Sentence with _______ for the blank",
    "answer": "correct word"
  },
  ...
]`;
  } else if (questionType === "trueFalse") {
    prompt += `[
  {
    "text": "Statement to evaluate as true or false",
    "answer": "true" or "false"
  },
  ...
]`;
  } else {
    // shortAnswer
    prompt += `[
  {
    "text": "Question requiring a short answer",
    "answer": "Model answer or key points"
  },
  ...
]`;
  }

  return prompt;
}

function formatQuestions(
  parsedResponse: any,
  questionType: QuestionType,
): Question[] {
  // Ensure the response is an array
  if (!Array.isArray(parsedResponse)) {
    console.error("Expected array response but got:", parsedResponse);
    return [];
  }

  // Map the response to our Question format
  return parsedResponse.map((q, index) => ({
    id: String(index + 1),
    type: questionType,
    text: q.text || "",
    options: q.options || undefined,
    answer: q.answer || "",
  }));
}
