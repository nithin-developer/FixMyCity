import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-medium">Appearance Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Theme</h3>
          <RadioGroup defaultValue="light">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}