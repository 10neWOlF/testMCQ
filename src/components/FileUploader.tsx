import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image, File } from "lucide-react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({
  onFileUpload = () => {},
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileUpload(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileUpload(droppedFile);
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-muted-foreground" />;

    const fileType = file.type;
    if (fileType.includes("pdf")) {
      return <FileText className="h-12 w-12 text-primary" />;
    } else if (fileType.includes("image")) {
      return <Image className="h-12 w-12 text-primary" />;
    } else {
      return <File className="h-12 w-12 text-primary" />;
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardContent className="p-6">
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {getFileIcon()}

          <div className="mt-4 text-center">
            <p className="text-sm font-medium">
              {file ? file.name : "Drag & drop your document here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : "Supports PDF, DOCX, JPG, PNG"}
            </p>
          </div>

          <div className="mt-6">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center justify-center">
                <Button variant="outline" className="relative">
                  <Input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  />
                  {file ? "Change File" : "Select File"}
                </Button>
              </div>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
