export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY' | 'LEAVE';

// Matches AttendanceRequest.java
export interface StudentAttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceRequest {
  classRoomId: number;
  attendanceDate: string;
  subjectId?: number;
  records: StudentAttendanceRecord[];
}

// Attendance entity
export interface Attendance {
  id: number;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks: string | null;
  schoolId: number;
  studentId: number;
  classRoomId: number;
  subjectId: number | null;
  markedBy: number | null;
  createdAt: string;
}

// Attendance stats
export interface AttendanceStats {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
  attendancePercentage: number;
}
