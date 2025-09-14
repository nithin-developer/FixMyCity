import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { CollectorCard, Collector } from "../../components/collector-card";

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
            <p className="text-muted-foreground">Download and manage collector archives</p>
          </div>
        </div>

        {/* Demo Collectors Download Section */}
        <Card>
          <CardContent className="p-6">
            {/* Demo Collectors Cards replacing Table */}
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-4">
                {demoCollectors.map((collector, idx) => (
                  <CollectorCard 
                    key={idx} 
                    collector={collector}
                    onView={() => handleViewCollector(collector.name)}
                    onDelete={() => handleDeleteCollector(collector.name)}
                  />
                ))}
              </div>
            </div>

            {/* Demo Collectors Summary */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {demoCollectors.length} collectors
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
};

export default CollectorsPage;
