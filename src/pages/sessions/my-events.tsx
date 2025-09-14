import { useEffect, useState, useMemo } from 'react';
import { fetchTrainerEvents, TrainerEventCard } from '@/api/attendance/my-events-aggregate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin, Search, Filter, CheckCircle2, ArrowRight, Layers3, Building2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Past (No Attendance)', value: 'past' },
];

export default function MyEventsPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TrainerEventCard[]>([]);

  async function load() {
    setLoading(true);
    try {
      const list = await fetchTrainerEvents({ status: status === 'all' ? undefined : status, search: search || undefined });
      setEvents(list);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [status, search]);

  const totalSessions = useMemo(()=> events.reduce((acc,e)=> acc + e.sessions.length,0), [events]);
  const completedSessions = useMemo(()=> events.reduce((acc,e)=> acc + e.sessions.filter(s=> s.attendance_taken).length,0), [events]);
  const completionPct = totalSessions === 0 ? 0 : Math.round((completedSessions/totalSessions)*100);
  const todayCount = useMemo(()=> events.filter(e=> e.status === 'today').length, [events]);
  const upcomingCount = useMemo(()=> events.filter(e=> e.status === 'upcoming').length, [events]);
  const completedEvents = useMemo(()=> events.filter(e=> e.status === 'completed').length, [events]);
  const pastEvents = useMemo(()=> events.filter(e=> e.status === 'past').length, [events]);

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header + Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">My Events</h1>
            <p className="text-sm text-muted-foreground">Overview of every event you are assigned to, including per-session attendance progress.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={v => setStatus(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input placeholder="Search events or batches" value={pendingSearch} onChange={e => setPendingSearch(e.target.value)} className="pl-8 w-64" />
              </div>
              <Button size="sm" variant="outline" onClick={() => setSearch(pendingSearch)} className="gap-1"><Filter className="h-4 w-4"/>Apply</Button>
            </div>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <CardDescription className="text-[11px]">Filtered total</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold tracking-tight">{events.length}</div>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20"/>
          </Card>
          <Card className="relative overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <CardDescription className="text-[11px]">All in these events</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-semibold tracking-tight">{totalSessions}</div>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20"/>
          </Card>
          <Card className="relative overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CardDescription className="text-[11px]">Completion {completionPct}%</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-semibold tracking-tight">{completedSessions}</div>
                <span className="text-xs text-muted-foreground">/ {totalSessions}</span>
              </div>
              <Progress value={completionPct} className="h-2" />
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20"/>
          </Card>
          <Card className="relative overflow-hidden group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status Mix</CardTitle>
              <CardDescription className="text-[11px]">Today / Upcoming</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Today</span><span className="font-medium">{todayCount}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Upcoming</span><span className="font-medium">{upcomingCount}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Completed</span><span className="font-medium">{completedEvents}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Past</span><span className="font-medium">{pastEvents}</span></div>
            </CardContent>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/60 to-primary/20"/>
          </Card>
        </div>
      </div>

      {loading && <div className="text-sm text-muted-foreground animate-pulse">Loading events...</div>}
      {!loading && events.length === 0 && <div className="text-sm text-muted-foreground">No events match your filters.</div>}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {events.map(ev => {
          const statusBadge = ev.status === 'today' ? 'default' : ev.status === 'completed' ? 'secondary' : ev.status === 'upcoming' ? 'outline' : 'destructive';
          const dateRange = `${format(parseISO(ev.start_date),'MMM d')} – ${format(parseISO(ev.end_date),'MMM d, yyyy')}`;
          return (
            <Card key={ev.id} className="flex flex-col overflow-hidden group border transition hover:shadow-lg hover:border-primary/40 relative">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-medium leading-tight line-clamp-2 text-base">{ev.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Layers3 className="h-3 w-3"/>{ev.batch_name}</div>
                  </div>
                  <Badge variant={statusBadge} className="capitalize gap-1">{ev.status}</Badge>
                </div>
                <div className="grid gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{dateRange}</div>
                  {ev.training_company && <div className="flex items-center gap-1"><Building2 className="h-3 w-3"/>{ev.training_company}</div>}
                </div>
                <div className="mt-2 space-y-1">
                  {ev.sessions.slice(0,3).map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-xs rounded-md border bg-muted/30 px-2 py-1">
                      <Badge variant="secondary" className="font-mono text-[10px] px-1 py-0 h-5">{s.start_time}-{s.end_time}</Badge>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{format(parseISO(s.session_date),'MMM d')}</span>
                      {s.venue && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/>{s.venue}</span>}
                      {s.attendance_taken && <CheckCircle2 className="h-3 w-3 text-green-500"/>}
                    </div>
                  ))}
                  {ev.sessions.length > 3 && <div className="text-[10px] text-muted-foreground">+ {ev.sessions.length - 3} more sessions</div>}
                </div>
              </div>
              <div className="p-3 pt-0">
                <Button asChild size="sm" className="w-full justify-between group" variant="outline">
                  <Link to={`/events/${ev.id}`}>View Event <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5"/></Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
