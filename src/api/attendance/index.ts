import { apiClient } from "@/api/http";

export interface MySessionSummary {
  id: string;
  event_id: string;
  event_name: string;
  batch_id: string;
  batch_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  venue?: string | null;
  is_today: boolean;
  attendance_taken: boolean;
}

export interface AttendanceStudentRow {
  id: string;
  full_name: string;
  usn: string;
  present: boolean;
}

export interface AttendanceSessionDetail {
  session: {
    id: string;
    session_date: string;
    start_time: string;
    end_time: string;
    venue?: string | null;
  };
  students: AttendanceStudentRow[];
  attendance_taken: boolean;
}

export const attendanceApi = {
  async mySessions(): Promise<MySessionSummary[]> {
    const res = await apiClient.get("/api/my-sessions");
    return res.data.sessions;
  },
  async getSession(sessionId: string): Promise<AttendanceSessionDetail> {
    const res = await apiClient.get(`/api/attendance/${sessionId}`);
    return res.data;
  },
  async submit(sessionId: string, presentIds: string[]) {
    const res = await apiClient.post(`/api/attendance/${sessionId}`, {
      present_student_ids: presentIds,
    });
    return res.data;
  },
};
