export interface NotesRequest {
  title: string;
  description?: string;
  contentUrl: string;
  fileUrl?: string; // Compatibility
  contentType: 'PDF' | 'IMAGE' | 'VIDEO' | 'DOC';
  subjectId: number;
  classRoomId?: number;
  grade?: string;
  academicYear?: string;
  isVisible: boolean;
}

export interface NotesResponse {
  id: number;
  title: string;
  description: string | null;
  contentUrl: string;
  fileUrl: string; // Compatibility
  contentType: 'PDF' | 'IMAGE' | 'VIDEO' | 'DOC';
  subjectId: number;
  subjectName: string;
  uploadedBy: string;
  uploadedByName: string; // Name of the uploader
  uploadedDate: string;
  classRoomId: number | null;
  classRoomName: string | null;
  grade: string | null;
  academicYear: string | null;
  isVisible: boolean;
}

export type Notes = NotesResponse;