'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Clock,
  Megaphone
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useGenerateInvoices, useNotifyParents } from '@/hooks/use-fees';
import { useClassrooms } from '@/hooks/use-schools';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function GenerateInvoicesPage() {
  const { schoolId } = useAuthStore();
  const { data: classroomsRes } = useClassrooms(schoolId || 1);
  const generateMutation = useGenerateInvoices(schoolId || 1);
  const notifyMutation = useNotifyParents(schoolId || 1);
  
  const [classId, setClassId] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [month, setMonth] = useState(new Date().getMonth() + 1 + '');
  const [year, setYear] = useState(new Date().getFullYear() + '');
  const [dueDate, setDueDate] = useState('');
  const [generated, setGenerated] = useState(false);

  const classrooms = classroomsRes?.data || [];

  const handleGenerate = async () => {
    if (!classId || !dueDate) return toast.error('Please select class and due date');
    
    await generateMutation.mutateAsync({
      classId: parseInt(classId),
      academicYear,
      month: parseInt(month),
      year: parseInt(year),
      dueDate
    });
    setGenerated(true);
  };

  const handleNotify = async () => {
    await notifyMutation.mutateAsync({
      classId: classId ? parseInt(classId) : undefined,
      academicYear
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Bulk Invoice Generation"
        description="Generate invoices for all students in a class based on their allocated fee groups."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-2xl bg-gradient-to-br from-card to-accent/20">
          <CardHeader>
            <CardTitle>Generation Settings</CardTitle>
            <CardDescription>Select the period and target class</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Classroom</Label>
              <Select onValueChange={(val) => setClassId(val || '')} value={classId}>
                <SelectTrigger className="h-12 bg-background border-none shadow-sm">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map((c: any) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name} - {c.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Month</Label>
                <Select onValueChange={(val) => setMonth(val || '')} value={month}>
                  <SelectTrigger className="bg-background border-none shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Year</Label>
                <Select onValueChange={(val) => setYear(val || '')} value={year}>
                  <SelectTrigger className="bg-background border-none shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Due Date</Label>
              <input 
                type="date" 
                className="flex h-12 w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-none shadow-sm"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/30 mt-4 group"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Play className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
              )}
              Generate Invoices
            </Button>

            {generated && (
              <Button 
                variant="outline"
                className="w-full h-14 text-lg font-bold border-primary text-primary hover:bg-primary/5 mt-4 group border-2"
                onClick={handleNotify}
                disabled={notifyMutation.isPending}
              >
                {notifyMutation.isPending ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Megaphone className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                )}
                Notify All Parents
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-primary/5 border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• System identifies all students in the selected class.</p>
              <p>• It checks for any allocated <strong>Fee Groups</strong> for the selected academic year.</p>
              <p>• A new invoice is created for each student with the total amount of the group.</p>
              <p>• Individual fee heads are added as line items.</p>
              <p>• System prevents duplicate generation for the same student and month.</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-amber-500/5 border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Pre-requisites
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Ensure <strong>Fee Groups</strong> are created.</p>
              <p>• Ensure <strong>Allocations</strong> are done for the target class.</p>
              <p>• Ensure students are enrolled in the classroom.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
