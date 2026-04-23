import { RoleName } from './auth.types';

// Matches UserResponse.java
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  profilePicUrl: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  admissionNo: string | null;
  employeeId: string | null;
  qualification: string | null;
  joiningDate: string | null;
  roles: RoleName[];
  schoolId: number | null;
  schoolName: string | null;
  classRoomId: number | null;
  classRoomName: string | null;
  parentId: number | null;
  parentName: string | null;
  createdAt: string;
}
