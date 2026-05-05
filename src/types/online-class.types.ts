// Matches OnlineClassRequest.java
export interface OnlineClassRequest {
  title: string;
  description?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  platform?: string;
  scheduledAt: string;
  durationMinutes?: number;
  isRecurring?: boolean;
  recurrencePattern?: string;
  classRoomId: number;
  subjectId?: number;
  teacherId: number;
}

// OnlineClass entity
export interface OnlineClass {
  id: number;
  title: string;
  topic: string; // From backend response
  description: string | null;
  meetingLink: string | null;
  meetingId: string | null;
  meetingPassword: string | null;
  platform: string | null;
  scheduledAt: string;
  durationMinutes: number | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
  status: string;
  recordingUrl: string | null;
  schoolId: number;
  classRoomId: number;
  classRoomName: string; // From backend response
  subjectId: number | null;
  subjectName: string; // From backend response
  teacherId: number;
  createdAt: string;
  updatedAt: string | null;
}
