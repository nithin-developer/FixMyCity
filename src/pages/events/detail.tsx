import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsApi, EventDetail } from '@/api/events';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/stores/authStore';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, User, Building2, Layers3, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const role = useAuth().user?.role;
  const canEdit = role === 'super_admin';
  const canDelete = role === 'super_admin';
  const isTrainer = role === 'Municipal_Officer';
  const trainerId = useAuth().user?.id;

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const ev = await eventsApi.get(id);
        setEvent(ev);
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const sessionsByDate = useMemo(() => {
    if (!event) return {} as Record<string, EventDetail['sessions']>;
    const grouped: Record<string, EventDetail['sessions']> = {};
    event.sessions.forEach((s) => {
      if (isTrainer && s.trainer_id && s.trainer_id !== trainerId) return; // Municipal_Officer sees only own sessions
      (grouped[s.session_date] ||= []).push(s);
    });
    // sort times inside each date
    Object.values(grouped).forEach(arr => arr.sort((a,b)=> a.start_time.localeCompare(b.start_time)));
    return grouped;
  }, [event, isTrainer, trainerId]);

  async function handleDelete() {
    if (!event) return;
    await eventsApi.delete(event.id);
    setDeleteOpen(false);
    navigate('/events');
  }

  if (loading) return <div className="p-6 text-sm">Loading event...</div>;
  if (error) return <div className="p-6 text-sm text-destructive">{error}</div>;
  if (!event) return <div className="p-6 text-sm">Not found</div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0"><ArrowLeft className="h-4 w-4"/></Button>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex-1">{event.name}</h1>
        {canEdit && (
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex"><Link to={`/events/${event.id}/edit`}><Edit className="h-4 w-4 mr-1"/>Edit</Link></Button>
        )}
        {canDelete && (
          <Button variant="destructive" size="sm" onClick={()=> setDeleteOpen(true)} className="hidden md:inline-flex"><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
        )}
      </div>

      {/* Overview */}
      <Card className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border-gradient-to-r from-border to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2"><Calendar className="h-4 w-4"/> Overview</CardTitle>
          <CardDescription>High-level details and schedule context.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide flex items-center gap-1"><Layers3 className="h-3 w-3"/> Batch</div>
            <div className="font-medium truncate">{event.batch_id}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide flex items-center gap-1"><Building2 className="h-3 w-3"/> Company</div>
            <div className="font-medium truncate">{event.training_company || '—'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide flex items-center gap-1"><Calendar className="h-3 w-3"/> Date Range</div>
            <div className="font-medium">{format(parseISO(event.start_date),'PP')} – {format(parseISO(event.end_date),'PP')}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wide flex items-center gap-1"><Clock className="h-3 w-3"/> Sessions</div>
            <div className="font-medium">{event.sessions.length}</div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Timeline */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2"><Clock className="h-4 w-4"/> Sessions Timeline</CardTitle>
          <CardDescription>{isTrainer ? 'Your assigned sessions' : 'Chronological grouping per day'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.keys(sessionsByDate).length === 0 && (
            <div className="text-sm text-muted-foreground">No sessions to display.</div>
          )}
          {Object.entries(sessionsByDate).sort((a,b)=> a[0].localeCompare(b[0])).map(([day, sess]) => (
            <div key={day} className="relative pl-6 group">
              <div className="absolute left-1 top-1 bottom-0 w-px bg-border/60 group-last:bottom-4"/>
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary shadow ring-2 ring-background"/>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">{format(parseISO(day), 'PPPP')}</div>
                  <div className="mt-3 grid gap-2">
                    {sess.map((s, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-md border bg-muted/30 backdrop-blur-sm px-3 py-2 hover:bg-muted/50 transition">
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="secondary" className="font-mono text-[11px] tracking-wide">
                            {s.start_time} – {s.end_time}
                          </Badge>
                          <span className="text-muted-foreground hidden md:inline">•</span>
                          <span className="font-medium flex items-center gap-1"><User className="h-3 w-3"/>{s.trainer_id ? 'Assigned' : 'Unassigned'}</span>
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                          {s.venue && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3"/>{s.venue}</span>}
                          {s.trainer_id && <Badge variant="outline" className="text-[10px]">Trainer ID {s.trainer_id.slice(0,8)}</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mobile actions */}
      <div className="flex md:hidden gap-3 pt-2">
        {canEdit && <Button asChild variant="outline" className="flex-1"><Link to={`/events/${event.id}/edit`}><Edit className="h-4 w-4 mr-1"/>Edit</Link></Button>}
        {canDelete && <Button variant="destructive" className="flex-1" onClick={()=> setDeleteOpen(true)}><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>}
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        title="Delete Event"
        description="This action will permanently remove the event and all its sessions."
        confirmText="Delete"
        onConfirm={handleDelete}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
