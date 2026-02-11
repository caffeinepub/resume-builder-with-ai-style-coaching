import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EducationItem } from './serializeResumeSections';

interface SectionEducationProps {
  data: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

export default function SectionEducation({ data, onChange }: SectionEducationProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addItem = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      description: '',
    };
    onChange([...data, newItem]);
    setExpandedId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<EducationItem>) => {
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
        <CardTitle>Education</CardTitle>
        <CardDescription>List your educational background and qualifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="mb-4">No education added yet</p>
            <Button onClick={addItem} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Education
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
                      {item.degree || 'Untitled Degree'} {item.institution && `at ${item.institution}`}
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
                          <Label>Degree</Label>
                          <Input
                            value={item.degree}
                            onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                            placeholder="Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={item.institution}
                            onChange={(e) => updateItem(item.id, { institution: e.target.value })}
                            placeholder="University of California"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={item.location}
                            onChange={(e) => updateItem(item.id, { location: e.target.value })}
                            placeholder="Berkeley, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Graduation Date</Label>
                          <Input
                            value={item.graduationDate}
                            onChange={(e) => updateItem(item.id, { graduationDate: e.target.value })}
                            placeholder="May 2020"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Additional Details (Optional)</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          placeholder="GPA: 3.8/4.0&#10;Relevant coursework: Data Structures, Algorithms, Machine Learning"
                          rows={3}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Button onClick={addItem} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Degree
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
