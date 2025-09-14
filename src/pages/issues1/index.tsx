import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Plus,
  RefreshCw,
  EyeIcon,
  Edit,
  Trash2,
  Search as SearchIcon,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";

export default function IssuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issuesData, setIssuesData] = useState([
    {
      id: '101',
      issueType: 'Pothole',
      description: 'Big pothole causing traffic jams',
      location: '23.6105, 85.2799 (Ranchi)',
      status: 'Open',
      submittedBy: 'Ramesh Kumar',
      date: '12-09-2025',
      priority: 'High'
    },
    {
      id: '102',
      issueType: 'Streetlight Failure',
      description: 'Two lights not working at corner',
      location: '23.3702, 85.3250',
      status: 'In Progress',
      submittedBy: 'Priya Singh',
      date: '11-09-2025',
      priority: 'Medium'
    },
    {
      id: '103',
      issueType: 'Garbage Overflow',
      description: 'Trash not collected in 3 days',
      location: '23.3441, 85.3096',
      status: 'Resolved',
      submittedBy: 'Arjun Verma',
      date: '10-09-2025',
      priority: 'High'
    },
    {
      id: '104',
      issueType: 'Water Leakage',
      description: 'Pipe burst near school',
      location: '23.3612, 85.3330',
      status: 'Open',
      submittedBy: 'Sunita Devi',
      date: '09-09-2025',
      priority: 'High'
    },
    {
      id: '105',
      issueType: 'Broken Bench',
      description: 'Park bench damaged',
      location: '23.3661, 85.3130',
      status: 'Acknowledged',
      submittedBy: 'Rohit Mehta',
      date: '09-09-2025',
      priority: 'Low'
    },
    {
      id: '106',
      issueType: 'Illegal Dumping',
      description: 'Construction waste dumped',
      location: '23.3777, 85.3215',
      status: 'Open',
      submittedBy: 'Saira Khan',
      date: '08-09-2025',
      priority: 'Medium'
    },
    {
      id: '107',
      issueType: 'Manhole Open',
      description: 'Open manhole near bus stand',
      location: '23.3580, 85.3091',
      status: 'In Progress',
      submittedBy: 'Ankit Sharma',
      date: '07-09-2025',
      priority: 'High'
    }
  ]);

  // Form state for new issue
  const [newIssue, setNewIssue] = useState({
    issueType: '',
    location: '',
    priority: 'Medium'
  });

  // Form submission handler
  const handleAddIssue = () => {
    if (!newIssue.issueType || !newIssue.location) {
      alert('Please fill in all required fields');
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
    
    const newIssueData = {
      id: String(Math.max(...issuesData.map(r => parseInt(r.id))) + 1),
      issueType: newIssue.issueType,
      description: `${newIssue.issueType} reported at ${newIssue.location}`,
      location: newIssue.location,
      status: 'Open',
      submittedBy: 'Anonymous User',
      date: formattedDate,
      priority: newIssue.priority
    };

    setIssuesData([newIssueData, ...issuesData]);
    
    // Reset form
    setNewIssue({
      issueType: '',
      location: '',
      priority: 'Medium'
    });
    
    setIsDialogOpen(false);
  };

  // Filter data based on search and filters
  const filteredData = issuesData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || item.issueType === departmentFilter;
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'destructive';
      case 'in progress':
        return 'default';
      case 'resolved':
        return 'secondary';
      case 'acknowledged':
        return 'outline';
      default:
        return 'secondary';
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
            <p className="text-muted-foreground">Manage your issue directory</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Issue</DialogTitle>
                  <DialogDescription>
                    Create a new issue report. Fill in all the required details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="issueType" className="text-right">
                      Issue Type *
                    </Label>
                    <Select value={newIssue.issueType} onValueChange={(value) => setNewIssue({...newIssue, issueType: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pothole">Pothole</SelectItem>
                        <SelectItem value="Streetlight Failure">Streetlight Failure</SelectItem>
                        <SelectItem value="Garbage Overflow">Garbage Overflow</SelectItem>
                        <SelectItem value="Water Leakage">Water Leakage</SelectItem>
                        <SelectItem value="Broken Bench">Broken Bench</SelectItem>
                        <SelectItem value="Illegal Dumping">Illegal Dumping</SelectItem>
                        <SelectItem value="Manhole Open">Manhole Open</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter location coordinates or address"
                      value={newIssue.location}
                      onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                      Priority
                    </Label>
                    <Select value={newIssue.priority} onValueChange={(value) => setNewIssue({...newIssue, priority: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddIssue}>
                    Add Issue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Pothole">Pothole</SelectItem>
                  <SelectItem value="Streetlight Failure">Streetlight</SelectItem>
                  <SelectItem value="Garbage Overflow">Garbage</SelectItem>
                  <SelectItem value="Water Leakage">Water</SelectItem>
                  <SelectItem value="Broken Bench">Infrastructure</SelectItem>
                  <SelectItem value="Illegal Dumping">Dumping</SelectItem>
                  <SelectItem value="Manhole Open">Manhole</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <p className="text-muted-foreground">No issues found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>{issue.issueType}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(issue.status)}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.date}</TableCell>
                        <TableCell>
                          <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'secondary'}>
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="outline" size="sm">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {issuesData.length} issues
              </p>
              <div className="text-sm text-muted-foreground">
                Page 1 of 1
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
