import { useEffect, useState } from 'react';
import { attendanceApi, MySessionSummary } from '@/api/attendance';
import { cn } from '@/utils/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<MySessionSummary[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await attendanceApi.mySessions();
      setSessions(list);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Sessions</h1>
      </div>
      {loading && <div className="text-sm text-muted-foreground">Loading sessions...</div>}
      {!loading && sessions.length === 0 && (
        <div className="text-sm text-muted-foreground">No upcoming sessions.</div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map(s => {
          const d = parseISO(s.session_date);
          const taken = s.attendance_taken;
          return (
            <Card key={s.id} className={cn('p-4 flex flex-col gap-3 border transition hover:shadow-md', taken && 'border-green-500/50')}> 
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-medium leading-tight">{s.event_name}</div>
                  <div className="text-xs text-muted-foreground">{s.batch_name}</div>
                </div>
                {taken ? <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3"/>Done</Badge> : <Badge className="gap-1" variant={isToday(d) ? 'default':'outline'}>{isToday(d)?'Today':'Upcoming'}</Badge>}
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(d,'MMM d, yyyy')}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.start_time} - {s.end_time}</div>
                {s.venue && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.venue}</div>}
              </div>
              <div className="mt-2">
                <Button asChild size="sm" className="w-full justify-between group">
                  <Link to={`/attendance/${s.id}`}>{taken? 'Review Attendance':'Take Attendance'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5"/></Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
