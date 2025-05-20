"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, RotateCw, CheckCircle2, XCircle, AppWindow as Windows, Link as Linux, Monitor, Shield, ShieldOff, Lock, Unlock } from "lucide-react";
import { SystemReport, getAllSystems, getFilteredSystems } from "@/lib/api";
import { SystemsTable } from "@/components/dashboard/systems-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function FilterPage() {
  const searchParams = useSearchParams();
  const [systems, setSystems] = useState<SystemReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Get initial filters from URL
  useEffect(() => {
    const initialFilters: Record<string, string> = {};
    
    // Extract filters from search params
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      initialFilters[key] = value;
    });
    
    setActiveFilters(initialFilters);
    
    // Load data
    const loadData = async () => {
      setLoading(true);
      try {
        // If filters exist, use filtered data
        if (Object.keys(initialFilters).length > 0) {
          const data = await getFilteredSystems(initialFilters);
          setSystems(data);
        } else {
          // Otherwise load all systems
          const data = await getAllSystems();
          setSystems(data);
        }
      } catch (error) {
        console.error("Error loading systems:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]);

  // Filter description for display
  const getFilterDescription = () => {
    const filters = [];
    
    if (activeFilters.os) {
      filters.push(`OS: ${activeFilters.os.charAt(0).toUpperCase() + activeFilters.os.slice(1)}`);
    }
    
    if (activeFilters.sort) {
      filters.push(`Sorted by: ${activeFilters.sort.replace('_', ' ')}`);
    }
    
    if (activeFilters.group) {
      filters.push(`Grouped by: ${activeFilters.group}`);
    }
    
    if (activeFilters.antivirus_active === 'true') {
      filters.push('Antivirus: Active');
    } else if (activeFilters.antivirus_active === 'false') {
      filters.push('Antivirus: Inactive');
    }
    
    if (activeFilters.disk_encrypted === 'true') {
      filters.push('Disk: Encrypted');
    } else if (activeFilters.disk_encrypted === 'false') {
      filters.push('Disk: Not Encrypted');
    }
    
    if (activeFilters.os_up_to_date === 'true') {
      filters.push('OS: Up to date');
    } else if (activeFilters.os_up_to_date === 'false') {
      filters.push('OS: Needs update');
    }
    
    return filters.length > 0 
      ? filters.join(' • ') 
      : 'No filters applied';
  };

  // Handle filter change
  const handleFilterChange = async (key: string, value: string | null) => {
    const newFilters = { ...activeFilters };
    
    if (value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setActiveFilters(newFilters);
    
    // Update URL with new filters
    const url = new URL(window.location.href);
    url.search = '';
    
    Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
      url.searchParams.set(filterKey, filterValue);
    });
    
    window.history.pushState({}, '', url.toString());
    
    // Reload data with new filters
    setLoading(true);
    try {
      const data = await getFilteredSystems(newFilters);
      setSystems(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = async () => {
    setActiveFilters({});
    
    // Clear URL params
    window.history.pushState({}, '', window.location.pathname);
    
    // Reload all data
    setLoading(true);
    try {
      const data = await getAllSystems();
      setSystems(data);
    } catch (error) {
      console.error("Error resetting filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group systems by a key
  const getGroupedSystems = () => {
    if (!activeFilters.group) return null;
    
    const groupKey = activeFilters.group as keyof SystemReport;
    const grouped: Record<string, SystemReport[]> = {};
    
    systems.forEach(system => {
      const groupValue = String(system[groupKey]);
      if (!grouped[groupValue]) {
        grouped[groupValue] = [];
      }
      grouped[groupValue].push(system);
    });
    
    return grouped;
  };

  const groupedSystems = getGroupedSystems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Filtered Systems</h1>
          <p className="text-muted-foreground">{getFilterDescription()}</p>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          <RotateCw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Options</CardTitle>
          <CardDescription>
            Select criteria to filter and sort systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Operating System</label>
              <Select
                value={activeFilters.os || ''}
                onValueChange={(value) => handleFilterChange('os', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any OS</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="linux">Linux</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 pt-2">
                <Button 
                  variant={activeFilters.os === 'windows' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('os', activeFilters.os === 'windows' ? null : 'windows')}
                  className="flex-1"
                >
                  <Windows className="mr-1 h-4 w-4" />
                  Windows
                </Button>
                <Button 
                  variant={activeFilters.os === 'linux' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('os', activeFilters.os === 'linux' ? null : 'linux')}
                  className="flex-1"
                >
                  <Linux className="mr-1 h-4 w-4" />
                  Linux
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={activeFilters.sort || ''}
                  onValueChange={(value) => handleFilterChange('sort', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="hostname">Hostname</SelectItem>
                    <SelectItem value="machine_id">Machine ID</SelectItem>
                    <SelectItem value="reported_at">Report Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Group By</label>
                <Select
                  value={activeFilters.group || ''}
                  onValueChange={(value) => handleFilterChange('group', value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Grouping</SelectItem>
                    <SelectItem value="os">Operating System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status Filters</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeFilters.os_up_to_date === 'true' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'os_up_to_date', 
                    activeFilters.os_up_to_date === 'true' ? null : 'true'
                  )}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Up to date
                </Button>
                <Button 
                  variant={activeFilters.os_up_to_date === 'false' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'os_up_to_date', 
                    activeFilters.os_up_to_date === 'false' ? null : 'false'
                  )}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Outdated
                </Button>
                <Button 
                  variant={activeFilters.antivirus_active === 'true' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'antivirus_active', 
                    activeFilters.antivirus_active === 'true' ? null : 'true'
                  )}
                >
                  <Shield className="mr-1 h-4 w-4" />
                  AV Active
                </Button>
                <Button 
                  variant={activeFilters.antivirus_active === 'false' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'antivirus_active', 
                    activeFilters.antivirus_active === 'false' ? null : 'false'
                  )}
                >
                  <ShieldOff className="mr-1 h-4 w-4" />
                  AV Inactive
                </Button>
                <Button 
                  variant={activeFilters.disk_encrypted === 'true' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'disk_encrypted', 
                    activeFilters.disk_encrypted === 'true' ? null : 'true'
                  )}
                >
                  <Lock className="mr-1 h-4 w-4" />
                  Encrypted
                </Button>
                <Button 
                  variant={activeFilters.disk_encrypted === 'false' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange(
                    'disk_encrypted', 
                    activeFilters.disk_encrypted === 'false' ? null : 'false'
                  )}
                >
                  <Unlock className="mr-1 h-4 w-4" />
                  Not Encrypted
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-6">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Active filters: {Object.keys(activeFilters).length === 0 ? 'None' : Object.keys(activeFilters).length}
            </span>
            
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex gap-2 ml-4 flex-wrap">
                {Object.entries(activeFilters).map(([key, value]) => (
                  <Badge 
                    key={key} 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => handleFilterChange(key, null)}
                  >
                    {key.replace('_', ' ')}: {value}
                    <XCircle className="h-3 w-3 ml-1 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {loading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : systems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Monitor className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No systems found</h2>
            <p className="text-muted-foreground">
              No systems match your current filter criteria.
            </p>
            <Button className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : groupedSystems ? (
        // Grouped view
        <div className="space-y-6">
          {Object.entries(groupedSystems).map(([group, groupSystems]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold capitalize">{group}</h2>
                <Badge>{groupSystems.length}</Badge>
              </div>
              <SystemsTable data={groupSystems} />
            </div>
          ))}
        </div>
      ) : (
        // Regular table view
        <SystemsTable data={systems} />
      )}
    </div>
  );
}