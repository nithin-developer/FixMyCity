import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Collector } from "../../components/collector-card";
import { EyeIcon, Plus, RefreshCw, Trash2, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoCollectors: Collector[] = [
  {
    name: "Ramesh Kumar",
    address: "45, MG Road, Mysuru, Karnataka – 570001",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@gov.in",
    district: "Mysuru",
  },
  {
    name: "Anjali Sharma",
    address: "12, Civil Lines, Jaipur, Rajasthan – 302001",
    phone: "+91 91234 56789",
    email: "anjali.sharma@gov.in",
    district: "Jaipur",
  },
  {
    name: "Arvind Menon",
    address: "78, Marine Drive, Kochi, Kerala – 682001",
    phone: "+91 99887 66554",
    email: "arvind.menon@gov.in",
    district: "Ernakulam",
  },
  {
    name: "Priya Deshmukh",
    address: "9, Residency Road, Nagpur, Maharashtra – 440001",
    phone: "+91 93456 78123",
    email: "priya.deshmukh@gov.in",
    district: "Nagpur",
  },
];

const CollectorsPage: React.FC = () => {
  // View collector function
  const handleViewCollector = (name: string) => {
    alert(`Viewing ${name}`);
    // In a real application, you would navigate to collector details
  };

  // Delete collector function
  const handleDeleteCollector = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      alert(`${name} deleted successfully`);
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
            <h1 className="text-2xl font-semibold">Collectors</h1>
            <p className="text-muted-foreground">
              Manage District Collectors and their details
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => alert("Refresh")}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 animate-spin-once" />
            </Button>
            <Button variant="default" onClick={() => alert("Add Collector")}>
              <Plus className="h-4 w-4" />
              Add Collector
            </Button>
          </div>
        </div>

        {/* Demo Collectors Cards (using batch card style) */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {demoCollectors.map((c, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden border-border/60 hover:shadow-md transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-100 transition-opacity pointer-events-none" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {c.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        District: {c.district}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{c.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium truncate max-w-[150px]">
                      {c.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium truncate max-w-[150px]">
                      {c.address}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleViewCollector(c.name)}
                    className="flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCollector(c.name)}
                    className="flex items-center justify-center gap-2 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {demoCollectors.length} collectors
          </p>
          <div className="text-sm text-muted-foreground">Page 1 of 1</div>
        </div>
      </div>
    </>
  );
};

export default CollectorsPage;
