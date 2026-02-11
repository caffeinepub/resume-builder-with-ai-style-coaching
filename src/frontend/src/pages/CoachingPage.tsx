import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetResumeWithCoaching, useRunCoaching } from '../hooks/useCoaching';
import SuggestionList from '../components/coaching/SuggestionList';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

export default function CoachingPage() {
  const { resumeId } = useParams({ from: '/coaching/$resumeId' });
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetResumeWithCoaching(BigInt(resumeId));
  const runCoaching = useRunCoaching();

  const handleRunCoaching = async () => {
    try {
      await runCoaching.mutateAsync(BigInt(resumeId));
    } catch (err) {
      console.error('Failed to run coaching:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <LoadingState message="Loading coaching results..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-12">
        <ErrorState message="Failed to load coaching data" onRetry={refetch} />
      </div>
    );
  }

  const hasCoaching = data.coaching && data.coaching.suggestions.length > 0;

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resumes
        </Button>
        <Button onClick={handleRunCoaching} disabled={runCoaching.isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${runCoaching.isPending ? 'animate-spin' : ''}`} />
          {runCoaching.isPending ? 'Analyzing...' : hasCoaching ? 'Re-run Coaching' : 'Run Coaching'}
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">AI Resume Coaching</h1>
        <p className="text-muted-foreground">
          Get actionable suggestions to improve your resume: <strong>{data.resume.title}</strong>
        </p>
      </div>

      {!hasCoaching ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">No coaching results yet</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Run the AI coach to get personalized suggestions for improving your resume.
            </p>
            <Button onClick={handleRunCoaching} disabled={runCoaching.isPending} size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              {runCoaching.isPending ? 'Analyzing...' : 'Run Coaching Now'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coaching Summary</CardTitle>
              <CardDescription>
                Last analyzed: {new Date(Number(data.coaching!.timestamp) / 1000000).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Found <strong>{data.coaching!.suggestions.length}</strong> suggestion
                {data.coaching!.suggestions.length !== 1 ? 's' : ''} to improve your resume.
              </p>
            </CardContent>
          </Card>

          <SuggestionList suggestions={data.coaching!.suggestions} />
        </div>
      )}
    </div>
  );
}
