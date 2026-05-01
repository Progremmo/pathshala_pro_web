import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { NotesRequest, NotesResponse } from '@/types/notes.types';

export const notesService = {
  create: (schoolId: number, data: NotesRequest) =>
    api.post<ApiResponse<NotesResponse>>(`/schools/${schoolId}/notes`, data).then((r) => r.data),

  getAll: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<NotesResponse>>>(`/schools/${schoolId}/notes`, { params }).then((r) => r.data),

  getBySubject: (schoolId: number, subjectId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<NotesResponse>>>(`/schools/${schoolId}/notes/subject/${subjectId}`, { params }).then((r) => r.data),

  update: (schoolId: number, noteId: number, data: NotesRequest) =>
    api.put<ApiResponse<NotesResponse>>(`/schools/${schoolId}/notes/${noteId}`, data).then((r) => r.data),

  delete: (schoolId: number, noteId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/notes/${noteId}`).then((r) => r.data),
};
