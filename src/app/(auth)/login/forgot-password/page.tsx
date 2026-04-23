'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword, useResetPassword } from '@/hooks/use-auth';
import Link from 'next/link';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain uppercase, lowercase, and a digit'),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  
  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = (data: EmailFormValues) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep(2);
      }
    });
  };

  const onResetSubmit = (data: ResetFormValues) => {
    resetPassword.mutate({ ...data, email }, {
      onSuccess: () => {
        setStep(3);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Reset Password"}
              {step === 3 && "Password Reset!"}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm">
              {step === 1 && "Enter your email to receive a password reset OTP"}
              {step === 2 && `We've sent a 6-digit OTP to ${email}`}
              {step === 3 && "Your password has been successfully updated."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@pathshalapro.com" 
                    className="pl-10 h-11 bg-background/50" 
                    {...emailForm.register('email')}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="h-11 w-full font-semibold" disabled={forgotPassword.isPending}>
                {forgotPassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
              </Button>
              <div className="pt-2 text-center">
                <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">OTP Code</Label>
                <Input 
                  id="otp" 
                  placeholder="123456" 
                  maxLength={6} 
                  className="h-11 text-center text-xl tracking-[0.5em] font-bold bg-background/50" 
                  {...resetForm.register('otp')}
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-xs text-destructive">{resetForm.formState.errors.otp.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-background/50" 
                    {...resetForm.register('newPassword')}
                  />
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="h-11 w-full font-semibold" disabled={resetPassword.isPending}>
                {resetPassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reset Password"}
              </Button>
              <div className="pt-2 text-center">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <Button className="h-11 w-full font-semibold" onClick={() => router.push('/login')}>
                Sign In Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
