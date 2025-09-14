import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEventSessions, downloadSessionPdf, downloadEventPdf } from '@/lib/api/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function ReportEventDetailPage() {
  const { id } = useParams();
  const [filter, setFilter] = useState<'all'|'present'|'absent'>('all');
  const { data, isLoading } = useQuery({ queryKey: ['report-event', id], queryFn: ()=> fetchEventSessions(id!), enabled: !!id });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">{data?.event.name || 'Event'} - Sessions</h1>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v:any)=>setFilter(v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="present">Presentees</SelectItem>
              <SelectItem value="absent">Absentees</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={()=>downloadEventPdf(id!, filter)}>Export Event</Button>
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.sessions.filter(s=>s.attendance_taken).map(s => {
          const total = s.present + s.absent;
          const pct = total ? (s.present/total)*100 : 0;
          return (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between items-start gap-2">
                  <span>{s.session_date} {s.start_time}-{s.end_time}</span>
                  <Button size="sm" variant="outline" onClick={()=>downloadSessionPdf(s.id, filter)}>Export</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div className="flex justify-between"><span>Present:</span><span>{s.present}</span></div>
                <div className="flex justify-between"><span>Absent:</span><span>{s.absent}</span></div>
                <div className="flex justify-between"><span>Attendance %:</span><span>{pct.toFixed(1)}%</span></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {data && data.sessions.filter(s=>s.attendance_taken).length===0 && (
        <div className="text-sm text-muted-foreground">No completed sessions yet.</div>
      )}
    </div>
  );
}
