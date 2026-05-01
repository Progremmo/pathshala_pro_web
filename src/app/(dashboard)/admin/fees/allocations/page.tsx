'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Link as LinkIcon, 
  Search, 
  Users, 
  School,
  Loader2,
  Calendar
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useFeeGroups, useCreateFeeAllocation } from '@/hooks/use-fees';
import { useClassrooms } from '@/hooks/use-schools';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function FeeAllocationsPage() {
  const { schoolId } = useAuthStore();
  const { data: groupsRes } = useFeeGroups(schoolId || 1);
  const { data: classroomsRes } = useClassrooms(schoolId || 1);
  const allocateMutation = useCreateFeeAllocation(schoolId || 1);
  
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [classId, setClassId] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');

  const groups = groupsRes?.data || [];
  const classrooms = classroomsRes?.data || [];

  const handleAllocate = async () => {
    if (!groupId || !classId) return toast.error('Please select both group and class');
    
    await allocateMutation.mutateAsync({
      groupId: parseInt(groupId),
      classId: parseInt(classId),
      academicYear
    });
    
    setOpen(false);
    setGroupId('');
    setClassId('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Fee Allocations"
        description="Assign fee groups to specific classes for the academic year."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <LinkIcon className="h-4 w-4" /> New Allocation
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle>Allocate Fees</DialogTitle>
              <DialogDescription>
                Assign a fee group to a classroom. All students in this class will be linked to these fees.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Academic Year</Label>
                <Select onValueChange={(val) => setAcademicYear(val || '')} defaultValue={academicYear}>
                  <SelectTrigger className="bg-accent/50 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Select Fee Group</Label>
                <Select onValueChange={(val) => setGroupId(val || '')} value={groupId}>
                  <SelectTrigger className="bg-accent/50 border-none h-12">
                    <SelectValue placeholder="Choose Fee Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((g: any) => (
                      <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 text-center text-muted-foreground py-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-[10px] font-bold uppercase">Allocate To</span>
                  <div className="h-px bg-border flex-1" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Select Class</Label>
                <Select onValueChange={(val) => setClassId(val || '')} value={classId}>
                  <SelectTrigger className="bg-accent/50 border-none h-12">
                    <SelectValue placeholder="Choose Classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name} - Section {c.section}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleAllocate} 
              disabled={allocateMutation.isPending}
              className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20"
            >
              {allocateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Allocation
            </Button>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-6">
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent/30 to-transparent">
            <CardTitle className="text-base">Existing Allocations</CardTitle>
            <CardDescription>Fee structures assigned to classes for 2024-25</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {classrooms.map((cls: any) => (
                <div key={cls.id} className="flex items-center justify-between p-6 hover:bg-accent/20 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <School className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">{cls.name} - {cls.section}</h4>
                      <div className="flex gap-4">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {cls.students?.length || 0} Students
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {cls.academicYear}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {/* In a real app, I'd filter allocations per class here */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-center">
                      <p className="text-[10px] font-bold text-primary uppercase">Assigned Group</p>
                      <p className="text-sm font-semibold">Standard Monthly</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
