import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
        <GraduationCap className="h-10 w-10 text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-2 text-lg font-medium text-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
      <Link href="/">
        <Button className="gap-2"><Home className="h-4 w-4" /> Go Home</Button>
      </Link>
    </div>
  );
}
