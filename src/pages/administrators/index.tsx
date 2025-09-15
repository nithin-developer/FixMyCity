import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { AdminsTable, AdminRow } from "@/pages/issues1/issues-table";

export default function AdminsPage() {
  const [loading] = useState(false);
  const [admins, setAdmins] = useState<AdminRow[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Administrator', active: true },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'Administrator', active: true },
    { id: '3', name: 'John Smith', email: 'john@example.com', role: 'Moderator', active: false },
  ]);

  const handleEdit = (row: AdminRow) => {
    alert(`Edit admin ${row.name}`);
  };

  const handleToggleActive = (row: AdminRow) => {
    setAdmins(prev => prev.map(a => a.id === row.id ? { ...a, active: !a.active } : a));
  };

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Administrators</h1>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => {}} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Administrator
          </Button>
        </div>
      </header>

      <AdminsTable data={admins} onEdit={handleEdit} onToggleActive={handleToggleActive} />
      </div>
    </>
  );
}