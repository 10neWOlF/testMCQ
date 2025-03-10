import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Question } from "./QuestionDisplay";

interface ResultsDisplayProps {
  questions: Question[];
  score: number;
  onRetry: () => void;
  onNewTest: () => void;
}

export default function ResultsDisplay({
  questions = [],
  score = 0,
  onRetry = () => {},
  onNewTest = () => {},
}: ResultsDisplayProps) {
  const percentage =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="text-xl">Your Results</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2">
            {score} / {questions.length}
          </div>
          <div className="text-2xl font-semibold">{percentage}%</div>
          <div className="mt-2 text-muted-foreground">
            {percentage >= 80
              ? "Excellent work!"
              : percentage >= 60
                ? "Good job!"
                : percentage >= 40
                  ? "Keep practicing!"
                  : "More study needed!"}
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-medium">Question Review</h3>
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Question {index + 1}</p>
                  <p className="mt-1">{question.text}</p>
                </div>
                {question.userAnswer === question.answer ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="mt-3 text-sm">
                <div className="flex">
                  <span className="font-medium w-24">Your answer:</span>
                  <span
                    className={
                      question.userAnswer === question.answer
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {question.userAnswer || "No answer provided"}
                  </span>
                </div>

                {question.userAnswer !== question.answer && (
                  <div className="flex mt-1">
                    <span className="font-medium w-24">Correct answer:</span>
                    <span className="text-green-600">{question.answer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
        <Button onClick={onNewTest}>New Test</Button>
      </CardFooter>
    </Card>
  );
}
