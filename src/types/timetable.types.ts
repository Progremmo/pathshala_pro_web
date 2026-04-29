export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// Matches TimetableRequest.java
export interface TimetableRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  periodNumber?: number;
  academicYear: string;
  classRoomId: number;
  subjectId: number;
  teacherId: number;
}

// Timetable entity
export interface Timetable {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  periodNumber: number | null;
  academicYear: string;
  schoolId: number;
  classRoomId: number;
  classRoomName: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  teacherId: number;
  teacherName: string;
  createdAt: string;
  updatedAt: string | null;
}
