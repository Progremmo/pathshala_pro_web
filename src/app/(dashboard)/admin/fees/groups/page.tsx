'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Search, 
  AlertCircle,
  Loader2,
  ChevronRight
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
import { useAuthStore } from '@/store/auth-store';
import { useFeeHeads, useFeeGroups, useCreateFeeGroup } from '@/hooks/use-fees';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function FeeGroupsPage() {
  const { schoolId } = useAuthStore();
  const { data: headsRes } = useFeeHeads(schoolId || 1);
  const { data: groupsRes, isLoading } = useFeeGroups(schoolId || 1);
  const createMutation = useCreateFeeGroup(schoolId || 1);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('');
  const [items, setItems] = useState<{ feeHeadId: number; amount: string }[]>([]);

  const heads = headsRes?.data || [];
  const groups = groupsRes?.data || [];

  const addItem = () => {
    setItems([...items, { feeHeadId: 0, amount: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleCreate = async () => {
    if (!name) return toast.error('Please enter a name');
    if (items.length === 0) return toast.error('Please add at least one fee item');
    
    await createMutation.mutateAsync({
      name,
      description,
      grade,
      items: items.map(i => ({ feeHeadId: i.feeHeadId, amount: parseFloat(i.amount) }))
    });
    
    setOpen(false);
    setName('');
    setDescription('');
    setGrade('');
    setItems([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Fee Groups"
        description="Bundle multiple fee heads into groups for easy class assignments."
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Create Fee Group
            </Button>
          } />
          <DialogContent className="sm:max-w-[600px] border-none shadow-2xl overflow-hidden p-0">
            <div className="bg-gradient-to-r from-primary to-primary-foreground/10 p-6 text-white">
              <DialogTitle className="text-xl font-bold">New Fee Group</DialogTitle>
              <DialogDescription className="text-white/80">
                Define a group of fees with specific amounts.
              </DialogDescription>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" placeholder="e.g. Class 10 Standard" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Applicable Grade</Label>
                    <Select onValueChange={(val) => setGrade(val || '')} value={grade}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                          <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" placeholder="Brief details..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Fee Items</Label>
                  <Button variant="outline" size="sm" onClick={addItem} className="h-8">
                    <Plus className="h-3 w-3 mr-1" /> Add Head
                  </Button>
                </div>
                
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end bg-accent/30 p-3 rounded-lg border border-border/50 animate-in zoom-in-95">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select Fee Head</Label>
                      <Select 
                        onValueChange={(val) => updateItem(index, 'feeHeadId', parseInt(val || '0'))}
                        value={item.feeHeadId ? item.feeHeadId.toString() : undefined}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose Head" />
                        </SelectTrigger>
                        <SelectContent>
                          {heads.map((h: any) => (
                            <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-[120px] space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Amount (₹)</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="bg-background"
                        value={item.amount}
                        onChange={(e) => updateItem(index, 'amount', e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg bg-accent/10">
                    <p className="text-xs text-muted-foreground">No items added yet. Click 'Add Head' to start.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Fee Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse bg-accent/20 border-none h-48" />
          ))
        ) : groups.length > 0 ? (
          groups.map((group: any) => (
            <Card key={group.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-br from-card to-accent/20 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{group.name}</CardTitle>
                      {group.grade && (
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">Grade {group.grade}</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-1">{group.description || 'No description'}</CardDescription>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Settings className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Included Fees</p>
                  <div className="space-y-1.5">
                    {group.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-accent/30 border border-border/50">
                        <span className="font-medium">{item.feeHeadName}</span>
                        <span className="font-bold text-primary">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Total Group Amount</p>
                  <p className="text-lg font-black text-primary">
                    ₹{group.items.reduce((acc: number, curr: any) => acc + curr.amount, 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-card shadow-sm">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Create Your First Group</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              Group multiple fee heads (like Tuition + Library + Transport) to assign them to classes at once.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
