import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  createdAt: string;
  reportedBy: string;
}

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock issue data - in real app this would come from an API
  const [issue] = useState<Issue>({
    id: id || '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the intersection of Main Street and Oak Avenue. The pothole is approximately 2 feet wide and 6 inches deep, making it dangerous for vehicles and motorcycles.',
    status: 'Open',
    priority: 'High',
    location: '23.6105, 85.2799 (Ranchi)',
    createdAt: '2025-09-13',
    reportedBy: 'Ramesh Kumar'
  });

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
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/issues")}>
            <ArrowLeft className="h-4 w-4" /> Return to Issues
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Issue Details</h1>
            <p className="text-muted-foreground">View and manage issue information</p>
          </div>
        </div>

        {/* Issue Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{issue.title}</span>
              <div className="flex gap-2">
                <Badge variant={issue.status === 'Open' ? 'destructive' : issue.status === 'In Progress' ? 'default' : 'secondary'}>
                  {issue.status}
                </Badge>
                <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'secondary'}>
                  {issue.priority} Priority
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <p className="text-muted-foreground">{issue.location}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Reported By</h4>
                <p className="text-muted-foreground">{issue.reportedBy}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Created Date</h4>
                <p className="text-muted-foreground">{issue.createdAt}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Issue ID</h4>
                <p className="text-muted-foreground">#{issue.id}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button variant="default">Update Status</Button>
              <Button variant="outline">Edit Issue</Button>
              <Button variant="destructive" className="ml-auto">Delete Issue</Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/issues")}>
            <ArrowLeft className="h-4 w-4" /> Back to Issues
          </Button>
        </div>
      </div>
    </>
  );
}
