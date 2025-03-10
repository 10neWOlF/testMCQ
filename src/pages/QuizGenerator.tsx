import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import ProfileForm, { ProfileData } from "@/components/ProfileForm";
import QuestionTypes, { QuestionType } from "@/components/QuestionTypes";
import QuestionDisplay, { Question } from "@/components/QuestionDisplay";
import ResultsDisplay from "@/components/ResultsDisplay";
import ProgressIndicator, { AppStage } from "@/components/ProgressIndicator";
import LoadingSpinner from "@/components/LoadingSpinner";

import { processDocument } from "@/services/documentService";

export default function QuizGenerator() {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.Upload);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] =
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
    setCurrentStage(AppStage.QuestionType);
  };

  const handleQuestionTypeSelect = async (type: QuestionType) => {
    setSelectedQuestionType(type);

    if (allQuestions) {
      // If we already have questions, use them
      setQuestions(allQuestions[type]);
      setCurrentStage(AppStage.Questions);
    } else if (uploadedFile) {
      // Otherwise process the document
      setIsLoading(true);
      try {
        const generatedQuestions = await processDocument(
          uploadedFile,
          profileData || undefined,
        );
        setAllQuestions(generatedQuestions);
        setQuestions(generatedQuestions[type]);
      } catch (error) {
        console.error("Error generating questions:", error);
      } finally {
        setIsLoading(false);
        setCurrentStage(AppStage.Questions);
      }
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
    setSelectedQuestionType(null);
    setQuestions([]);
    setAnsweredQuestions([]);
    setScore(0);
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

      {currentStage === AppStage.QuestionType && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Select Question Type</h2>
          <p className="text-muted-foreground">
            Choose the type of questions you want to generate.
          </p>
          <QuestionTypes
            onSelect={handleQuestionTypeSelect}
            selectedType={selectedQuestionType || undefined}
          />
        </div>
      )}

      {currentStage === AppStage.Questions && selectedQuestionType && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Answer the Questions</h2>
          <p className="text-muted-foreground">
            Complete all questions to see your results.
          </p>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <QuestionDisplay
              questions={questions}
              onSubmit={handleQuestionsSubmit}
              questionType={selectedQuestionType}
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
