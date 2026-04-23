import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { RegisterAdminRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth.types';
import { toast } from 'sonner';

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: (data: RegisterAdminRequest) => authService.registerAdmin(data),
    onSuccess: () => {
      toast.success('Admin registered successfully', {
        description: 'Credentials have been sent to their email address.',
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register admin');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: () => {
      toast.success('OTP Sent', {
        description: 'If the email is registered, an OTP has been sent.',
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process request');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password Reset Successfully', {
        description: 'You can now login with your new password.',
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password');
    },
  });
}
