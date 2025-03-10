import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Brain, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full p-6">
      <div className="container mx-auto max-w-6xl">
        <header className="py-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            AI Quiz Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload documents and generate intelligent quizzes with our
            AI-powered platform
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Support for PDFs, Word documents, and images with text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Simply upload your study materials, textbooks, or notes and our
                AI will analyze the content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>AI-Generated Questions</CardTitle>
              <CardDescription>
                Multiple question formats tailored to your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI creates multiple-choice, fill-in-the-blanks, true/false,
                and short answer questions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Enhance Learning</CardTitle>
              <CardDescription>
                Test your knowledge and improve retention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Take quizzes, review your answers, and get instant feedback to
                strengthen your understanding.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8 mb-16">
          <Button asChild size="lg" className="px-8">
            <Link to="/quiz">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
