import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { TimetableRequest, TimetableResponse } from '@/types/timetable.types';

export const timetableService = {
  create: (schoolId: number, data: TimetableRequest) =>
    api.post<ApiResponse<TimetableResponse>>(`/schools/${schoolId}/timetable`, data).then((r) => r.data),

  update: (schoolId: number, entryId: number, data: TimetableRequest) =>
    api.put<ApiResponse<TimetableResponse>>(`/schools/${schoolId}/timetable/${entryId}`, data).then((r) => r.data),

  delete: (schoolId: number, entryId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/timetable/${entryId}`).then((r) => r.data),

  getByClass: (schoolId: number, classRoomId: number, academicYear: string) =>
    api.get<ApiResponse<TimetableResponse[]>>(`/schools/${schoolId}/timetable/class/${classRoomId}`, {
      params: { academicYear }
    }).then((r) => r.data),

  getByTeacher: (schoolId: number, teacherId: number, academicYear: string) =>
    api.get<ApiResponse<TimetableResponse[]>>(`/schools/${schoolId}/timetable/teacher/${teacherId}`, {
      params: { academicYear }
    }).then((r) => r.data),
};
