import { Button } from "@/components/ui/button";

export default function SettingsSecurityPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-medium">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your security settings and preferences.
        </p>
      </header>

      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Current Password</label>
          <input
            type="password"
            className="px-3 py-2 rounded-md border"
            placeholder="Enter current password"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            className="px-3 py-2 rounded-md border"
            placeholder="Enter new password"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            className="px-3 py-2 rounded-md border"
            placeholder="Confirm new password"
          />
        </div>

        <Button>Update Password</Button>
      </div>
    </div>
  );
}