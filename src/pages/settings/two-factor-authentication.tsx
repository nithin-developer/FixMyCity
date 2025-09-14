import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function SettingsTwoFAPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-medium">Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account.
        </p>
      </header>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Two-Factor Authentication is not enabled</AlertTitle>
        <AlertDescription>
          Add an extra layer of security by enabling two-factor authentication.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Button>Enable Two-Factor Authentication</Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Two-factor authentication adds an extra layer of security to your
            account by requiring both your password and a code from your phone.
          </p>
        </div>
      </div>
    </div>
  );
}