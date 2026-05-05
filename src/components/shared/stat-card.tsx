import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconClassName?: string;
  loading?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, iconClassName, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <span className={cn('text-xs font-semibold', trend.value >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconClassName || 'bg-primary/10')}>
            <Icon className={cn('h-5 w-5', iconClassName ? 'text-white' : 'text-primary')} />
          </div>
        </div>
      </CardContent>
      {/* Decorative gradient strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </Card>
  );
}
