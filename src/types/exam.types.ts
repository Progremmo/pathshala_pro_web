export type ExamType = 'UNIT_TEST' | 'MID_TERM' | 'FINAL_TERM' | 'INTERNAL' | 'PRACTICAL' | 'QUIZ' | 'ASSIGNMENT';

// Matches ExamRequest.java
export interface ExamRequest {
  name: string;
  examType: ExamType;
  examDate: string;
  startTime?: string;
  durationMinutes?: number;
  totalMarks: number;
  passingMarks: number;
  academicYear: string;
  instructions?: string;
  classRoomId: number;
  subjectId: number;
}

// Exam entity
export interface Exam {
  id: number;
  name: string;
  examType: ExamType;
  examDate: string;
  startTime: string | null;
  durationMinutes: number | null;
  totalMarks: number;
  passingMarks: number;
  academicYear: string;
  instructions: string | null;
  isResultPublished: boolean;
  schoolId: number;
  classRoomId: number;
  subjectId: number;
  createdAt: string;
  updatedAt: string | null;
}

// Matches MarksEntryRequest.java
export interface MarksEntryRequest {
  studentId: number;
  examId: number;
  marksObtained?: number;
  grade?: string;
  remarks?: string;
  isAbsent?: boolean;
}

// Marks entity
export interface Marks {
  id: number;
  marksObtained: number;
  grade: string | null;
  remarks: string | null;
  isAbsent: boolean;
  examId: number;
  studentId: number;
  schoolId: number;
  enteredBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

// Exam statistics
export interface ExamStatistics {
  examId: number;
  totalStudents: number;
  appeared: number;
  absent: number;
  passed: number;
  failed: number;
  passPercentage: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
}
