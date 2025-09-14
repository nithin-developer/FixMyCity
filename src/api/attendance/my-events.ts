import { apiClient } from '@/api/http';

export interface MyEventSessionCard {
  id: string;
  event_id: string;
  event_name: string;
  batch_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  venue?: string | null;
  status: 'today' | 'upcoming' | 'completed' | 'past';
  attendance_taken: boolean;
}

export async function fetchMyEventSessions(params: { status?: string; search?: string } = {}): Promise<MyEventSessionCard[]> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  const res = await apiClient.get(`/api/my-events?${query.toString()}`);
  return res.data.sessions;
}
