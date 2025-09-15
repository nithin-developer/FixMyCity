
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Plus, RefreshCw } from "lucide-react";
import { ReportsTable, ReportRow } from "@/pages/issues1/issues-table";

export default function ReportsIndexPage() {
  // Demo reports data for download section
  const demoReportsData: ReportRow[] = [
    { slNo: 1, startDate: "01-09-2025", endDate: "05-09-2025", comments: "Monthly summary report", createdAt: "28-08-2025 10:15 AM" },
    { slNo: 2, startDate: "03-09-2025", endDate: "08-09-2025", comments: "Weekly progress report", createdAt: "28-08-2025 10:15 AM" },
    { slNo: 3, startDate: "07-09-2025", endDate: "10-09-2025", comments: "Incident report", createdAt: "28-08-2025 10:15 AM" },
    { slNo: 4, startDate: "09-09-2025", endDate: "12-09-2025", comments: "Performance report", createdAt: "28-08-2025 10:15 AM" },
    { slNo: 5, startDate: "11-09-2025", endDate: "13-09-2025", comments: "Bug fix report", createdAt: "28-08-2025 10:15 AM" },
  ];

  const handleDownload = (row: ReportRow) => {
    const filename = `report_${row.slNo}_${Date.now()}.pdf`;
    alert(`Downloading ${filename}`);
  };

  const handleDelete = (row: ReportRow) => {
    if (confirm(`Are you sure you want to delete report ${row.slNo}?`)) {
      alert(`Report ${row.slNo} deleted (demo)`);
    }
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
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-muted-foreground">
              Download and manage report archives
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 animate-spin-once" />
            </Button>
            <Button variant="default" onClick={() => alert("Generate Report")}>
              <Plus className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <ReportsTable
          data={demoReportsData}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
