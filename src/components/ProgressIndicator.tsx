import { Progress } from "@/components/ui/progress";

export enum AppStage {
  Upload,
  Profile,
  QuizSettings,
  Questions,
  Results,
}

interface ProgressIndicatorProps {
  currentStage: AppStage;
}

export default function ProgressIndicator({
  currentStage = AppStage.Upload,
}: ProgressIndicatorProps) {
  const stages = [
    { id: AppStage.Upload, label: "Upload" },
    { id: AppStage.Profile, label: "Profile" },
    { id: AppStage.QuizSettings, label: "Quiz Settings" },
    { id: AppStage.Questions, label: "Questions" },
    { id: AppStage.Results, label: "Results" },
  ];

  const progressPercentage = ((currentStage + 1) / stages.length) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`${currentStage >= stage.id ? "text-primary font-medium" : ""}`}
          >
            {stage.label}
          </div>
        ))}
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
