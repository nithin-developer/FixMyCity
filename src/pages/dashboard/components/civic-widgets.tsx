import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { IssueMetrics } from '@/lib/metrics'

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

export const TrendMiniChart = ({ metrics }: { metrics: IssueMetrics }) => (
  <Card>
    <CardHeader>
      <CardTitle>New Issues (Recent Buckets)</CardTitle>
      <CardDescription>Relative volume (12h windows)</CardDescription>
    </CardHeader>
    <CardContent className='h-56'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={metrics.recentTrend}>
          <XAxis dataKey='label' fontSize={12} axisLine={false} tickLine={false} />
          <YAxis fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar dataKey='count' className='fill-primary' radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
