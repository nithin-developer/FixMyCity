import { apiClient } from '@/api/http';

export interface TrainerEventSession {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  venue?: string | null;
  attendance_taken: boolean;
}
export interface TrainerEventCard {
  id: string;
  name: string;
  batch_name: string;
  training_company?: string | null;
  start_date: string;
  end_date: string;
  status: 'today' | 'upcoming' | 'completed' | 'past';
  sessions: TrainerEventSession[];
}

export async function fetchTrainerEvents(params: { status?: string; search?: string } = {}): Promise<TrainerEventCard[]> {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.search) q.set('search', params.search);
  const res = await apiClient.get(`/api/my-events?${q.toString()}`);
  return res.data.events;
}
