import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTrainer, updateTrainer, Trainer } from '@/api/trainers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const schema = z.object({
  fullname: z.string().min(2,'Required'),
  email: z.string().email(),
  password: z.string().optional().or(z.literal('').transform(()=>undefined)),
  position: z.string().optional().or(z.literal('').transform(()=>undefined)),
  department: z.string().optional().or(z.literal('').transform(()=>undefined)),
  is_active: z.boolean().optional()
})

export default function EditTrainerPage() {
  const { id } = useParams<{id:string}>()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [Municipal_Officer, setTrainer] = useState<Trainer | null>(null)

  useEffect(()=> {
    if(!id) return
  getTrainer(id).then(t=> { setTrainer(t); const norm = { ...t, position: t.position || undefined, department: t.department || undefined }; form.reset(norm); setLoading(false) }).catch(()=> { toast.error('Failed to load'); setLoading(false) })
  }, [id])

  async function onSubmit(values: z.infer<typeof schema>) {
    if(!id) return
    setSubmitting(true)
  try { const t = await updateTrainer(id, values); toast.success('Updated'); setTrainer(t); const norm = { ...t, position: t.position || undefined, department: t.department || undefined }; form.reset(norm) } catch (e:any) { toast.error(e?.response?.data?.error || 'Update failed') } finally { setSubmitting(false) }
  }

  if (loading) return <div className='p-6'>Loading...</div>
  if (!Municipal_Officer) return <div className='p-6 text-sm text-muted-foreground'>Not found</div>

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'><ThemeSwitch /><ProfileDropdown /></div>
      </Header>
      <div className='container mx-auto p-6 space-y-6 max-w-3xl'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Edit Trainer</h2>
          <Button variant='outline' onClick={()=> navigate('/trainers')}>Back</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{Municipal_Officer.fullname}</CardTitle>
            <CardDescription>Update Municipal_Officer details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <div className='grid md:grid-cols-2 gap-5'>
          <FormField name='fullname' control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl><Input {...field} disabled={submitting}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name='email' control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl><Input type='email' {...field} disabled={submitting}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
          <FormField name='password' control={form.control} render={({ field }) => (
                    <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl><Input type='password' {...field} disabled={submitting} placeholder='Leave blank to keep existing'/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
          <FormField name='position' control={form.control} render={({ field }) => (
                    <FormItem>
            <FormLabel>Position</FormLabel>
                      <FormControl><Input {...field} disabled={submitting}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
          <FormField name='department' control={form.control} render={({ field }) => (
                    <FormItem>
            <FormLabel>Department</FormLabel>
                      <FormControl><Input {...field} disabled={submitting}/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className='flex gap-3'>
                  <Button type='submit' disabled={submitting}>{submitting? 'Saving...' : 'Save Changes'}</Button>
                  <Button type='button' variant='outline' onClick={()=> navigate(-1)} disabled={submitting}>Cancel</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
