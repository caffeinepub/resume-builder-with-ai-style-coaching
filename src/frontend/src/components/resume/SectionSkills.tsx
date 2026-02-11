import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SectionSkillsProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export default function SectionSkills({ data, onChange }: SectionSkillsProps) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed]);
      setInputValue('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>List your technical and professional skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter"
          />
          <Button onClick={addSkill} disabled={!inputValue.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">No skills added yet</p>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Tip: Include at least 5-10 relevant skills. Mix technical skills with soft skills for a well-rounded
            profile.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
