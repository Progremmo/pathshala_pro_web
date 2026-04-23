'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { loginSchema, LoginFormData } from '@/utils/validation';
import { ROLE_ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      if (response.success && response.data) {
        setAuth(response.data);
        toast.success('Welcome back!', {
          description: `Logged in as ${response.data.fullName}`,
        });
        const primaryRole = response.data.roles[0];
        const route = ROLE_ROUTES[primaryRole] || '/';
        router.push(route);
      } else {
        toast.error('Login failed', { description: response.message });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error('Login failed', {
        description: err?.response?.data?.message || 'Invalid credentials. Please try again.',
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="glass border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">PathshalaPro</CardTitle>
            <CardDescription className="mt-1.5 text-sm">
              Sign in to your school management dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@pathshalapro.com"
                autoComplete="email"
                className="h-11 bg-background/50"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 bg-background/50 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
              <div className="flex justify-end">
                <Link 
                  href="/login/forgot-password" 
                  className="text-xs font-medium text-primary hover:underline transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border/60 bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">Demo Credentials</p>
            <p className="mt-1 font-mono text-xs text-foreground/70">
              admin@pathshalapro.com / Admin@123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
