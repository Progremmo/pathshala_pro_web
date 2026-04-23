'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers, useToggleUserStatus } from '@/hooks/use-users';
import { Loader2, Search, Filter, Mail, Phone, Building2, UserCircle, ShieldCheck } from 'lucide-react';
import { RoleName } from '@/types/auth.types';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

const ROLES: RoleName[] = ['SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'PROJECT_ADMIN'];

export default function GlobalUsersPage() {
  const [roleFilter, setRoleFilter] = useState<RoleName | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useUsers({ 
    page, 
    size: 50, 
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    search: search || undefined
  });
  
  const toggleStatus = useToggleUserStatus();

  const users = data?.data?.content || [];

  const handleToggleActive = (userId: number, currentStatus: boolean) => {
    toggleStatus.mutate({ id: userId, active: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Monitor and manage all users across the platform."
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg font-semibold">All Users</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role & School</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-muted-foreground">Fetching users...</p>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-muted-foreground">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <UserCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.fullName}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> ID: {user.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((r) => (
                                <Badge key={r} variant="outline" className="text-[10px] px-1 py-0 h-4">
                                  {r.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                            {user.schoolName && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{user.schoolName}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Switch 
                              checked={user.isActive} 
                              onCheckedChange={() => handleToggleActive(user.id, user.isActive)}
                              disabled={toggleStatus.isPending && toggleStatus.variables?.id === user.id}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
