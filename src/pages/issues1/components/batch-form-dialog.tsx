import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  batch_name: z.string().min(2, "Required"),
  file: z.any().optional(),
});

interface BatchFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: { batch_name: string; file?: File }) => Promise<void>;
  title: string;
  description?: string;
  defaultName?: string;
  submitting?: boolean;
}

export function BatchFormDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  defaultName,
  submitting,
}: BatchFormDialogProps) {
  const form = useForm<{ batch_name: string; file?: File }>({
    resolver: zodResolver(schema),
    defaultValues: { batch_name: defaultName || "" },
  });
  React.useEffect(() => {
    form.reset({ batch_name: defaultName || "" });
  }, [defaultName, open]);

  const [fileName, setFileName] = React.useState<string | null>(null);

  async function handle(values: { batch_name: string; file?: File }) {
    await onSubmit(values);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!submitting) onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handle)} className="space-y-4">
            <FormField
              name="batch_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg: AI Cohort 2025"
                      {...field}
                      disabled={submitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="file"
              control={form.control}
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Students CSV (optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <div className="flex flex-col items-center space-y-2">
                          <svg
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium">
                              Upload your CSV file here by
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              asChild
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Browse files
                              </label>
                            </Button>
                          </div>
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          disabled={submitting}
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            onChange(f);
                            setFileName(f?.name || null);
                          }}
                        />
                      </div>
                      {fileName && (
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {fileName}
                          </span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sample CSV format available, Fill the CSV file and upload it
                    here. To download the sample CSV file {" "}
                    <a
                      href="/sample/students.csv"
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Click here
                    </a>
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
                  <>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
