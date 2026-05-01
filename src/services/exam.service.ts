import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { ExamRequest, ExamResponse, MarksEntryRequest, MarksResponse } from '@/types/exam.types';

export const examService = {
  create: (schoolId: number, data: ExamRequest) =>
    api.post<ApiResponse<ExamResponse>>(`/schools/${schoolId}/exams`, data).then((r) => r.data),

  getAll: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<ExamResponse>>>(`/schools/${schoolId}/exams`, { params }).then((r) => r.data),

  update: (schoolId: number, examId: number, data: ExamRequest) =>
    api.put<ApiResponse<ExamResponse>>(`/schools/${schoolId}/exams/${examId}`, data).then((r) => r.data),

  delete: (schoolId: number, examId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/exams/${examId}`).then((r) => r.data),

  enterMarks: (schoolId: number, examId: number, data: MarksEntryRequest) =>
    api.post<ApiResponse<MarksResponse>>(`/schools/${schoolId}/exams/${examId}/marks`, data).then((r) => r.data),

  publish: (schoolId: number, examId: number) =>
    api.patch<ApiResponse<ExamResponse>>(`/schools/${schoolId}/exams/${examId}/publish`).then((r) => r.data),

  getStudentResults: (schoolId: number, studentId: number, classRoomId: number, academicYear: string) =>
    api.get<ApiResponse<MarksResponse[]>>(`/schools/${schoolId}/exams/student/${studentId}/results`, {
      params: { classRoomId, academicYear }
    }).then((r) => r.data),
};
