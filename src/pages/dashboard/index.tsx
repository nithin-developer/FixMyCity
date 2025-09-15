import { Activity, Users, Layers3, Clock, Target, Flame, TimerReset, MapPin } from 'lucide-react'
import { useAuth } from '@/stores/authStore'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { globalIssueMetrics, districtIssueMetrics } from '@/lib/metrics'
import { issues } from '@/lib/demo-data'
import { MetricCard, IssueStatusBreakdown, TopCategories, TrendMiniChart } from './components/civic-widgets'

// Super Admin (full access) dashboard
// Helper for formatting numbers
const fmt = (n: number | null | undefined, d = 1) => n == null ? '—' : n.toFixed(d)
// Helper to present hours as days + hours for readability
const formatAge = (hours: number | null | undefined) => {
  if (hours == null) return '—'
  if (hours < 24) return `${Math.round(hours)}h`
  const days = Math.floor(hours / 24)
  const remH = Math.round(hours - days * 24)
  return remH > 0 ? `${days}d ${remH}h` : `${days}d`
}

// ADMIN (system-wide) DASHBOARD
function AdminDashboard() {
  const m = globalIssueMetrics()
  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-semibold tracking-tight'>Civic Platform Overview</h1>
              <p className='text-sm text-muted-foreground mt-1'>System-wide issue health & activity.</p>
            </div>
            <Badge variant='outline' className='flex items-center'><Activity className='h-4 w-4 mr-1'/>Admin</Badge>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
            <MetricCard icon={Layers3} label='Issues' value={m.total} sub='Total reported' />
            <MetricCard icon={Target} label='Solved' value={fmt(m.resolutionRatePct,1)+'%'} sub='% resolved' />
            <MetricCard icon={Flame} label='High Priority' value={m.highPriorityOpen} sub='Still open' />
            <MetricCard icon={TimerReset} label='Avg Fix Time' value={m.avgResolutionHours? fmt(m.avgResolutionHours)+'h':'—'} sub='Hours to solve' />
            <MetricCard icon={Clock} label='Longest Open Issue' value={formatAge(m.oldestOpenHours)} sub='Time since reported' />
          </div>
          <div className='grid gap-4 lg:grid-cols-3'>
            <div className='space-y-4 lg:col-span-2'>
              <TrendMiniChart metrics={m} />
              <IssueStatusBreakdown metrics={m} />
            </div>
            <div className='space-y-4'>
              <TopCategories metrics={m} />
              <Card>
                <CardHeader>
                  <CardTitle>Data Snapshot</CardTitle>
                  <CardDescription>Static demo numbers</CardDescription>
                </CardHeader>
                <CardContent className='text-xs space-y-2 text-muted-foreground'>
                  <div>Sample Records: {issues.length}</div>
                  <div>Districts: 4</div>
                  <div>Updated: realtime (in-memory)</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

// COLLECTOR dashboard (district focus)
function CollectorDashboard({ district }: { district: string }) {
  const m = districtIssueMetrics(district)
  return (
    <div className='p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight'>District Overview</h1>
          <p className='text-sm text-muted-foreground mt-1'>{district} issue status & workload.</p>
        </div>
        <Badge variant='outline' className='flex items-center'><MapPin className='h-4 w-4 mr-1'/>{district}</Badge>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <MetricCard icon={Layers3} label='Issues' value={m.total} sub='This district' />
        <MetricCard icon={Target} label='Solved' value={fmt(m.resolutionRatePct,1)+'%'} sub='% resolved' />
        <MetricCard icon={Flame} label='High Priority' value={m.highPriorityOpen} sub='Open now' />
        <MetricCard icon={TimerReset} label='Avg Fix Time' value={m.avgResolutionHours? fmt(m.avgResolutionHours):'—'} sub='Hours' />
  <MetricCard icon={Clock} label='Longest Open Issue' value={formatAge(m.oldestOpenHours)} sub='Time since reported' />
      </div>
      <div className='grid gap-4 lg:grid-cols-3'>
        <div className='space-y-4 lg:col-span-2'>
          <TrendMiniChart metrics={m} />
          <IssueStatusBreakdown metrics={m} />
        </div>
        <TopCategories metrics={m} />
      </div>
    </div>
  )
}

// MUNICIPAL OFFICER dashboard (operational)
function OfficerDashboard({ district }: { district: string }) {
  const m = districtIssueMetrics(district)
  // derive aging list (open & in_progress sorted by created date ascending)
  const aging = issues.filter(i => i.district === district && (i.status === 'open' || i.status === 'in_progress'))
    .map(i => ({ ...i, ageH: (Date.now() - new Date(i.createdAt).getTime()) / 3600000 }))
    .sort((a,b)=> b.ageH - a.ageH).slice(0,5)
  const today = new Date()
  const todayNew = issues.filter(i => i.district === district && new Date(i.createdAt).toDateString() === today.toDateString())
  return (
    <div className='p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight'>Operational Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>Live workload & prioritized items for {district}.</p>
        </div>
        <Badge variant='outline' className='flex items-center'><Users className='h-4 w-4 mr-1'/>Officer</Badge>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <MetricCard icon={Layers3} label='Active Issues' value={m.open + m.inProgress} sub='Open + working' />
        <MetricCard icon={Flame} label='High Priority' value={m.highPriorityOpen} sub='Need action' />
        <MetricCard icon={Target} label='Solved' value={fmt(m.resolutionRatePct,1)+'%'} sub='% resolved' />
        <MetricCard icon={TimerReset} label='Avg Fix Time' value={m.avgResolutionHours? fmt(m.avgResolutionHours):'—'} sub='Hours' />
  <MetricCard icon={Clock} label='Longest Open Issue' value={formatAge(m.oldestOpenHours)} sub='Time since reported' />
      </div>
      <div className='grid gap-4 lg:grid-cols-3'>
        <IssueStatusBreakdown metrics={m} />
        <TopCategories metrics={m} />
        <TrendMiniChart metrics={m} />
      </div>
      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Aging Issues</CardTitle>
            <CardDescription>Oldest unresolved items</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2 text-xs'>
            {aging.length === 0 && <div className='text-muted-foreground'>None</div>}
            {aging.map(a => (
              <div key={a.id} className='flex items-center justify-between border rounded px-2 py-1'>
                <span className='flex-1 truncate'>{a.id} · {a.category}</span>
                <span className='ml-2 text-amber-600 font-medium'>{a.ageH.toFixed(0)}h</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s New Issues</CardTitle>
            <CardDescription>Created since midnight</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2 text-xs'>
            {todayNew.length === 0 && <div className='text-muted-foreground'>No new issues today.</div>}
            {todayNew.map(t => (
              <div key={t.id} className='flex items-center justify-between border rounded px-2 py-1'>
                <span className='flex-1 truncate'>{t.id} · {t.category}</span>
                <span className='ml-2'>{t.priority}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const role = useAuth().user?.role
  // choose a demo district for role-based scoping (could be stored in user later)
  const demoDistrict = role === 'collector' ? 'Mysuru' : role === 'municipal_officer' ? 'Mysuru' : 'Mysuru'
  if (role === 'admin') return <AdminDashboard />
  if (role === 'collector') return <CollectorDashboard district={demoDistrict} />
  if (role === 'municipal_officer') return <OfficerDashboard district={demoDistrict} />
  return <AdminDashboard />
}
