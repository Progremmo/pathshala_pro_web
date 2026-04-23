import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { Notes, NotesRequest } from '@/types/notes.types';

export const notesService = {
  create: (schoolId: number, data: NotesRequest) =>
    api.post<ApiResponse<Notes>>(`/schools/${schoolId}/notes`, data).then((r) => r.data),

  getAll: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<Notes>>>(`/schools/${schoolId}/notes`, { params }).then((r) => r.data),

  getBySubject: (schoolId: number, subjectId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<Notes>>>(`/schools/${schoolId}/notes/subject/${subjectId}`, { params }).then((r) => r.data),

  update: (schoolId: number, noteId: number, data: NotesRequest) =>
    api.put<ApiResponse<Notes>>(`/schools/${schoolId}/notes/${noteId}`, data).then((r) => r.data),

  delete: (schoolId: number, noteId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/notes/${noteId}`).then((r) => r.data),
};
