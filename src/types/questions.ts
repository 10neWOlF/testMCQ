export type QuestionType = "mcq" | "fillInBlanks" | "trueFalse" | "shortAnswer";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  answer?: string;
  userAnswer?: string;
}
