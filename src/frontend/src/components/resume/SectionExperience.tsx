import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ExperienceItem } from './serializeResumeSections';

interface SectionExperienceProps {
  data: ExperienceItem[];
  onChange: (data: ExperienceItem[]) => void;
}

export default function SectionExperience({ data, onChange }: SectionExperienceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange([...data, newItem]);
    setExpandedId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ExperienceItem>) => {
    onChange(data.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newData = [...data];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newData.length) return;
    [newData[index], newData[targetIndex]] = [newData[targetIndex], newData[index]];
    onChange(newData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>List your relevant work experience in reverse chronological order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="mb-4">No work experience added yet</p>
            <Button onClick={addItem} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        ) : (
          <>
            {data.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="text-left font-medium hover:underline"
                    >
                      {item.title || 'Untitled Position'} {item.company && `at ${item.company}`}
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === data.length - 1}
                    >
                      ↓
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {expandedId === item.id && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={item.company}
                            onChange={(e) => updateItem(item.id, { company: e.target.value })}
                            placeholder="Tech Corp"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={item.location}
                            onChange={(e) => updateItem(item.id, { location: e.target.value })}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            value={item.startDate}
                            onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                            placeholder="Jan 2020"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            value={item.endDate}
                            onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          placeholder="• Led development of key features&#10;• Improved performance by 40%&#10;• Mentored junior developers"
                          rows={4}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Button onClick={addItem} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Position
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
