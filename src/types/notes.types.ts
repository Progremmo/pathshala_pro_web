// Matches NotesRequest.java
export interface NotesRequest {
  title: string;
  description?: string;
  contentUrl: string;
  contentType: string;
  subjectId: number;
  grade?: string;
  academicYear?: string;
  isVisible?: boolean;
}

// Notes entity
export interface Notes {
  id: number;
  title: string;
  description: string | null;
  contentUrl: string;
  contentType: string;
  grade: string | null;
  academicYear: string | null;
  isVisible: boolean;
  schoolId: number;
  subjectId: number;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string | null;
}
