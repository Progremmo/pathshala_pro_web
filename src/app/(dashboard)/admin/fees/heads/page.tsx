'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Settings, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/auth-store';
import { useFeeHeads, useCreateFeeHead } from '@/hooks/use-fees';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function FeeHeadsPage() {
  const { schoolId } = useAuthStore();
  const { data: headsRes, isLoading } = useFeeHeads(schoolId || 1);
  const createMutation = useCreateFeeHead(schoolId || 1);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);

  const heads = headsRes?.data || [];

  const handleCreate = async () => {
    if (!name) return toast.error('Please enter a name');
    
    await createMutation.mutateAsync({
      name,
      description,
      isMandatory
    });
    
    setOpen(false);
    setName('');
    setDescription('');
    setIsMandatory(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Fee Heads"
        description="Define various types of fees applicable in your school."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Add Fee Head
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle>New Fee Head</DialogTitle>
              <DialogDescription>
                Create a new category of fee like 'Tuition Fee' or 'Transport'.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Tuition Fee" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="bg-accent/50 border-none"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input 
                  id="desc" 
                  placeholder="Brief description..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-accent/50 border-none"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                <div className="space-y-0.5">
                  <Label>Mandatory</Label>
                  <p className="text-xs text-muted-foreground">Is this fee required for all students?</p>
                </div>
                <Switch checked={isMandatory} onCheckedChange={setIsMandatory} />
              </div>
            </div>
            <Button 
              onClick={handleCreate} 
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Fee Head
            </Button>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse bg-accent/20 border-none h-32" />
          ))
        ) : heads.length > 0 ? (
          heads.map((head: any) => (
            <Card key={head.id} className="group relative overflow-hidden border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${head.isMandatory ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{head.name}</CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {head.isMandatory ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[10px] px-1.5 py-0">Mandatory</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-none text-[10px] px-1.5 py-0">Optional</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {head.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl bg-accent/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Fee Heads Yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
              Start by defining fee categories like Tuition, Transport, and Library fees.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
