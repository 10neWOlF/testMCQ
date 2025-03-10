import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionType } from "@/types/questions";

export interface QuizSettings {
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  difficultyLevel: string;
  customPrompt: string;
}

interface QuizSettingsProps {
  onSubmit: (settings: QuizSettings) => void;
}

export default function QuizSettings({
  onSubmit = () => {},
}: QuizSettingsProps) {
  const [settings, setSettings] = useState<QuizSettings>({
    questionTypes: ["mcq"],
    numberOfQuestions: 5,
    difficultyLevel: "medium",
    customPrompt: "",
  });

  const questionTypeOptions = [
    { id: "mcq", label: "Multiple Choice" },
    { id: "fillInBlanks", label: "Fill in the Blanks" },
    { id: "trueFalse", label: "True or False" },
    { id: "shortAnswer", label: "Short Answer" },
  ];

  const handleQuestionTypeChange = (type: QuestionType, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        questionTypes: [...settings.questionTypes, type],
      });
    } else {
      setSettings({
        ...settings,
        questionTypes: settings.questionTypes.filter((t) => t !== type),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="text-xl">Quiz Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Question Types</Label>
            <div className="grid grid-cols-2 gap-4">
              {questionTypeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={settings.questionTypes.includes(
                      type.id as QuestionType,
                    )}
                    onCheckedChange={(checked) =>
                      handleQuestionTypeChange(
                        type.id as QuestionType,
                        checked as boolean,
                      )
                    }
                  />
                  <Label htmlFor={`type-${type.id}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
            {settings.questionTypes.length === 0 && (
              <p className="text-sm text-red-500">
                Please select at least one question type
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min={1}
              max={20}
              value={settings.numberOfQuestions}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  numberOfQuestions: parseInt(e.target.value) || 5,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Select
              value={settings.difficultyLevel}
              onValueChange={(value) =>
                setSettings({ ...settings, difficultyLevel: value })
              }
            >
              <SelectTrigger id="difficultyLevel">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Add specific instructions for the AI, e.g., 'Focus on chapter 3' or 'Include questions about neural networks'"
              value={settings.customPrompt}
              onChange={(e) =>
                setSettings({ ...settings, customPrompt: e.target.value })
              }
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={settings.questionTypes.length === 0}
          >
            Generate Questions
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
