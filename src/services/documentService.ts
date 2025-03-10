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

async function readFileContent(file: File): Promise<string> {
  // For demonstration purposes, we'll simulate extracting text from various file types
  // In a production app, you would use specialized libraries for each file type

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        // For text files, return the content directly
        if (typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          // For binary files, we'd normally use specialized libraries
          // For this demo, we'll extract text from the file name and type as a simulation
          const fileInfo = `
            Document Title: ${file.name}
            Document Type: ${file.type}
            Document Size: ${(file.size / 1024).toFixed(2)} KB
            
            Sample Content (Simulated):
            
            This is simulated content extracted from ${file.name}. In a production environment, 
            we would use specialized libraries like pdf.js for PDFs, tesseract.js for OCR on images, 
            or mammoth.js for Word documents.
            
            For the purpose of this demo, please imagine this text represents the actual 
            content of your document. The AI will generate questions based on this text.
            
            Key concepts that might be in a document like ${file.name}:
            - Introduction to the subject matter
            - Important definitions and terminology
            - Core principles and methodologies
            - Examples and case studies
            - Conclusions and future directions
          `;

          resolve(fileInfo);
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
      // For non-text files, read as array buffer
      // In a real app, we would process this with the appropriate library
      reader.readAsArrayBuffer(file);
    }
  });
}
