import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';
import { NotesRequest } from '@/types/notes.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const notesKeys = {
  all: ['notes'] as const,
  lists: (schoolId: number) => [...notesKeys.all, 'list', schoolId] as const,
  list: (schoolId: number, params?: PaginationParams) => [...notesKeys.lists(schoolId), params] as const,
  subject: (schoolId: number, subjectId: number, params?: PaginationParams) => [...notesKeys.all, 'subject', schoolId, subjectId, params] as const,
};

export function useNotes(schoolId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: notesKeys.list(schoolId, params),
    queryFn: () => notesService.getAll(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useSubjectNotes(schoolId: number, subjectId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: notesKeys.subject(schoolId, subjectId, params),
    queryFn: () => notesService.getBySubject(schoolId, subjectId, params),
    enabled: !!schoolId && !!subjectId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: NotesRequest }) =>
      notesService.create(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Note created successfully');
      queryClient.invalidateQueries({ queryKey: notesKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: notesKeys.subject(variables.schoolId, variables.data.subjectId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create note');
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, noteId, data }: { schoolId: number; noteId: number; data: NotesRequest }) =>
      notesService.update(schoolId, noteId, data),
    onSuccess: (res, variables) => {
      toast.success('Note updated successfully');
      queryClient.invalidateQueries({ queryKey: notesKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: notesKeys.subject(variables.schoolId, variables.data.subjectId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update note');
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, noteId, subjectId }: { schoolId: number; noteId: number; subjectId: number }) =>
      notesService.delete(schoolId, noteId),
    onSuccess: (res, variables) => {
      toast.success('Note deleted successfully');
      queryClient.invalidateQueries({ queryKey: notesKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: notesKeys.subject(variables.schoolId, variables.subjectId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete note');
    },
  });
}
