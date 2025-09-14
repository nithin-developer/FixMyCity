import { apiClient } from '@/api/http'

export interface Batch {
  id: string
  batch_id: string
  batch_name: string
  total_students: number
  is_active: boolean
  created_by: string
  created_at?: string
}

export async function listBatches(): Promise<Batch[]> {
  const res = await apiClient.get('/api/batches')
  return res.data.batches
}

export async function getBatch(id: string) {
  const res = await apiClient.get(`/api/batches/${id}`)
  return res.data
}

export async function createBatch(form: { batch_name: string; batch_id?: string; file?: File }) {
  const fd = new FormData()
  fd.append('batch_name', form.batch_name)
  if (form.batch_id) fd.append('batch_id', form.batch_id)
  if (form.file) fd.append('file', form.file)
  const res = await apiClient.post('/api/batches', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data.batch as Batch
}

export async function addStudents(batchId: string, file: File) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await apiClient.post(`/api/batches/${batchId}/students`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data.batch as Batch
}

export async function updateBatch(batchId: string, data: { batch_name?: string; file?: File }) {
  const hasFile = !!data.file
  if (hasFile) {
    const fd = new FormData()
    if (data.batch_name) fd.append('batch_name', data.batch_name)
    if (data.file) fd.append('file', data.file)
    const res = await apiClient.put(`/api/batches/${batchId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.batch as Batch
  } else {
    const res = await apiClient.put(`/api/batches/${batchId}`, { batch_name: data.batch_name })
    return res.data.batch as Batch
  }
}

export async function deleteBatch(batchId: string) {
  await apiClient.delete(`/api/batches/${batchId}`)
}

export interface StudentUpdate { usn?: string; full_name?: string; email?: string; phone?: string; branch?: string; section?: string }

export async function updateStudent(batchId: string, studentId: string, data: StudentUpdate) {
  const res = await apiClient.put(`/api/batches/${batchId}/students/${studentId}`, data)
  return res.data.student
}

export async function deleteStudent(batchId: string, studentId: string) {
  await apiClient.delete(`/api/batches/${batchId}/students/${studentId}`)
}
