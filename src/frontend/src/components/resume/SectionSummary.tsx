import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface SectionSummaryProps {
  data: string;
  onChange: (data: string) => void;
}

export default function SectionSummary({ data, onChange }: SectionSummaryProps) {
  const charCount = data.length;
  const isShort = charCount < 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>A brief overview of your professional background and key strengths</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={data}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a compelling summary that highlights your experience, skills, and career goals..."
            rows={6}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            {charCount} characters {isShort && '(aim for at least 50)'}
          </p>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Tip: Start with your current role or expertise, highlight 2-3 key achievements, and mention your career
            goals.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
