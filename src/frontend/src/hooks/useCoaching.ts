import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CoachingResult, ResumeWithCoaching } from '../backend';

export function useGetResumeWithCoaching(resumeId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ResumeWithCoaching | null>({
    queryKey: ['resumeWithCoaching', resumeId?.toString()],
    queryFn: async () => {
      if (!actor || !resumeId) return null;
      return actor.getResumeWithCoaching(resumeId);
    },
    enabled: !!actor && !isFetching && !!resumeId,
  });
}

export function useRunCoaching() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.runCoaching(resumeId);
    },
    onSuccess: (_, resumeId) => {
      queryClient.invalidateQueries({ queryKey: ['resumeWithCoaching', resumeId.toString()] });
    },
  });
}
