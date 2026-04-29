import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examService } from '@/services/exam.service';
import { ExamRequest, MarksEntryRequest } from '@/types/exam.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const examKeys = {
  all: ['exams'] as const,
  lists: (schoolId: number) => [...examKeys.all, 'list', schoolId] as const,
  list: (schoolId: number, params?: PaginationParams) => [...examKeys.lists(schoolId), params] as const,
  studentResults: (schoolId: number, studentId: number) => [...examKeys.all, 'results', schoolId, studentId] as const,
  statistics: (schoolId: number, examId: number) => [...examKeys.all, 'statistics', schoolId, examId] as const,
};

// --- Queries ---

export function useExams({ schoolId, page = 0, size = 20 }: { schoolId: number; page?: number; size?: number }) {
  return useQuery({
    queryKey: examKeys.list(schoolId, { page, size }),
    queryFn: () => examService.getAll(schoolId, { page, size }),
    enabled: !!schoolId,
  });
}

export function useStudentResults(schoolId: number, studentId: number, classRoomId: number, academicYear: string) {
  return useQuery({
    queryKey: [...examKeys.studentResults(schoolId, studentId), { classRoomId, academicYear }],
    queryFn: () => examService.getStudentResults(schoolId, studentId, classRoomId, academicYear),
    enabled: !!schoolId && !!studentId && !!classRoomId && !!academicYear,
  });
}

export function useExamStatistics(schoolId: number, examId: number) {
  return useQuery({
    queryKey: examKeys.statistics(schoolId, examId),
    queryFn: () => examService.getStatistics(schoolId, examId),
    enabled: !!schoolId && !!examId,
  });
}

// --- Mutations ---

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: ExamRequest }) =>
      examService.create(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Exam created successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.lists(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create exam');
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, examId, data }: { schoolId: number; examId: number; data: ExamRequest }) =>
      examService.update(schoolId, examId, data),
    onSuccess: (res, variables) => {
      toast.success('Exam updated successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.lists(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update exam');
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, examId }: { schoolId: number; examId: number }) =>
      examService.delete(schoolId, examId),
    onSuccess: (res, variables) => {
      toast.success('Exam deleted successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.lists(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete exam');
    },
  });
}

export function useEnterMarks() {
  return useMutation({
    mutationFn: ({ schoolId, examId, data }: { schoolId: number; examId: number; data: MarksEntryRequest }) =>
      examService.enterMarks(schoolId, examId, data),
    onSuccess: () => {
      toast.success('Marks entered successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to enter marks');
    },
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, examId }: { schoolId: number; examId: number }) =>
      examService.publishResults(schoolId, examId),
    onSuccess: (res, variables) => {
      toast.success('Exam results published successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.lists(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to publish results');
    },
  });
}
