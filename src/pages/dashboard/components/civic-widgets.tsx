import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { IssueMetrics } from '@/lib/metrics'
import * as React from 'react'
import { cn } from '@/utils/utils'

export const MetricCard = ({ label, value, sub, icon: Icon, accent }: { label: string; value: string | number; sub?: string; icon?: any; accent?: string }) => (
  <Card>
    <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
      <CardTitle className='text-sm font-medium flex items-center gap-2'>
        {Icon && <Icon className='h-4 w-4' />}{label}
      </CardTitle>
      {accent && <Badge variant='outline'>{accent}</Badge>}
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-semibold'>{value}</div>
      {sub && <div className='text-xs text-muted-foreground mt-1'>{sub}</div>}
    </CardContent>
  </Card>
)

export const IssueStatusBreakdown = ({ metrics }: { metrics: IssueMetrics }) => {
  const total = metrics.total || 1
  const items = [
    { label: 'Open', value: metrics.open, color: 'bg-amber-500' },
    { label: 'In Progress', value: metrics.inProgress, color: 'bg-blue-500' },
    { label: 'Resolved', value: metrics.resolved, color: 'bg-green-500' },
    { label: 'Rejected', value: metrics.rejected, color: 'bg-red-500' },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Status</CardTitle>
        <CardDescription>Current distribution</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-1 h-2 overflow-hidden rounded'>
          {items.map(i => (
            <div key={i.label} className={`${i.color}`} style={{ width: `${(i.value / total) * 100}%` }} />
          ))}
        </div>
        <ul className='grid grid-cols-2 gap-2 text-xs'>
          {items.map(i => (
            <li key={i.label} className='flex items-center justify-between'>
              <span className='flex items-center gap-1'>
                <span className={`inline-block size-2 rounded-sm ${i.color}`} />{i.label}
              </span>
              <span className='tabular-nums'>{i.value}</span>
            </li>
          ))}
        </ul>
        <div className='text-xs text-muted-foreground'>Resolution Rate: {metrics.resolutionRatePct.toFixed(1)}% {metrics.avgResolutionHours && `(avg ${metrics.avgResolutionHours.toFixed(1)}h)`}</div>
      </CardContent>
    </Card>
  )
}

export const TopCategories = ({ metrics }: { metrics: IssueMetrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
        <CardDescription>Most reported issue types</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        {metrics.categoryCounts.slice(0,5).map(c => {
          const pct = metrics.total ? (c.count / metrics.total) * 100 : 0
          return (
            <div key={c.category} className='space-y-1'>
              <div className='flex items-center justify-between text-xs'>
                <span>{c.category}</span>
                <span className='tabular-nums'>{c.count}</span>
              </div>
              <Progress value={pct} className='h-1'/>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Professional multi-mode bar chart component
export const TrendMiniChart = ({ metrics }: { metrics: IssueMetrics }) => {
  type Mode = 'districts' | 'departments' | 'recent'
  const [mode, setMode] = React.useState<Mode>('departments')
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  // Demo data sets
  const districtData = [
    { label: 'Central', issues: 42 },
    { label: 'North', issues: 31 },
    { label: 'South', issues: 27 },
    { label: 'East', issues: 36 },
    { label: 'West', issues: 18 },
    { label: 'Harbor', issues: 22 }
  ]
  const departmentData = [
    { label: 'Sanitation', issues: 55 },
    { label: 'Roads', issues: 34 },
    { label: 'Water', issues: 21 },
    { label: 'Parks', issues: 17 },
    { label: 'Lighting', issues: 26 },
    { label: 'Drainage', issues: 19 }
  ]
  // Use provided metrics trend or synthesize fallback (recent new issues)
  const recentTrend = (metrics.recentTrend && metrics.recentTrend.length > 0
    ? metrics.recentTrend
    : Array.from({ length: 10 }).map((_, i) => ({ label: `T-${(10 - i) * 2}h`, count: Math.round(Math.sin((i/9) * Math.PI) * 12 + (i % 3)) })))
    .map(d => ({ label: d.label, issues: d.count ?? 0 }))

  const dataMap: Record<Mode, { label: string; issues: number }[]> = {
    districts: districtData,
    departments: departmentData,
    recent: recentTrend
  }

  const data = dataMap[mode]
  const total = data.reduce((sum, d) => sum + d.issues, 0)
  const max = Math.max(...data.map(d => d.issues), 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const entry = payload[0].payload
    const pct = total ? ((entry.issues / total) * 100).toFixed(1) : '0'
    const rel = max ? ((entry.issues / max) * 100).toFixed(0) : '0'
    return (
      <div className='rounded-md border bg-background/95 backdrop-blur px-3 py-2 shadow-sm text-xs space-y-1'>
        <div className='font-medium'>{entry.label}</div>
        <div className='flex items-center gap-2'>
          <span className='inline-block h-2 w-2 rounded-sm bg-primary' />
          <span className='tabular-nums font-semibold'>{entry.issues}</span>
          <span className='text-muted-foreground'>{pct}% of total</span>
        </div>
        <div className='text-muted-foreground'>Peak: {rel}%</div>
      </div>
    )
  }

  return (
    <Card className='relative'>
      <CardHeader className='space-y-1'>
        <CardTitle className='flex items-center justify-between text-sm font-medium'>
          <span>
            {mode === 'districts' && 'Issues by District'}
            {mode === 'departments' && 'Issues by Department'}
            {mode === 'recent' && 'New Issues (Recent)'}
          </span>
          <div className='flex gap-1'>
            {(['districts','departments','recent'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn('px-2 py-1 rounded text-xs border transition-colors',
                  mode === m ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted')}
                aria-pressed={mode === m}
              >
                {m === 'districts' && 'Districts'}
                {m === 'departments' && 'Departments'}
                {m === 'recent' && 'Recent'}
              </button>
            ))}
          </div>
        </CardTitle>
        <CardDescription className='text-xs'>
          {mode === 'districts' && 'Highlighting areas with most reported issues'}
          {mode === 'departments' && 'Workload distribution across departments'}
          {mode === 'recent' && 'Recent activity buckets (relative volume)'}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
            <defs>
              <linearGradient id='barFill' x1='0' y1='0' x2='0' y2='1'>
                {/* Brand orange gradient (fallback if theme primary not orange) */}
                <stop offset='0%' stopColor='#f97316' stopOpacity={0.95} />
                <stop offset='100%' stopColor='#fb923c' stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted/40' vertical={false} />
            <XAxis dataKey='label' tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={36} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.2)' }} content={<CustomTooltip />} />
            <Bar
              dataKey='issues'
              fill='url(#barFill)'
              radius={[5,5,0,0]}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className='transition-all duration-200'
            >
              {/* Dynamic highlight via inline style on each rect (Recharts renders sequentially) */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-2 flex items-center justify-between text-[10px] text-muted-foreground'>
          <span>Total: {total}</span>
          <span>Peak: {max}</span>
        </div>
      </CardContent>
      {activeIndex !== null && (
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/60 to-transparent rounded-b-md' />
      )}
    </Card>
  )
}
