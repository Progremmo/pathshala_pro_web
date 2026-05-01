export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY' | 'LEAVE' | 'EXCUSED';

export interface StudentAttendance {
  studentId: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRequest {
  classRoomId: number;
  attendanceDate: string;
  subjectId?: number;
  records: StudentAttendance[];
}

export interface AttendanceResponse {
  id: number;
  studentId: number;
  studentName: string;
  classRoomId: number;
  classRoomName: string;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks: string | null;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}
