import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceApi, AttendanceSessionDetail } from '@/api/attendance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Save, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AttendancePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AttendanceSessionDetail | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!sessionId) return;
    setLoading(true);
    try {
      const d = await attendanceApi.getSession(sessionId);
      setDetail(d);
      const map: Record<string, boolean> = {};
      d.students.forEach(s => { map[s.id] = s.present; });
      setSelected(map);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [sessionId]);

  const toggle = (id: string) => setSelected(p => ({ ...p, [id]: !p[id] }));

  async function submit() {
    if (!sessionId) return;
    setSaving(true);
    try {
      const presentIds = Object.entries(selected).filter(([,v]) => v).map(([k]) => k);
      await attendanceApi.submit(sessionId, presentIds);
      load();
    } finally { setSaving(false); }
  }

  const presentCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1"><ArrowLeft className="h-4 w-4"/>Back</Button>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
      </div>
      {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
      {!loading && detail && (
        <div className="space-y-4">
          <Card className="p-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {format(parseISO(detail.session.session_date), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {detail.session.start_time} - {detail.session.end_time}</span>
              {detail.session.venue && <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {detail.session.venue}</span>}
              <Badge variant={detail.attendance_taken ? 'secondary':'outline'}>{detail.attendance_taken ? 'Completed':'In Progress'}</Badge>
              <Badge variant="outline">Present: {presentCount}</Badge>
              <Badge variant="outline">Total: {detail.students.length}</Badge>
            </div>
            <div className="flex justify-end">
              <Button onClick={submit} disabled={saving} className="gap-2"><Save className="h-4 w-4"/> {detail.attendance_taken ? 'Update' : 'Save'} Attendance</Button>
            </div>
          </Card>
          <Card className="p-0 overflow-hidden">
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="p-3 w-12">#</th>
                    <th className="p-3">USN</th>
                    <th className="p-3">Name</th>
                    <th className="p-3 text-center">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.students.map((st, idx) => (
                    <tr key={st.id} className="border-b last:border-none hover:bg-muted/20">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-mono text-xs">{st.usn}</td>
                      <td className="p-3">{st.full_name}</td>
                      <td className="p-3 text-center">
                        <Checkbox checked={!!selected[st.id]} onCheckedChange={() => toggle(st.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
