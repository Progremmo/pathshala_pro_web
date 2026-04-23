import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { Exam, ExamRequest, Marks, MarksEntryRequest } from '@/types/exam.types';

export const examService = {
  create: (schoolId: number, data: ExamRequest) =>
    api.post<ApiResponse<Exam>>(`/schools/${schoolId}/exams`, data).then((r) => r.data),

  getAll: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<Exam>>>(`/schools/${schoolId}/exams`, { params }).then((r) => r.data),

  enterMarks: (schoolId: number, examId: number, data: MarksEntryRequest) =>
    api.post<ApiResponse<Marks>>(`/schools/${schoolId}/exams/${examId}/marks`, data).then((r) => r.data),

  publishResults: (schoolId: number, examId: number) =>
    api.patch<ApiResponse<Exam>>(`/schools/${schoolId}/exams/${examId}/publish`).then((r) => r.data),

  getStudentResults: (schoolId: number, studentId: number, classRoomId: number, academicYear: string) =>
    api.get<ApiResponse<Marks[]>>(`/schools/${schoolId}/exams/student/${studentId}/results`, {
      params: { classRoomId, academicYear },
    }).then((r) => r.data),

  getStatistics: (schoolId: number, examId: number) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/schools/${schoolId}/exams/${examId}/statistics`).then((r) => r.data),
};
