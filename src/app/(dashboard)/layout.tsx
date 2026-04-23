'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { ROLE_ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mobileSidebarOpen, setMobileSidebar } = useUIStore();
  const { isAuthenticated, roles } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // Not authenticated → redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Check role-based access
    const primaryRole = roles[0];
    if (primaryRole) {
      const allowedPrefix = ROLE_ROUTES[primaryRole];
      // If user is at a role path they don't have access to, redirect to their own dashboard
      const rolePrefixes = Object.values(ROLE_ROUTES);
      const currentPrefix = rolePrefixes.find((prefix) => pathname.startsWith(prefix));
      if (currentPrefix && currentPrefix !== allowedPrefix) {
        router.replace(allowedPrefix);
      }
    }
  }, [hydrated, isAuthenticated, roles, pathname, router]);

  // Show loading while Zustand hydrates
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebar}>
        <SheetContent side="left" className="w-[260px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className={cn('flex flex-1 flex-col overflow-hidden transition-all duration-300')}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
