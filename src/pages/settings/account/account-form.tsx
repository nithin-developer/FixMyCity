import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const accountFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Please enter your first name.")
    .min(2, "First name must be at least 2 characters.")
    .max(30, "First name must not be longer than 30 characters."),
  lastName: z
    .string()
    .min(1, "Please enter your last name.")
    .min(2, "Last name must be at least 2 characters.")
    .max(30, "Last name must not be longer than 30 characters."),
  // Removed email and username from validation since they're read-only
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const user = ""
  const [isLoading, setIsLoading] = useState(false);

  // Only include editable fields in form
  const defaultValues: Partial<AccountFormValues> = {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  // Update form when user data changes (e.g., after page refresh)
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: AccountFormValues) {
    setIsLoading(true);
    try {
    return
    } catch (error: any) {
      console.error("Account update error:", error);
      toast.error("Failed to update account information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription>
                  Your first name as it appears in the system.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormDescription>
                  Your last name as it appears in the system.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
 
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update account"}
        </Button>
      </form>
    </Form>
  );
}
