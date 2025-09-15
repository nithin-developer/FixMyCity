import { issues, IssueRecord } from './demo-data'

export interface IssueMetrics {
  total: number
  open: number
  inProgress: number
  resolved: number
  rejected: number
  resolutionRatePct: number
  avgResolutionHours: number | null
  highPriorityOpen: number
  oldestOpenHours: number | null
  categoryCounts: { category: string; count: number }[]
  recentTrend: { label: string; count: number }[]
}

function hoursBetween(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000
}

export function computeMetrics(source: IssueRecord[], opts?: { district?: string }): IssueMetrics {
  const nowIso = new Date().toISOString()
  const data = opts?.district ? source.filter(i => i.district === opts.district) : source
  const total = data.length
  const open = data.filter(i => i.status === 'open').length
  const inProgress = data.filter(i => i.status === 'in_progress').length
  const resolvedList = data.filter(i => i.status === 'resolved')
  const resolved = resolvedList.length
  const rejected = data.filter(i => i.status === 'rejected').length
  const resolutionRatePct = total ? (resolved / total) * 100 : 0
  const avgResolutionHours = resolvedList.length
    ? resolvedList.reduce((sum, r) => sum + hoursBetween(r.createdAt, r.resolvedAt!), 0) / resolvedList.length
    : null
  const openHigh = data.filter(i => i.status !== 'resolved' && i.priority === 'high').length
  const oldestOpenHours = (() => {
    const openItems = data.filter(i => i.status === 'open')
    if (!openItems.length) return null
    return Math.max(...openItems.map(o => hoursBetween(o.createdAt, nowIso)))
  })()
  const categoryMap: Record<string, number> = {}
  data.forEach(i => { categoryMap[i.category] = (categoryMap[i.category] || 0) + 1 })
  const categoryCounts = Object.entries(categoryMap).map(([category, count]) => ({ category, count }))
    .sort((a,b)=> b.count - a.count)

  // simple 6 bucket trend (last 72h grouped by 12h window)
  const trendBuckets: { label: string; from: number; to: number; count: number }[] = []
  const now = Date.now()
  for (let i = 5; i >=0; i--) {
    const to = now - i * 12 * 3600 * 1000
    const from = to - 12 * 3600 * 1000
    trendBuckets.push({ label: `${6 - i}`, from, to, count: 0 })
  }
  data.forEach(i => {
    const ts = new Date(i.createdAt).getTime()
    const b = trendBuckets.find(b => ts >= b.from && ts < b.to)
    if (b) b.count++
  })
  const recentTrend = trendBuckets.map(b => ({ label: b.label, count: b.count }))

  return {
    total,
    open,
    inProgress,
    resolved,
    rejected,
    resolutionRatePct,
    avgResolutionHours,
    highPriorityOpen: openHigh,
    oldestOpenHours,
    categoryCounts,
    recentTrend,
  }
}

export const globalIssueMetrics = () => computeMetrics(issues)
export const districtIssueMetrics = (district: string) => computeMetrics(issues, { district })
