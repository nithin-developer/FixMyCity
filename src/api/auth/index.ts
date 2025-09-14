import { apiClient, logoutRequest, refreshAccessToken } from "@/api/http";
import { useAuthStore } from "@/stores/authStore";

export interface LoginResponse {
  twofa_required: boolean;
  twofa_token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: any;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await apiClient.post("/api/auth/login", { email, password });
  const data: LoginResponse = res.data;
  if (!data.twofa_required && data.access_token && data.user) {
    const auth = useAuthStore.getState().auth;
    auth.setSession({
      user: data.user,
      accessToken: data.access_token,
      refreshToken: "cookie",
    });
  }
  return data;
}

export async function verifyTwoFA(twofaToken: string, code: string) {
  const res = await apiClient.post("/api/auth/verify-2fa", {
    twofa_token: twofaToken,
    code,
  });
  const { access_token, user } = res.data;
  if (access_token && user) {
    const auth = useAuthStore.getState().auth;
    auth.setSession({
      user,
      accessToken: access_token,
      refreshToken: "cookie",
    });
  }
  return res.data;
}

export async function fetchMe() {
  try {
    const res = await apiClient.get("/api/auth/me");
    return res.data.user;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      // try single silent refresh then retry
      try {
        const newTok = await refreshAccessToken();
        if (newTok) {
          const res2 = await apiClient.get("/api/auth/me");
          return res2.data.user;
        }
      } catch { /* ignore */ }
    }
    throw err;
  }
}

export async function logout() {
  await logoutRequest();
  const auth = useAuthStore.getState().auth;
  auth.reset();
}
