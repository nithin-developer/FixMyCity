// Demo data for FixMyCity dashboards
// In a real app this would come from an API.
export interface IssueRecord {
  id: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'rejected'
  locality: string
  district: string
  createdAt: string
  resolvedAt?: string
  slaHours?: number
  reporter: string
  assignedTo?: string // officer / collector id
  priority: 'low' | 'medium' | 'high'
  agingHours?: number // computed later
}

export interface CollectorRecord {
  id: string
  name: string
  district: string
}

export const collectors: CollectorRecord[] = [
  { id: 'col-1', name: 'Ramesh Kumar', district: 'Mysuru' },
  { id: 'col-2', name: 'Anjali Sharma', district: 'Jaipur' },
  { id: 'col-3', name: 'Arvind Menon', district: 'Ernakulam' },
  { id: 'col-4', name: 'Priya Deshmukh', district: 'Nagpur' },
]

// helper to offset hours
const h = (hrs: number) => new Date(Date.now() - hrs * 3600 * 1000).toISOString()

export const issues: IssueRecord[] = [
  { id: 'ISS-1001', category: 'Pothole', status: 'open', district: 'Mysuru', locality: 'VV Mohalla', createdAt: h(5), reporter: 'Citizen A', priority: 'high' },
  { id: 'ISS-1002', category: 'Streetlight', status: 'in_progress', district: 'Mysuru', locality: 'Gokulam', createdAt: h(30), reporter: 'Citizen B', assignedTo: 'officer-2', priority: 'medium' },
  { id: 'ISS-1003', category: 'Garbage', status: 'resolved', district: 'Jaipur', locality: 'C-Scheme', createdAt: h(50), resolvedAt: h(10), reporter: 'Citizen C', priority: 'high' },
  { id: 'ISS-1004', category: 'Drainage', status: 'open', district: 'Jaipur', locality: 'Malviya Nagar', createdAt: h(2), reporter: 'Citizen D', priority: 'low' },
  { id: 'ISS-1005', category: 'Water Leakage', status: 'open', district: 'Ernakulam', locality: 'Marine Drive', createdAt: h(70), reporter: 'Citizen E', priority: 'high' },
  { id: 'ISS-1006', category: 'Garbage', status: 'in_progress', district: 'Ernakulam', locality: 'Fort Kochi', createdAt: h(15), reporter: 'Citizen F', priority: 'medium' },
  { id: 'ISS-1007', category: 'Pothole', status: 'resolved', district: 'Nagpur', locality: 'Residency Rd', createdAt: h(120), resolvedAt: h(20), reporter: 'Citizen G', priority: 'medium' },
  { id: 'ISS-1008', category: 'Signage', status: 'rejected', district: 'Nagpur', locality: 'Civil Lines', createdAt: h(12), reporter: 'Citizen H', priority: 'low' },
  { id: 'ISS-1009', category: 'Streetlight', status: 'open', district: 'Mysuru', locality: 'Ramakrishnanagar', createdAt: h(8), reporter: 'Citizen I', priority: 'high' },
  { id: 'ISS-1010', category: 'Garbage', status: 'open', district: 'Mysuru', locality: 'Hebbal', createdAt: h(60), reporter: 'Citizen J', priority: 'medium' },
]
