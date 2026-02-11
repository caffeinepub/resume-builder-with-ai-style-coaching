import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Resume, UpdateSection } from '../backend';

export function useGetAllResumes() {
  const { actor, isFetching } = useActor();

  return useQuery<Resume[]>({
    queryKey: ['resumes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResumes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetResume(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Resume | null>({
    queryKey: ['resume', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getResume(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, sections }: { title: string; sections: UpdateSection[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createResume(title, sections);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

export function useUpdateResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, sections }: { id: bigint; title: string; sections: UpdateSection[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateResume(id, title, sections);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['resumeWithCoaching', variables.id.toString()] });
    },
  });
}

export function useDeleteResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteResume(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
