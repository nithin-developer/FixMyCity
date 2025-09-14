export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-medium">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your account settings and personal information.
        </p>
      </header>

      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            className="px-3 py-2 rounded-md border"
            placeholder="Your full name"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="px-3 py-2 rounded-md border"
            placeholder="your.email@example.com"
          />
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Save Changes
        </button>
      </div>
    </div>
  );
}