import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { StudentUpdate } from '@/api/batches'

const schema = z.object({
  usn: z.string().min(1, 'Required'),
  full_name: z.string().min(2, 'Required'),
  email: z.string().email().optional().or(z.literal('').transform(()=>undefined)),
  phone: z.string().optional(),
  branch: z.string().optional(),
  section: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface StudentFormDialogProps {
  open: boolean
  onOpenChange: (v:boolean)=>void
  onSubmit: (values: StudentUpdate) => Promise<void>
  title: string
  defaultValues?: StudentUpdate
  submitting?: boolean
  mode: 'create' | 'edit'
}

export function StudentFormDialog({ open, onOpenChange, onSubmit, title, defaultValues, submitting, mode }: StudentFormDialogProps) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaultValues as FormValues | undefined })
  React.useEffect(()=>{ form.reset(defaultValues || {}) }, [defaultValues, open])

  async function handle(values: FormValues) { await onSubmit(values) }

  return (
    <Dialog open={open} onOpenChange={v=>{ if(!submitting) onOpenChange(v) }}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{mode==='create' ? 'Add a new student to the batch' : 'Edit student details'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handle)} className='space-y-4'>
            <FormField name='usn' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>USN *</FormLabel>
                <FormControl><Input {...field} disabled={submitting || mode==='edit'} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='full_name' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl><Input {...field} disabled={submitting} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='email' control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input {...field} disabled={submitting} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className='grid grid-cols-3 gap-3'>
              <FormField name='branch' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl><Input {...field} disabled={submitting} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name='section' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl><Input {...field} disabled={submitting} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name='phone' control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} disabled={submitting} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' disabled={submitting} onClick={()=>onOpenChange(false)}>Cancel</Button>
              <Button type='submit' disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
