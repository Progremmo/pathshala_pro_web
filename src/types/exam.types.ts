// Matches ExamType enum on backend
export type ExamType = 'UNIT_TEST' | 'MID_TERM' | 'FINAL_TERM' | 'INTERNAL' | 'PRACTICAL' | 'QUIZ' | 'ASSIGNMENT';

export interface ExamRequest {
  title: string;
  type: ExamType;
  classRoomId: number;
  subjectId: number;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  academicYear: string;
  description?: string;
}

export interface ExamResponse {
  id: number;
  title: string;
  type: ExamType;
  classRoomId: number;
  classRoomName: string;
  subjectId: number;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  academicYear: string;
  description: string | null;
  published: boolean;
  createdAt: string;
}

export interface MarksEntryRequest {
  studentId: number;
  examId: number;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  isAbsent: boolean;
}

export interface MarksResponse {
  id: number;
  studentId: number;
  studentName: string;
  examId: number;
  examTitle: string;
  subjectName: string;
  marksObtained: number | null;
  maxMarks: number;
  passMarks: number;
  grade: string | null;
  remarks: string | null;
  isAbsent: boolean;
  published: boolean;
  examDate: string;
}
