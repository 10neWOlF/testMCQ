import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import ProfileForm, { ProfileData } from "@/components/ProfileForm";
import QuizSettings from "@/components/QuizSettings";
import type { QuizSettings as QuizSettingsType } from "@/components/QuizSettings";
import QuestionDisplay from "@/components/QuestionDisplay";
import ResultsDisplay from "@/components/ResultsDisplay";
import ProgressIndicator, { AppStage } from "@/components/ProgressIndicator";
import LoadingSpinner from "@/components/LoadingSpinner";

import { processDocument } from "@/services/documentService";
import { Question, QuestionType } from "@/types/questions";

export default function QuizGenerator() {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.Upload);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettingsType | null>(
    null,
  );
  const [activeQuestionType, setActiveQuestionType] =
    useState<QuestionType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Record<
    QuestionType,
    Question[]
  > | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStage(AppStage.Profile);
  };

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setCurrentStage(AppStage.QuizSettings);
  };

  const handleQuizSettingsSubmit = async (settings: QuizSettingsType) => {
    setQuizSettings(settings);

    if (uploadedFile) {
      setIsLoading(true);
      try {
        const generatedQuestions = await processDocument({
          file: uploadedFile,
          profile: profileData || undefined,
          questionTypes: settings.questionTypes,
          numberOfQuestions: settings.numberOfQuestions,
          difficultyLevel: settings.difficultyLevel,
          customPrompt: settings.customPrompt,
        });

        setAllQuestions(generatedQuestions);

        // Set the first question type as active
        const firstType = settings.questionTypes[0];
        setActiveQuestionType(firstType);
        setQuestions(generatedQuestions[firstType]);
      } catch (error) {
        console.error("Error generating questions:", error);
      } finally {
        setIsLoading(false);
        setCurrentStage(AppStage.Questions);
      }
    }
  };

  const handleQuestionTypeChange = (type: QuestionType) => {
    if (allQuestions && allQuestions[type]) {
      setActiveQuestionType(type);
      setQuestions(allQuestions[type]);
    }
  };

  const handleQuestionsSubmit = (answeredQuestions: Question[]) => {
    setAnsweredQuestions(answeredQuestions);

    // Calculate score
    const newScore = answeredQuestions.reduce((total, question) => {
      if (question.userAnswer === question.answer) {
        return total + 1;
      }
      return total;
    }, 0);

    setScore(newScore);
    setCurrentStage(AppStage.Results);
  };

  const handleRetry = () => {
    // Reset answers but keep the same questions
    setQuestions(questions.map((q) => ({ ...q, userAnswer: undefined })));
    setCurrentStage(AppStage.Questions);
  };

  const handleNewTest = () => {
    // Start over from the beginning
    setUploadedFile(null);
    setProfileData(null);
    setQuizSettings(null);
    setActiveQuestionType(null);
    setQuestions([]);
    setAnsweredQuestions([]);
    setScore(0);
    setAllQuestions(null);
    setCurrentStage(AppStage.Upload);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8 bg-background">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">AI Quiz Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressIndicator currentStage={currentStage} />
        </CardContent>
      </Card>

      {currentStage === AppStage.Upload && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Upload Your Document</h2>
          <p className="text-muted-foreground">
            Upload a document to generate quiz questions based on its content.
          </p>
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
      )}

      {currentStage === AppStage.Profile && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Information</h2>
          <p className="text-muted-foreground">
            Help us tailor the questions to your needs (optional).
          </p>
          <ProfileForm onSubmit={handleProfileSubmit} />
        </div>
      )}

      {currentStage === AppStage.QuizSettings && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quiz Settings</h2>
          <p className="text-muted-foreground">
            Customize your quiz settings before generating questions.
          </p>
          <QuizSettings onSubmit={handleQuizSettingsSubmit} />
        </div>
      )}

      {currentStage === AppStage.Questions &&
        activeQuestionType &&
        quizSettings && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Answer the Questions</h2>
                <p className="text-muted-foreground">
                  Complete all questions to see your results.
                </p>
              </div>

              {quizSettings.questionTypes.length > 1 && (
                <div className="flex space-x-2">
                  {quizSettings.questionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleQuestionTypeChange(type)}
                      className={`px-3 py-1.5 text-sm rounded-md ${activeQuestionType === type ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                    >
                      {type === "mcq"
                        ? "Multiple Choice"
                        : type === "fillInBlanks"
                          ? "Fill Blanks"
                          : type === "trueFalse"
                            ? "True/False"
                            : "Short Answer"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <QuestionDisplay
                questions={questions}
                onSubmit={handleQuestionsSubmit}
                questionType={activeQuestionType}
              />
            )}
          </div>
        )}

      {currentStage === AppStage.Results && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Results</h2>
          <p className="text-muted-foreground">
            See how well you did and review your answers.
          </p>
          <ResultsDisplay
            questions={answeredQuestions}
            score={score}
            onRetry={handleRetry}
            onNewTest={handleNewTest}
          />
        </div>
      )}
    </div>
  );
}
