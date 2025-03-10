import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProfileData {
  name: string;
  profession: string;
  educationLevel: string;
  subject: string;
}

interface ProfileFormProps {
  onSubmit: (data: ProfileData) => void;
}

export default function ProfileForm({ onSubmit = () => {} }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    profession: "",
    educationLevel: "",
    subject: "",
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="text-xl">Your Profile (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              placeholder="Your profession"
              value={formData.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education Level</Label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) => handleChange("educationLevel", value)}
            >
              <SelectTrigger id="education">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject Area</Label>
            <Input
              id="subject"
              placeholder="Subject area (e.g., Computer Science, History)"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
