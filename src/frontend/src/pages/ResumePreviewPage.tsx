import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetResume } from '../hooks/useResumes';
import ResumePreview from '../components/resume/ResumePreview';
import ExportButton from '../components/resume/ExportButton';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function ResumePreviewPage() {
  const { resumeId } = useParams({ from: '/preview/$resumeId' });
  const navigate = useNavigate();
  const { data: resume, isLoading, error, refetch } = useGetResume(BigInt(resumeId));

  if (isLoading) {
    return (
      <div className="container py-12">
        <LoadingState message="Loading preview..." />
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
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resumes
        </Button>
        <ExportButton />
      </div>

      <ResumePreview resume={resume} />
    </div>
  );
}
