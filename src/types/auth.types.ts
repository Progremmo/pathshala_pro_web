// Matches backend RoleName enum exactly
export type RoleName = 'PROJECT_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

// Login request - matches LoginRequest.java
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response - matches AuthResponse.java
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  roles: RoleName[];
  schoolId: number | null;
  schoolName: string | null;
  classRoomId: number | null;
  expiresIn: number;
}

// Register request - matches RegisterUserRequest.java
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role: RoleName;
  schoolId?: number;
  classRoomId?: number;
  admissionNo?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  employeeId?: string;
  qualification?: string;
  joiningDate?: string;
  parentId?: number;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RegisterAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
