import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IssuesTable, IssueRow } from "./issues-table";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";

export default function IssuesPage() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issuesData, setIssuesData] = useState<IssueRow[]>([
    {
      id: "101",
      issueType: "Pothole",
      description: "Big pothole causing traffic jams",
      location: "23.6105, 85.2799 (Ranchi)",
      status: "Open",
      submittedBy: "Ramesh Kumar",
      date: "12-09-2025",
      priority: "High",
    },
    {
      id: "102",
      issueType: "Streetlight Failure",
      description: "Two lights not working at corner",
      location: "23.3702, 85.3250",
      status: "In Progress",
      submittedBy: "Priya Singh",
      date: "11-09-2025",
      priority: "Medium",
    },
    {
      id: "103",
      issueType: "Garbage Overflow",
      description: "Trash not collected in 3 days",
      location: "23.3441, 85.3096",
      status: "Resolved",
      submittedBy: "Arjun Verma",
      date: "10-09-2025",
      priority: "High",
    },
    {
      id: "104",
      issueType: "Water Leakage",
      description: "Pipe burst near school",
      location: "23.3612, 85.3330",
      status: "Open",
      submittedBy: "Sunita Devi",
      date: "09-09-2025",
      priority: "High",
    },
    {
      id: "105",
      issueType: "Broken Bench",
      description: "Park bench damaged",
      location: "23.3661, 85.3130",
      status: "Acknowledged",
      submittedBy: "Rohit Mehta",
      date: "09-09-2025",
      priority: "Low",
    },
    {
      id: "106",
      issueType: "Illegal Dumping",
      description: "Construction waste dumped",
      location: "23.3777, 85.3215",
      status: "Open",
      submittedBy: "Saira Khan",
      date: "08-09-2025",
      priority: "Medium",
    },
    {
      id: "107",
      issueType: "Manhole Open",
      description: "Open manhole near bus stand",
      location: "23.3580, 85.3091",
      status: "In Progress",
      submittedBy: "Ankit Sharma",
      date: "07-09-2025",
      priority: "High",
    },
  ]);

  // Form state for new issue
  // const [newIssue, setNewIssue] = useState({
  //   issueType: "",
  //   location: "",
  //   priority: "Medium",
  // });

  // Form submission handler
  // const handleAddIssue = () => {
  //   if (!newIssue.issueType || !newIssue.location) {
  //     alert("Please fill in all required fields");
  //     return;
  //   }

  //   const currentDate = new Date();
  //   const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${currentDate.getFullYear()}`;

  //   const newIssueData = {
  //     id: String(Math.max(...issuesData.map((r) => parseInt(r.id))) + 1),
  //     issueType: newIssue.issueType,
  //     description: `${newIssue.issueType} reported at ${newIssue.location}`,
  //     location: newIssue.location,
  //     status: "Open",
  //     submittedBy: "Anonymous User",
  //     date: formattedDate,
  //     priority: newIssue.priority,
  //   };

  //   setIssuesData([newIssueData, ...issuesData]);

  //   // Reset form
  //   setNewIssue({
  //     issueType: "",
  //     location: "",
  //     priority: "Medium",
  //   });

  //   setIsDialogOpen(false);
  // };

  // placeholder edit/delete handlers
  const handleEdit = (issue: IssueRow) => {
    alert(`Edit issue ${issue.id} (implement modal form)`);
  };
  const handleDelete = (issue: IssueRow) => {
    if (confirm(`Delete issue ${issue.id}?`)) {
      setIssuesData((prev) => prev.filter((i) => i.id !== issue.id));
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
            <h1 className="text-2xl font-semibold">Issues</h1>
            <p className="text-muted-foreground">
              Track and manage reported civic issues
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        <IssuesTable
          data={issuesData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
