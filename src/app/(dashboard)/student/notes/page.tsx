'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function StudentNotes() {
  const { schoolId } = useAuthStore();
  const [search, setSearch] = useState('');

  const { data: notesResponse, isLoading } = useQuery({
    queryKey: ['notes', schoolId],
    queryFn: () => notesService.getAll(schoolId!),
    enabled: !!schoolId,
  });

  const notes = notesResponse?.data?.content || [];
  
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Study Material" 
        description="Access your class notes, assignments and resources" 
      />

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or subject..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note: any) => (
            <Card key={note.id} className="hover:border-primary/50 transition-colors bg-card/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(note.fileUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{note.subjectName}</p>
                  <h3 className="font-semibold text-sm mt-1 line-clamp-1">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">
                    {note.description || 'No description available.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                  <p className="text-[10px] text-muted-foreground">
                    By {note.uploadedBy} • {format(new Date(note.uploadedDate), 'MMM d, yyyy')}
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs font-bold" onClick={() => window.open(note.fileUrl, '_blank')}>
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
            <p>No study material found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
