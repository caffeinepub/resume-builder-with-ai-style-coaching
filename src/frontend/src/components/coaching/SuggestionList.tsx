import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertCircle, Key, FileText } from 'lucide-react';
import type { Suggestion } from '../../backend';
import { SectionType, SuggestionCategory } from '../../backend';

interface SuggestionListProps {
  suggestions: Suggestion[];
}

const categoryConfig: Record<
  SuggestionCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  [SuggestionCategory.impact]: { label: 'Impact', icon: Lightbulb, color: 'text-chart-1' },
  [SuggestionCategory.clarity]: { label: 'Clarity', icon: AlertCircle, color: 'text-chart-2' },
  [SuggestionCategory.keywords]: { label: 'Keywords', icon: Key, color: 'text-chart-3' },
  [SuggestionCategory.formatting]: { label: 'Formatting', icon: FileText, color: 'text-chart-4' },
};

const sectionLabels: Record<SectionType, string> = {
  [SectionType.summary]: 'Professional Summary',
  [SectionType.experience]: 'Work Experience',
  [SectionType.education]: 'Education',
  [SectionType.skills]: 'Skills',
};

export default function SuggestionList({ suggestions }: SuggestionListProps) {
  // Group suggestions by section
  const groupedBySection = suggestions.reduce((acc, suggestion) => {
    const sectionKey = suggestion.section;
    if (!acc[sectionKey]) {
      acc[sectionKey] = [];
    }
    acc[sectionKey].push(suggestion);
    return acc;
  }, {} as Record<SectionType, Suggestion[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedBySection).map(([sectionKey, sectionSuggestions]) => (
        <Card key={sectionKey}>
          <CardHeader>
            <CardTitle>{sectionLabels[sectionKey as SectionType] || sectionKey}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectionSuggestions.map((suggestion, index) => {
                const categoryKey = suggestion.category;
                const config = categoryConfig[categoryKey] || categoryConfig[SuggestionCategory.impact];
                const Icon = config.icon;

                return (
                  <div key={index} className="flex gap-4 rounded-lg border p-4">
                    <div className={`mt-1 ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{config.label}</Badge>
                      </div>
                      <p className="leading-relaxed text-muted-foreground">{suggestion.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
