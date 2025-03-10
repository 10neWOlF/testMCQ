// This service would handle document processing and AI question generation
// For now, it returns mock data

import { Question } from "@/components/QuestionDisplay";
import { QuestionType } from "@/components/QuestionTypes";
import { ProfileData } from "@/components/ProfileForm";

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
  // In a real implementation, this would send the document to an AI service
  // and generate questions based on the content

  // For now, just return mock data after a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQuestions);
    }, 1500); // Simulate processing time
  });
}
