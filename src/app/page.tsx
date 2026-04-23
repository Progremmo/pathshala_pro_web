'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ROLE_ROUTES } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, roles } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Redirect to role-specific dashboard
    const primaryRole = roles[0];
    const route = primaryRole ? ROLE_ROUTES[primaryRole] : '/login';
    router.replace(route);
  }, [isAuthenticated, roles, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading PathshalaPro...</p>
      </div>
    </div>
  );
}
