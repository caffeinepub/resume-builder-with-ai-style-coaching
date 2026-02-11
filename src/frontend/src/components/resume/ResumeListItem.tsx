import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Edit, Copy, Trash2, Eye, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteResume, useCreateResume } from '../../hooks/useResumes';
import type { Resume } from '../../backend';

interface ResumeListItemProps {
  resume: Resume;
}

export default function ResumeListItem({ resume }: ResumeListItemProps) {
  const navigate = useNavigate();
  const deleteResume = useDeleteResume();
  const createResume = useCreateResume();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleEdit = () => {
    navigate({ to: '/editor/$resumeId', params: { resumeId: resume.id.toString() } });
  };

  const handlePreview = () => {
    navigate({ to: '/preview/$resumeId', params: { resumeId: resume.id.toString() } });
  };

  const handleCoaching = () => {
    navigate({ to: '/coaching/$resumeId', params: { resumeId: resume.id.toString() } });
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const newId = await createResume.mutateAsync({
        title: `${resume.title} (Copy)`,
        sections: resume.sections,
      });
      navigate({ to: '/editor/$resumeId', params: { resumeId: newId.toString() } });
    } catch (err) {
      console.error('Failed to duplicate resume:', err);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume.mutateAsync(resume.id);
      setShowDeleteDialog(false);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  return (
    <>
      <Card className="group transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">{resume.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {resume.sections.length} section{resume.sections.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/30 p-3">
          <Button variant="default" size="sm" onClick={handleEdit} className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleCoaching}>
            <Sparkles className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={isDuplicating}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
