import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { QuestionType } from "./QuestionTypes";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  answer?: string;
  userAnswer?: string;
}

interface QuestionDisplayProps {
  questions: Question[];
  onSubmit: (answers: Question[]) => void;
  questionType: QuestionType;
}

export default function QuestionDisplay({
  questions = [],
  onSubmit = () => {},
  questionType = "mcq",
}: QuestionDisplayProps) {
  const [currentQuestions, setCurrentQuestions] =
    useState<Question[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAnswerChange = (answer: string) => {
    const updatedQuestions = [...currentQuestions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      userAnswer: answer,
    };
    setCurrentQuestions(updatedQuestions);
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(currentQuestions);
  };

  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p>No questions available for this type.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = currentQuestions[currentIndex];

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Question {currentIndex + 1} of {currentQuestions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {questionType === "mcq"
              ? "Multiple Choice"
              : questionType === "fillInBlanks"
                ? "Fill in the Blanks"
                : questionType === "trueFalse"
                  ? "True or False"
                  : "Short Answer"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-lg font-medium">{currentQuestion.text}</p>
        </div>

        {questionType === "mcq" && currentQuestion.options && (
          <RadioGroup
            value={currentQuestion.userAnswer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {questionType === "fillInBlanks" && (
          <div className="space-y-4">
            <Input
              placeholder="Your answer"
              value={currentQuestion.userAnswer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        )}

        {questionType === "trueFalse" && (
          <RadioGroup
            value={currentQuestion.userAnswer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )}

        {questionType === "shortAnswer" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Your answer"
              value={currentQuestion.userAnswer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={4}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <div>
          {currentIndex === currentQuestions.length - 1 ? (
            <Button onClick={handleSubmit}>Submit All</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
