import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetAllResumes, useCreateResume } from '../hooks/useResumes';
import ResumeListItem from '../components/resume/ResumeListItem';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { SectionType } from '../backend';

export default function ResumeListPage() {
  const navigate = useNavigate();
  const { data: resumes, isLoading, error, refetch } = useGetAllResumes();
  const createResume = useCreateResume();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateResume = async () => {
    setIsCreating(true);
    try {
      const id = await createResume.mutateAsync({
        title: 'Untitled Resume',
        sections: [
          [SectionType.summary, ''],
          [SectionType.experience, ''],
          [SectionType.education, ''],
          [SectionType.skills, ''],
        ],
      });
      navigate({ to: '/editor/$resumeId', params: { resumeId: id.toString() } });
    } catch (err) {
      console.error('Failed to create resume:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <LoadingState message="Loading your resumes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <ErrorState message="Failed to load resumes" onRetry={refetch} />
      </div>
    );
  }

  const hasResumes = resumes && resumes.length > 0;

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
          <p className="mt-2 text-muted-foreground">Create and manage your professional resumes</p>
        </div>
        <Button onClick={handleCreateResume} disabled={isCreating} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          {isCreating ? 'Creating...' : 'New Resume'}
        </Button>
      </div>

      {!hasResumes ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <img
              src="/assets/generated/empty-state-illustration.dim_1200x800.png"
              alt="No resumes yet"
              className="mb-8 h-48 w-auto opacity-80"
            />
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No resumes yet</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Get started by creating your first resume. Our AI coach will help you make it shine.
            </p>
            <Button onClick={handleCreateResume} disabled={isCreating} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              {isCreating ? 'Creating...' : 'Create Your First Resume'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeListItem key={resume.id.toString()} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
