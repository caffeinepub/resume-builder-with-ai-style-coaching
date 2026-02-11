import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Save, Eye, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetResume, useUpdateResume } from '../hooks/useResumes';
import { deserializeResumeSections, serializeResumeSections, type ResumeFormData } from '../components/resume/serializeResumeSections';
import SectionBasicsContact from '../components/resume/SectionBasicsContact';
import SectionSummary from '../components/resume/SectionSummary';
import SectionExperience from '../components/resume/SectionExperience';
import SectionEducation from '../components/resume/SectionEducation';
import SectionSkills from '../components/resume/SectionSkills';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import FormErrorSummary from '../components/common/FormErrorSummary';

export default function ResumeEditorPage() {
  const { resumeId } = useParams({ from: '/editor/$resumeId' });
  const navigate = useNavigate();
  const { data: resume, isLoading, error, refetch } = useGetResume(BigInt(resumeId));
  const updateResume = useUpdateResume();

  const [formData, setFormData] = useState<ResumeFormData>({
    title: '',
    basics: { name: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resume) {
      setFormData(deserializeResumeSections(resume));
    }
  }, [resume]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Resume title is required');
    if (!formData.basics.name.trim()) newErrors.push('Name is required');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const sections = serializeResumeSections(formData);
      await updateResume.mutateAsync({
        id: BigInt(resumeId),
        title: formData.title,
        sections,
      });
    } catch (err) {
      console.error('Failed to save resume:', err);
      setErrors(['Failed to save resume. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <LoadingState message="Loading resume..." />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container py-12">
        <ErrorState message="Failed to load resume" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resumes
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/preview/$resumeId', params: { resumeId } })}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/coaching/$resumeId', params: { resumeId } })}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get Coaching
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <FormErrorSummary errors={errors} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Resume Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Software Engineer Resume"
            className="text-lg font-semibold"
          />
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-6">
            <SectionBasicsContact
              data={formData.basics}
              onChange={(basics) => setFormData({ ...formData, basics })}
            />
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <SectionSummary
              data={formData.summary}
              onChange={(summary) => setFormData({ ...formData, summary })}
            />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <SectionExperience
              data={formData.experience}
              onChange={(experience) => setFormData({ ...formData, experience })}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <SectionEducation
              data={formData.education}
              onChange={(education) => setFormData({ ...formData, education })}
            />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SectionSkills
              data={formData.skills}
              onChange={(skills) => setFormData({ ...formData, skills })}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
