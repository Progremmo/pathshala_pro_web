'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { useFeeReport, useClassAttendanceReport, useStudentPerformanceReport } from '@/hooks/use-reports';
import { useClassrooms } from '@/hooks/use-schools';
import { useUsers } from '@/hooks/use-users';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, TrendingUp, Users, DollarSign, BookOpen, Calendar as CalendarIcon, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, startOfYear, endOfYear } from 'date-fns';

const AVAILABLE_YEARS = [2024, 2025, 2026, 2027];
const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

export default function ReportsPage() {
  const { schoolId } = useAuthStore();
  const [activeTab, setActiveTab] = useState('financial');
  
  // Financial Filters
  const [feeYear, setFeeYear] = useState<number>(new Date().getFullYear());
  
  // Attendance Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: format(startOfYear(new Date()), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  // Academic Filters
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [academicYear, setAcademicYear] = useState('2024-25');

  // Queries
  const { data: feeRes, isLoading: loadingFee } = useFeeReport(schoolId || 0, feeYear);
  const { data: classroomsRes } = useClassrooms(schoolId || 0);
  const classrooms = classroomsRes?.data || [];
  
  const { data: studentsRes } = useUsers({ schoolId: schoolId || 0, role: 'STUDENT', page: 0, size: 200 });
  const students = studentsRes?.data?.content || [];

  const { data: attendRes, isLoading: loadingAttend } = useClassAttendanceReport(
    schoolId || 0, Number(selectedClassId), dateRange.start, dateRange.end
  );

  const { data: perfRes, isLoading: loadingPerf } = useStudentPerformanceReport(
    schoolId || 0, Number(selectedStudentId), Number(selectedClassId), academicYear, dateRange.start, dateRange.end
  );

  // Financial Data Prep
  const rawFeeReport = (feeRes?.data as Record<string, any>) ?? {};
  const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const feeChartData = MONTHS.map((m, i) => {
    const entry = rawFeeReport[m] || {};
    return {
      month: MONTH_SHORT[i],
      collected: entry.totalCollected ?? 0,
      pending: entry.totalPending ?? 0,
    };
  });

  // Attendance Data Prep
  const rawAttendData = (attendRes?.data as Record<string, any>) || {};
  const attendChartData = Object.entries(rawAttendData).map(([date, stats]: [string, any]) => ({
    date: format(new Date(date), 'dd MMM'),
    present: stats.presentCount || 0,
    absent: stats.absentCount || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Reports & Analytics" description="Deep insights into school performance" />
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="financial" className="gap-2"><DollarSign className="h-4 w-4" /> Financial</TabsTrigger>
          <TabsTrigger value="academic" className="gap-2"><BookOpen className="h-4 w-4" /> Academic</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2"><Users className="h-4 w-4" /> Attendance</TabsTrigger>
        </TabsList>

        {/* Financial Content */}
        <TabsContent value="financial" className="space-y-6">
          <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="space-y-1.5 flex-1 max-w-[200px]">
              <Label>Academic Year</Label>
              <Select value={String(feeYear)} onValueChange={(v) => v && setFeeYear(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AVAILABLE_YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Total Collected</p>
                    <p className="text-3xl font-bold mt-2 text-emerald-700">
                      ₹{feeChartData.reduce((acc, d) => acc + d.collected, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Total Outstanding</p>
                    <p className="text-3xl font-bold mt-2 text-amber-700">
                      ₹{feeChartData.reduce((acc, d) => acc + d.pending, 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                    <p className="text-3xl font-bold mt-2">
                      {Math.round((feeChartData.reduce((acc, d) => acc + d.collected, 0) / 
                       (feeChartData.reduce((acc, d) => acc + (d.collected + d.pending), 0) || 1)) * 100)}%
                    </p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Fee Collection</CardTitle>
              <CardDescription>Breakdown of revenue vs pending dues</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFee ? (
                <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={feeChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => v ? `₹${v/1000}k` : '0'} />
                    <Tooltip formatter={(v: any) => v ? `₹${v.toLocaleString('en-IN')}` : '0'} />
                    <Legend />
                    <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Content */}
        <TabsContent value="academic" className="space-y-6">
          <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label>Select Student</Label>
              <Select value={selectedStudentId} onValueChange={(v) => v && setSelectedStudentId(v)}>
                <SelectTrigger><SelectValue placeholder="Search student..." /></SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.fullName} ({s.admissionNumber || s.id})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label>Academic Year</Label>
              <Select value={academicYear} onValueChange={(v) => v && setAcademicYear(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedStudentId ? (
            <div className="text-center py-24 border-2 border-dashed rounded-2xl">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">Select a student to view their performance analysis.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Marks Distribution</CardTitle></CardHeader>
                <CardContent>
                  {loadingPerf ? <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" /> : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(perfRes?.data?.examMarks || {}).map(([sub, mark]: any) => ({ sub, mark }))}>
                        <XAxis dataKey="sub" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="mark" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Overall Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Attendance Percentage</span>
                      <span className="font-bold text-primary">{(perfRes?.data as any)?.attendancePercentage ?? 0}%</span>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Average Exam Score</span>
                      <span className="font-bold text-primary">{(perfRes?.data as any)?.averageMarks ?? 0}</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Attendance Content */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <Label>Classroom</Label>
              <Select value={selectedClassId} onValueChange={(v) => v && setSelectedClassId(v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classrooms.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 min-w-[150px]">
              <Label>Start Date</Label>
              <Input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
            </div>
            <div className="space-y-1.5 min-w-[150px]">
              <Label>End Date</Label>
              <Input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
            </div>
          </div>

          {!selectedClassId ? (
            <div className="text-center py-24 border-2 border-dashed rounded-2xl">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">Select a classroom and date range to view attendance trends.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Daily presence vs absence count</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAttend ? <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" /> : (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={attendChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
