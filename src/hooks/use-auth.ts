import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterUserRequest, RegisterAdminRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth.types';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // setAuth expects the entire AuthResponse object
        setAuth(response.data);
        toast.success('Login successful');
        
        // Redirect based on role
        const roles = response.data.roles;
        if (roles.includes('PROJECT_ADMIN')) {
          router.push('/admin');
        } else {
          router.push('/school');
        }
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Invalid credentials');
    },
  });
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: (data: RegisterUserRequest) => authService.register(data),
    onSuccess: () => {
      toast.success('User registered successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register user');
    },
  });
}

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: (data: RegisterAdminRequest) => authService.registerAdmin(data),
    onSuccess: () => {
      toast.success('Administrator registered successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register administrator');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success('OTP sent to your email');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send OTP');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successful');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password');
    },
  });
}

