import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Download, Trash2 } from 'lucide-react';

export default function ReportsIndexPage() {
  // Demo reports data for download section
  const demoReportsData = [
    {
      slNo: 1,
      startDate: '01-09-2025',
      endDate: '05-09-2025',
    },
    {
      slNo: 2,
      startDate: '03-09-2025',
      endDate: '08-09-2025',
    },
    {
      slNo: 3,
      startDate: '07-09-2025',
      endDate: '10-09-2025',
    },
    {
      slNo: 4,
      startDate: '09-09-2025',
      endDate: '12-09-2025',
    },
    {
      slNo: 5,
      startDate: '11-09-2025',
      endDate: '13-09-2025',
    }
  ];

  // Download PDF function
  const handleDownloadPDF = (slNo: number) => {
    // Create a simple PDF download simulation
    const filename = `report_${slNo}_${new Date().getTime()}.pdf`;
    alert(`Downloading ${filename}`);
    // In a real application, you would trigger actual PDF generation and download
  };

  // Delete report function
  const handleDeleteReport = (slNo: number) => {
    if (confirm(`Are you sure you want to delete report ${slNo}?`)) {
      alert(`Report ${slNo} deleted successfully`);
      // In a real application, you would remove the item from the data array
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
            <p className="text-muted-foreground">Download and manage report archives</p>
          </div>
        </div>

        {/* Demo Reports Download Section */}
        <Card>
          <CardContent className="p-6">
            {/* Demo Reports Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl. No</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoReportsData.map((report) => (
                    <TableRow key={report.slNo}>
                      <TableCell className="font-medium">{report.slNo}</TableCell>
                      <TableCell>{report.startDate}</TableCell>
                      <TableCell>{report.endDate}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadPDF(report.slNo)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download PDF
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteReport(report.slNo)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Demo Reports Summary */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {demoReportsData.length} archived reports
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
