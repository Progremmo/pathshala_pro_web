'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, DollarSign, ClipboardList, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useSchoolConfigs, useUpdateSchoolConfigs } from '@/hooks/use-school-configs';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function SchoolSettingsPage() {
  const { schoolId } = useAuthStore();
  const { data: configs, isLoading } = useSchoolConfigs(schoolId || 0);
  const updateConfigs = useUpdateSchoolConfigs();

  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [feeTypes, setFeeTypes] = useState<string[]>([]);
  const [feeFrequencies, setFeeFrequencies] = useState<string[]>([]);
  const [examTypes, setExamTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (configs) {
      setAcademicYears(configs.ACADEMIC_YEARS);
      setFeeTypes(configs.FEE_TYPES);
      setFeeFrequencies(configs.FEE_FREQUENCIES);
      setExamTypes(configs.EXAM_TYPES);
    }
  }, [configs]);

  const handleSave = (key: string, value: any) => {
    if (!schoolId) return;
    updateConfigs.mutate({
      schoolId,
      configs: { [key]: JSON.stringify(value) }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="School Settings" 
        description="Manage your school's custom configurations and academic definitions."
      />

      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Academic Years
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Fee Settings
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Exam Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Years</CardTitle>
              <CardDescription>Define the academic terms for your school.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {academicYears.map((year, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                    <Input 
                      value={year} 
                      onChange={(e) => {
                        const newYears = [...academicYears];
                        newYears[index] = e.target.value;
                        setAcademicYears(newYears);
                      }}
                      className="h-8 bg-background"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => setAcademicYears(academicYears.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="h-12 border-dashed gap-2"
                  onClick={() => setAcademicYears([...academicYears, ''])}
                >
                  <Plus className="h-4 w-4" /> Add Year
                </Button>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => handleSave('ACADEMIC_YEARS', academicYears)}
                  disabled={updateConfigs.isPending}
                >
                  {updateConfigs.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Academic Years
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Types</CardTitle>
                <CardDescription>Categories of fees collected by the school.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {feeTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 pl-3 rounded-full border bg-background">
                      <span className="text-sm font-medium">{type}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full text-muted-foreground"
                        onClick={() => setFeeTypes(feeTypes.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="New type..." 
                      className="h-8 w-32" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value.trim().toUpperCase();
                          if (val && !feeTypes.includes(val)) {
                            setFeeTypes([...feeTypes, val]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={() => handleSave('FEE_TYPES', feeTypes)}
                    disabled={updateConfigs.isPending}
                  >
                    Save Fee Types
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fee Frequencies</CardTitle>
                <CardDescription>How often fees are collected (e.g., Monthly, Quarterly).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {feeFrequencies.map((freq, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 pl-3 rounded-full border bg-background">
                      <span className="text-sm font-medium">{freq}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full text-muted-foreground"
                        onClick={() => setFeeFrequencies(feeFrequencies.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Input 
                    placeholder="New freq..." 
                    className="h-8 w-32" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim().toUpperCase();
                        if (val && !feeFrequencies.includes(val)) {
                          setFeeFrequencies([...feeFrequencies, val]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={() => handleSave('FEE_FREQUENCIES', feeFrequencies)}
                    disabled={updateConfigs.isPending}
                  >
                    Save Frequencies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exam Types & Labels</CardTitle>
              <CardDescription>Configure how different exam types are labeled in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {Object.entries(examTypes).map(([key, label], index) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border-b pb-4 last:border-0">
                    <div className="sm:col-span-4 space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">Key (ID)</Label>
                      <Input value={key} readOnly className="h-9 bg-muted/50 font-mono text-xs" />
                    </div>
                    <div className="sm:col-span-7 space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">Display Label</Label>
                      <Input 
                        value={label} 
                        onChange={(e) => {
                          setExamTypes({ ...examTypes, [key]: e.target.value });
                        }}
                        className="h-9"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-destructive"
                        onClick={() => {
                          const newTypes = { ...examTypes };
                          delete newTypes[key];
                          setExamTypes(newTypes);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-4">
                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">New Key</Label>
                    <Input id="new-exam-key" placeholder="e.g. SURPRISE_TEST" className="h-9" />
                  </div>
                  <div className="sm:col-span-7 space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">New Label</Label>
                    <Input id="new-exam-label" placeholder="e.g. Surprise Test" className="h-9" />
                  </div>
                  <div className="sm:col-span-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={() => {
                        const keyInput = document.getElementById('new-exam-key') as HTMLInputElement;
                        const labelInput = document.getElementById('new-exam-label') as HTMLInputElement;
                        const key = keyInput.value.trim().toUpperCase();
                        const label = labelInput.value.trim();
                        if (key && label) {
                          setExamTypes({ ...examTypes, [key]: label });
                          keyInput.value = '';
                          labelInput.value = '';
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => handleSave('EXAM_TYPES', examTypes)}
                  disabled={updateConfigs.isPending}
                >
                  Save Exam Types
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
