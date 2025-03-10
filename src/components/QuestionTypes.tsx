import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, ListChecks, ToggleLeft, Type } from "lucide-react";

import { QuestionType } from "@/types/questions";

interface QuestionTypesProps {
  onSelect: (type: QuestionType) => void;
  selectedType?: QuestionType;
}

export default function QuestionTypes({
  onSelect = () => {},
  selectedType,
}: QuestionTypesProps) {
  const questionTypes = [
    {
      id: "mcq",
      title: "Multiple Choice",
      description: "Select the correct answer from options",
      icon: <ListChecks className="h-6 w-6" />,
    },
    {
      id: "fillInBlanks",
      title: "Fill in the Blanks",
      description: "Complete sentences with missing words",
      icon: <Type className="h-6 w-6" />,
    },
    {
      id: "trueFalse",
      title: "True or False",
      description: "Determine if statements are true or false",
      icon: <ToggleLeft className="h-6 w-6" />,
    },
    {
      id: "shortAnswer",
      title: "Short Answer",
      description: "Write brief responses to questions",
      icon: <CheckSquare className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {questionTypes.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer transition-all hover:border-primary ${selectedType === type.id ? "border-2 border-primary bg-primary/5" : ""}`}
          onClick={() => onSelect(type.id as QuestionType)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{type.title}</CardTitle>
              {type.icon}
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{type.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
