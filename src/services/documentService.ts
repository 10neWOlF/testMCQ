// This service would handle document processing and AI question generation
// For now, it returns mock data

import { Question, QuestionType } from "@/types/questions";
import { ProfileData } from "@/components/ProfileForm";
import {
  generateQuestions,
  GenerateQuestionsOptions,
} from "./openRouterService";

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

export interface ProcessDocumentOptions {
  file: File;
  profile?: ProfileData;
  questionTypes: QuestionType[];
  numberOfQuestions?: number;
  difficultyLevel?: string;
  customPrompt?: string;
}

export async function processDocument(
  options: ProcessDocumentOptions,
): Promise<Record<QuestionType, Question[]>> {
  const {
    file,
    profile,
    questionTypes,
    numberOfQuestions = 5,
    difficultyLevel = "medium",
    customPrompt = "",
  } = options;
  try {
    // Check if we have an API key for OpenRouter
    const hasApiKey = !!import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!hasApiKey) {
      console.log("No OpenRouter API key found, using mock data");
      // Return mock data after a simulated delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // If there's a custom prompt, log it to show it would be used
          if (customPrompt) {
            console.log("Custom prompt would be used with API:", customPrompt);
          }
          resolve(mockQuestions);
        }, 1500);
      });
    }

    // Read the file content
    const fileContent = await readFileContent(file);

    // Use the provided question types

    // Process each question type in parallel
    const results = await Promise.all(
      questionTypes.map(async (type) => {
        try {
          const questions = await generateQuestions({
            documentText: fileContent,
            profile,
            questionType: type,
            numberOfQuestions,
            difficultyLevel,
            customPrompt,
          });
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

import {
  extractTextFromPDF,
  extractTextFromImage,
  extractTextFromDoc,
} from "@/utils/fileExtractors";

async function readFileContent(file: File): Promise<string> {
  try {
    // Handle different file types
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    // PDF files
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return await extractTextFromPDF(file);
    }

    // Image files
    if (
      fileType.includes("image") ||
      /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)
    ) {
      return await extractTextFromImage(file);
    }

    // Word documents
    if (
      fileType.includes("word") ||
      fileType.includes("docx") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      return await extractTextFromDoc(file);
    }

    // Text files
    if (fileType.includes("text") || fileName.endsWith(".txt")) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => reject(new Error("Failed to read text file"));
        reader.readAsText(file);
      });
    }

    // For other file types, try to read as text or provide a fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          if (typeof event.target.result === "string") {
            resolve(event.target.result);
          } else {
            // Fallback for binary files we don't have specific extractors for
            resolve(
              `Content from ${file.name} (${file.type}) - ${(file.size / 1024).toFixed(2)} KB\n\nThis file type is not fully supported for text extraction. For best results, please upload a PDF, text file, or common document format.`,
            );
          }
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = () => reject(new Error("Error reading file"));

      try {
        reader.readAsText(file);
      } catch (e) {
        reader.readAsArrayBuffer(file);
      }
    });
  } catch (error) {
    console.error("Error reading file content:", error);
    return `Failed to extract content from ${file.name}. Error: ${error.message}`;
  }
}
