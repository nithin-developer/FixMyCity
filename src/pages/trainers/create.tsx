import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTrainer } from '@/api/trainers'
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
  password: z.string().min(6,'Min 6 chars'),
  position: z.string().optional(),
  department: z.string().optional(),
  is_active: z.boolean().optional()
})

export default function CreateTrainerPage() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { fullname:'', email:'', password:'' , is_active:true} })
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(values: z.infer<typeof schema>) {
    setSubmitting(true)
    try { const t = await createTrainer(values); toast.success('Trainer created'); navigate(`/trainers/${t.id}/edit`) } catch (e:any){ toast.error(e?.response?.data?.error || 'Creation failed') } finally { setSubmitting(false) }
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'><ThemeSwitch /><ProfileDropdown /></div>
      </Header>
      <div className='container mx-auto p-6 space-y-6 max-w-3xl'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Add Trainer</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Trainer Details</CardTitle>
            <CardDescription>Provide key information about the Municipal_Officer</CardDescription>
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
            <FormLabel>Password *</FormLabel>
                      <FormControl><Input {...field} disabled={submitting}/></FormControl>
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
                  <Button type='submit' disabled={submitting}>{submitting? 'Saving...' : 'Create'}</Button>
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
