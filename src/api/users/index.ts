import { apiClient } from "../http";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "collector" | "municipal_officer" | "doctor" | "nurse";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface UsersParams {
  page?: number;
  size?: number;
  search?: string;
  role?: "admin" | "collector" | "municipal_officer" | "doctor" | "nurse";
  is_active?: boolean;
}

export async function getUsers(params: UsersParams = {}): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.size) searchParams.append("size", params.size.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.role) searchParams.append("role", params.role);
  if (params.is_active !== undefined) searchParams.append("is_active", params.is_active.toString());

  const response = await apiClient.get(`/api/users?${searchParams.toString()}`);
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
  const response = await apiClient.post("/api/users", userData);
  return response.data;
}

export async function updateUser(id: string, userData: Partial<Omit<User, "id" | "created_at" | "updated_at">>): Promise<User> {
  const response = await apiClient.put(`/api/users/${id}`, userData);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/api/users/${id}`);
}