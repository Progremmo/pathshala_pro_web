import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examService } from '@/services/exam.service';
import { ExamRequest, MarksEntryRequest } from '@/types/exam.types';
import { toast } from 'sonner';

export const examKeys = {
  all: ['exams'] as const,
  list: (schoolId: number) => [...examKeys.all, 'list', schoolId] as const,
  results: (schoolId: number, studentId: number) => [...examKeys.all, 'results', schoolId, studentId] as const,
};

export function useExams(arg: number | { schoolId: number; page?: number; size?: number }) {
  const schoolId = typeof arg === 'number' ? arg : arg.schoolId;
  const params = typeof arg === 'number' ? {} : arg;
  
  return useQuery({
    queryKey: [...examKeys.list(schoolId), params],
    queryFn: () => examService.getAll(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useCreateExam(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExamRequest) => examService.create(schoolId, data),
    onSuccess: () => {
      toast.success('Exam created');
      queryClient.invalidateQueries({ queryKey: examKeys.list(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create exam');
    },
  });
}

export function useUpdateExam(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExamRequest }) => 
      examService.update(schoolId, id, data),
    onSuccess: () => {
      toast.success('Exam updated');
      queryClient.invalidateQueries({ queryKey: examKeys.list(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update exam');
    },
  });
}

export function useDeleteExam(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examService.delete(schoolId, id),
    onSuccess: () => {
      toast.success('Exam deleted');
      queryClient.invalidateQueries({ queryKey: examKeys.list(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete exam');
    },
  });
}

export function usePublishResults(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examService.publish(schoolId, id),
    onSuccess: () => {
      toast.success('Results published');
      queryClient.invalidateQueries({ queryKey: examKeys.list(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to publish results');
    },
  });
}

export function useEnterMarks(schoolId: number, examId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarksEntryRequest) => examService.enterMarks(schoolId, examId, data),
    onSuccess: () => {
      toast.success('Marks entered successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to enter marks');
    },
  });
}

export function useStudentResults(schoolId: number, studentId: number, classId: number, academicYear: string) {
  return useQuery({
    queryKey: [...examKeys.results(schoolId, studentId), classId, academicYear],
    queryFn: () => examService.getStudentResults(schoolId, studentId, classId, academicYear),
    enabled: !!schoolId && !!studentId && !!classId && !!academicYear,
  });
}
