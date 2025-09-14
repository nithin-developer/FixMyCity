import { apiClient } from '../http';

export interface EventSessionInput {
  id?: string;
  session_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  trainer_id?: string | null;
  venue?: string | null;
}

export interface EventInputBase {
  name: string;
  batch_id: string;
  training_company?: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

export interface CreateEventInput extends EventInputBase {
  sessions: EventSessionInput[];
}

export interface UpdateEventInput {
  name?: string;
  batch_id?: string;
  training_company?: string | null;
  start_date?: string; // optional update
  end_date?: string;
  sessions?: EventSessionInput[]; // full replace
}

export interface EventSummary {
  id: string;
  name: string;
  batch_id: string;
  training_company?: string | null;
  start_date: string;
  end_date: string;
  sessions_count: number;
  created_at?: string;
}

export interface EventDetail extends EventSummary {
  sessions: EventSessionInput[];
  updated_at?: string;
}

export const eventsApi = {
  async list(): Promise<EventSummary[]> {
  const { data } = await apiClient.get('/api/events');
    return data.events;
  },
  async get(id: string): Promise<EventDetail> {
  const { data } = await apiClient.get(`/api/events/${id}`);
    return data.event;
  },
  async create(payload: CreateEventInput): Promise<EventDetail> {
  const { data } = await apiClient.post('/api/events', payload);
    return data.event;
  },
  async update(id: string, payload: UpdateEventInput): Promise<EventDetail> {
  const { data } = await apiClient.put(`/api/events/${id}`, payload);
    return data.event;
  },
  async delete(id: string): Promise<void> {
  await apiClient.delete(`/api/events/${id}`);
  }
};
