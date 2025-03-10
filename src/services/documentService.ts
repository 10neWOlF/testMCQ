// This service would handle document processing and AI question generation
// For now, it returns mock data

import { Question, QuestionType } from "@/types/questions";
import { ProfileData } from "@/components/ProfileForm";
import { generateQuestions } from "./openRouterService";

// Mock data for demonstration
export const mockQuestions: Record<QuestionType, Question[]> = {
  mcq: [
    {
      id: "1",
      type: "mcq",
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      answer: "Paris",
    },
    {
      id: "2",
      type: "mcq",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      id: "3",
      type: "mcq",
      text: 'Who wrote "Romeo and Juliet"?',
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
  ],
  fillInBlanks: [
    {
      id: "1",
      type: "fillInBlanks",
      text: "The process of plants making their own food using sunlight is called _______.",
      answer: "photosynthesis",
    },
    {
      id: "2",
      type: "fillInBlanks",
      text: "Water boils at _______ degrees Celsius at sea level.",
      answer: "100",
    },
  ],
  trueFalse: [
    {
      id: "1",
      type: "trueFalse",
      text: "The Great Wall of China is visible from space.",
      answer: "false",
    },
    {
      id: "2",
      type: "trueFalse",
      text: "The Pacific Ocean is the largest ocean on Earth.",
      answer: "true",
    },
  ],
  shortAnswer: [
    {
      id: "1",
      type: "shortAnswer",
      text: "Explain the concept of gravity in your own words.",
      answer:
        "Gravity is the force that attracts objects toward one another, particularly the force that attracts objects toward the center of the Earth.",
    },
    {
      id: "2",
      type: "shortAnswer",
      text: "What are the main causes of climate change?",
      answer:
        "The main causes of climate change include greenhouse gas emissions, deforestation, and industrial processes.",
    },
  ],
};

export async function processDocument(
  file: File,
  profile?: ProfileData,
): Promise<Record<QuestionType, Question[]>> {
  try {
    // Check if we have an API key for OpenRouter
    const hasApiKey = !!import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!hasApiKey) {
      console.log("No OpenRouter API key found, using mock data");
      // Return mock data after a simulated delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockQuestions);
        }, 1500);
      });
    }

    // Read the file content
    const fileContent = await readFileContent(file);

    // Generate questions for each type using OpenRouter
    const questionTypes: QuestionType[] = [
      "mcq",
      "fillInBlanks",
      "trueFalse",
      "shortAnswer",
    ];

    // Process each question type in parallel
    const results = await Promise.all(
      questionTypes.map(async (type) => {
        try {
          const questions = await generateQuestions(fileContent, profile, type);
          return { type, questions };
        } catch (error) {
          console.error(`Error generating ${type} questions:`, error);
          // Fallback to mock data for this type
          return { type, questions: mockQuestions[type] };
        }
      }),
    );

    // Combine results into a record
    const allQuestions: Record<QuestionType, Question[]> = {} as Record<
      QuestionType,
      Question[]
    >;
    results.forEach(({ type, questions }) => {
      allQuestions[type] = questions;
    });

    return allQuestions;
  } catch (error) {
    console.error("Error processing document:", error);
    // Fallback to mock data
    return mockQuestions;
  }
}

async function readFileContent(file: File): Promise<string> {
  // For now, we'll just read text files and images as base64
  // In a production app, you would use more sophisticated document parsing

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        // For text files, return the content directly
        if (typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          // For binary files (like PDFs), we'd need more processing
          // For now, just return a placeholder
          resolve(
            "[Binary file content - would be processed by document parser in production]",
          );
        }
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    if (file.type.includes("text")) {
      reader.readAsText(file);
    } else {
      // For non-text files, read as data URL for now
      reader.readAsDataURL(file);
    }
  });
}
