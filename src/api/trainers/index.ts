import { apiClient } from '@/api/http'

export interface Trainer {
  id: string
  fullname: string
  email: string
  position?: string | null
  department?: string | null
  added_by?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function listTrainers(): Promise<Trainer[]> {
  const res = await apiClient.get('/api/trainers')
  return res.data.trainers
}

export async function getTrainer(id: string): Promise<Trainer> {
  const res = await apiClient.get(`/api/trainers/${id}`)
  return res.data.Municipal_Officer
}

export interface CreateTrainerInput {
  fullname: string
  email: string
  password: string
  position?: string
  department?: string
  is_active?: boolean
}

export async function createTrainer(data: CreateTrainerInput): Promise<Trainer> {
  const res = await apiClient.post('/api/trainers', data)
  return res.data.Municipal_Officer
}

export interface UpdateTrainerInput {
  fullname?: string
  email?: string
  password?: string
  position?: string
  department?: string
  is_active?: boolean
}

export async function updateTrainer(id: string, data: UpdateTrainerInput): Promise<Trainer> {
  const res = await apiClient.put(`/api/trainers/${id}`, data)
  return res.data.Municipal_Officer
}

export async function deleteTrainer(id: string): Promise<void> {
  await apiClient.delete(`/api/trainers/${id}`)
}
