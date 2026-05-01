export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimetableRequest {
  classRoomId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  periodNumber: number;
  academicYear: string;
}

export interface TimetableResponse {
  id: number;
  classRoomId: number;
  classRoomName: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  periodNumber: number;
  academicYear: string;
}

export type Timetable = TimetableResponse;
