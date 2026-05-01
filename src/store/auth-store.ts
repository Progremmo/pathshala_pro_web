import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, RoleName } from '@/types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  email: string | null;
  fullName: string | null;
    roles: RoleName[];
  schoolId: number | null;
  schoolName: string | null;
  classRoomId: number | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
  getPrimaryRole: () => RoleName | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      fullName: null,
      roles: [],
      schoolId: null,
      schoolName: null,
      classRoomId: null,
      isAuthenticated: false,

      setAuth: (response: AuthResponse) => {
        // Also store tokens in localStorage for Axios interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          roles: response.roles,
          schoolId: response.schoolId,
          schoolName: response.schoolName,
          classRoomId: response.classRoomId,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          email: null,
          fullName: null,
          roles: [],
          schoolId: null,
          schoolName: null,
          classRoomId: null,
          isAuthenticated: false,
        });
      },

      getPrimaryRole: () => {
        const { roles } = get();
        if (roles.length === 0) return null;
        // Priority order
        const priority: RoleName[] = ['PROJECT_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];
        return priority.find((r) => roles.includes(r)) || roles[0];
      },
    }),
    {
      name: 'pathshala-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        email: state.email,
        fullName: state.fullName,
        roles: state.roles,
        schoolId: state.schoolId,
        schoolName: state.schoolName,
        classRoomId: state.classRoomId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
