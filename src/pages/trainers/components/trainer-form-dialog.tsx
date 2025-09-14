import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const baseSchema = {
  fullname: z.string().min(2, "Required"),
  email: z.string().email(),
  position: z.string().optional(),
  department: z.string().optional(),
  is_active: z.boolean().optional(),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Min 6 chars"),
});

const editSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type TrainerFormValuesCreate = z.infer<typeof createSchema>;
export type TrainerFormValuesEdit = z.infer<typeof editSchema>;

interface TrainerFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (
    values: TrainerFormValuesCreate | TrainerFormValuesEdit
  ) => Promise<void> | void;
  submitting?: boolean;
  defaultValues?: Partial<TrainerFormValuesEdit>;
}

export function TrainerFormDialog({
  mode,
  open,
  onOpenChange,
  onSubmit,
  submitting,
  defaultValues,
}: TrainerFormDialogProps) {
  const schema = mode === "create" ? createSchema : editSchema;
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      position: "",
      department: "",
      is_active: true,
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        fullname: "",
        email: "",
        password: "",
        position: "",
        department: "",
        is_active: true,
        ...defaultValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(defaultValues)]);

  async function handle(values: any) {
    await onSubmit(values);
  }

  const title = mode === "create" ? "Add Trainer" : "Edit Trainer";
  const description =
    mode === "create"
      ? "Provide information to add a new Municipal_Officer."
      : "Update the Municipal_Officer details.";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!submitting) onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handle)} className="space-y-5 mt-2">
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                name="fullname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={submitting}
                        placeholder="Enter full name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={submitting}
                        placeholder="Enter email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {mode === "create" ? "Password *" : "New Password"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          mode === "edit"
                            ? "Leave blank to keep existing"
                            : "Min. 6 characters"
                        }
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="position"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={submitting}
                        placeholder="Enter position"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  name="department"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={submitting}
                          placeholder="Eg. CSE, IT"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {mode === "edit" && (
              <FormField
                name="is_active"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is Active</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 mt-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={submitting}
                        />
                        <span className="text-xs text-muted-foreground">
                          Trainer can sign in
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  "Saving..."
                ) : (
                  <span className="inline-flex items-center gap-1">
                    Save <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
