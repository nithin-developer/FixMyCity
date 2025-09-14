import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi, EventDetail, EventSessionInput } from "@/api/events";
import { listBatches } from "@/api/batches";
import { listTrainers } from "@/api/trainers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, eachDayOfInterval } from "date-fns";

function buildTimeOptions() {
  const opts: string[] = [];
  const start = 7 * 60; // 7:00
  const end = 19 * 60; // 19:00 (7PM)
  for (let m = start; m <= end; m += 30) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    opts.push(
      `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`
    );
  }
  return opts;
}
const TIME_OPTS = buildTimeOptions();
function to12h(t: string) {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${am ? "AM" : "PM"}`;
}
function from12h(s: string) {
  const match = s.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
const UNASSIGNED_TRAINER = "none";

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // form state
  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [trainingCompany, setTrainingCompany] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sessions, setSessions] = useState<EventSessionInput[]>([]);

  useEffect(() => {
    async function load() {
      try {
  const [ev, b, t] = await Promise.all([
          eventsApi.get(id!),
          listBatches(),
          listTrainers(),
        ]);
        setEvent(ev);
  setBatches(b as any[]);
  setTrainers(t as any[]);
        setName(ev.name);
  setBatchId(ev.batch_id);
        setTrainingCompany(ev.training_company || "");
        setDateRange({
          from: parseISO(ev.start_date),
          to: parseISO(ev.end_date),
        });
        setSessions(ev.sessions.map((s) => ({ ...s })));
      } catch (e: any) {
        setError(e.response?.data?.error || "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  function updateSession(idx: number, patch: Partial<EventSessionInput>) {
    setSessions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s))
    );
  }
  function addSessionForDate(date: string) {
    setSessions((prev) => [
      ...prev,
      {
        session_date: date,
        start_time: "09:00",
        end_time: "10:00",
        venue: "",
        trainer_id: null,
      },
    ]);
  }
  function removeSession(idx: number) {
    setSessions((prev) => prev.filter((_, i) => i !== idx));
  }

  function syncSessionsToRange() {
    if (!dateRange.from || !dateRange.to) return;
    const inRange = eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).map(d=> format(d,'yyyy-MM-dd'));
    let filtered = sessions.filter(s => inRange.includes(s.session_date));
    // Ensure at least one session per in-range day
    for (const day of inRange) {
      if (!filtered.some(s => s.session_date === day)) {
        filtered.push({ session_date: day, start_time: '09:00', end_time: '10:00', venue: '', trainer_id: null });
      }
    }
    setSessions(filtered.sort((a,b)=> a.session_date.localeCompare(b.session_date)));
  }

  function proceedToStep2() {
    if(!name.trim() || !batchId || !dateRange.from || !dateRange.to) { setError('Fill required fields'); return; }
    setError(null);
    syncSessionsToRange();
    setStep(2);
  }

  async function handleSave() {
    if (!event) return;
    setSaving(true);
    try {
      const updated = await eventsApi.update(event.id, {
        name: name.trim(),
        batch_id: batchId,
        training_company: trainingCompany.trim() || null,
        start_date: format(dateRange.from!, "yyyy-MM-dd"),
        end_date: format(dateRange.to!, "yyyy-MM-dd"),
        sessions: sessions.map((s) => ({
          session_date: s.session_date,
          start_time: s.start_time,
          end_time: s.end_time,
          trainer_id: s.trainer_id || null,
          venue: s.venue || null,
        })),
      });
      setEvent(updated as any);
      navigate("/events");
    } catch (e: any) {
      setError(e.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const daysList =
    dateRange.from && dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).map(
          (d) => format(d, "yyyy-MM-dd")
        )
      : [];

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-destructive">{error}</div>;
  if (!event) return <div className="p-4">Not found</div>;

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      <h1 className="text-xl font-semibold">Edit Event</h1>
      {step === 1 && (
        <Card className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Batch *</Label>
              <Select value={batchId} onValueChange={setBatchId}>
                <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((b:any) => <SelectItem key={b.id} value={b.id}>{b.batch_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Training Company</Label>
              <Input value={trainingCompany} onChange={(e) => setTrainingCompany(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Date Range *</Label>
              <Calendar
                mode="range"
                selected={dateRange as any}
                onSelect={setDateRange as any}
                numberOfMonths={2}
              />
            </div>
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={proceedToStep2}>Next</Button>
          </div>
        </Card>
      )}
      {step === 2 && (
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Sessions</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </div>
        {daysList.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Select a date range first.
          </div>
        )}
        {daysList.map((day) => (
          <div key={day} className="space-y-2 border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">
                {format(new Date(day), "PPP")}
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => addSessionForDate(day)}
              >
                Add Session
              </Button>
            </div>
            <div className="space-y-3">
              {sessions
                .filter((s) => s.session_date === day)
                .map((s) => {
                  const index = sessions.indexOf(s);
                  return (
                    <div
                      key={index}
                      className="grid md:grid-cols-6 gap-2 items-end"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs">Start</Label>
                        <Select value={to12h(s.start_time)} onValueChange={(val)=> { const iso = from12h(val); if(iso) updateSession(index,{start_time: iso}); }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{TIME_OPTS.map(t=> <SelectItem key={t} value={to12h(t)}>{to12h(t)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End</Label>
                        <Select value={to12h(s.end_time)} onValueChange={(val)=> { const iso = from12h(val); if(iso) updateSession(index,{end_time: iso}); }}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{TIME_OPTS.map(t=> <SelectItem key={t} value={to12h(t)}>{to12h(t)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Trainer</Label>
                        <Select
                          value={s.trainer_id ?? UNASSIGNED_TRAINER}
                          onValueChange={(val) =>
                            updateSession(index, {
                              trainer_id:
                                val === UNASSIGNED_TRAINER ? null : val,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UNASSIGNED_TRAINER}>
                              Unassigned
                            </SelectItem>
                            {trainers.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.fullname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-xs">Venue</Label>
                        <Input
                          value={s.venue || ""}
                          onChange={(e) =>
                            updateSession(index, { venue: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeSession(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
  </Card>
  )}
    </div>
  );
}
