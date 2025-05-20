"use client";

import { getAllSystems } from "@/lib/api";
import { useEffect, useState } from "react";
import { SystemReport } from "@/lib/api";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [systems, setSystems] = useState<SystemReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSystems();
        setSystems(data);
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // OS Distribution data
  const osDistribution = systems.reduce<Record<string, number>>((acc, system) => {
    const os = system.os;
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {});

  const osDistributionData = Object.entries(osDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Antivirus data
  const antivirusData = [
    {
      name: "Active",
      value: systems.filter(s => s.antivirus_active).length
    },
    {
      name: "Inactive",
      value: systems.filter(s => s.antivirus_exists && !s.antivirus_active).length
    },
    {
      name: "No Antivirus",
      value: systems.filter(s => !s.antivirus_exists).length
    }
  ];

  // Encryption data
  const encryptionData = [
    {
      name: "Encrypted",
      value: systems.filter(s => s.disk_encrypted).length
    },
    {
      name: "Not Encrypted",
      value: systems.filter(s => !s.disk_encrypted).length
    }
  ];

  // OS Update Status data
  const updateStatusData = [
    {
      name: "Up to Date",
      value: systems.filter(s => s.os_up_to_date).length
    },
    {
      name: "Outdated",
      value: systems.filter(s => !s.os_up_to_date).length
    }
  ];

  // Trend data (mock historical data for demo)
  const trendData = [
    { name: 'Jan', windows: 4, linux: 2, macos: 1 },
    { name: 'Feb', windows: 5, linux: 2, macos: 1 },
    { name: 'Mar', windows: 6, linux: 3, macos: 1 },
    { name: 'Apr', windows: 6, linux: 3, macos: 2 },
  ];

  // Antivirus adoption trend (mock data)
  const antivirusTrendData = [
    { name: 'Jan', active: 60, inactive: 30, none: 10 },
    { name: 'Feb', active: 65, inactive: 25, none: 10 },
    { name: 'Mar', active: 70, inactive: 20, none: 10 },
    { name: 'Apr', active: 75, inactive: 20, none: 5 },
    { name: 'May', active: 80, inactive: 15, none: 5 }
  ];

  // Current month stats
  const windowsSystems = systems.filter(s => s.os === 'windows').length;
  const linuxSystems = systems.filter(s => s.os === 'linux').length;
  const macOSSystems = systems.filter(s => s.os === 'macos').length;
  const otherOSSystems = systems.length - windowsSystems - linuxSystems - macOSSystems;

  // Color definitions
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analytics and trends for your systems
        </p>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>OS Distribution</CardTitle>
                  <CardDescription>
                    Distribution of operating systems across all devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={osDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {osDistributionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[0]}}></div>
                      <span className="text-sm">Windows: {windowsSystems}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[1]}}></div>
                      <span className="text-sm">Linux: {linuxSystems}</span>
                    </div>
                    {macOSSystems > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[2]}}></div>
                        <span className="text-sm">macOS: {macOSSystems}</span>
                      </div>
                    )}
                    {otherOSSystems > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[3]}}></div>
                        <span className="text-sm">Other: {otherOSSystems}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>OS Update Status</CardTitle>
                  <CardDescription>
                    Status of OS updates across your systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={updateStatusData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill={COLORS[0]} name="Systems" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-md border p-3">
                      <div className="text-2xl font-bold">
                        {Math.round((systems.filter(s => s.os_up_to_date).length / systems.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Up to date</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-2xl font-bold">
                        {Math.round((systems.filter(s => !s.os_up_to_date).length / systems.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Need updates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Antivirus Status</CardTitle>
                  <CardDescription>
                    Status of antivirus protection across all systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={antivirusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {antivirusData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disk Encryption</CardTitle>
                  <CardDescription>
                    Status of disk encryption across all systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={encryptionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {encryptionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-md border p-3">
                      <div className="text-2xl font-bold">
                        {Math.round((systems.filter(s => s.disk_encrypted).length / systems.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Encrypted</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-2xl font-bold">
                        {Math.round((systems.filter(s => !s.disk_encrypted).length / systems.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Not encrypted</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>OS Distribution Trend</CardTitle>
                  <CardDescription>
                    Trend of OS distribution over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={trendData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="windows" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                        <Area type="monotone" dataKey="linux" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} />
                        <Area type="monotone" dataKey="macos" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Antivirus Adoption Trend</CardTitle>
                  <CardDescription>
                    Trend of antivirus adoption over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={antivirusTrendData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="active" stroke={COLORS[0]} name="Active" />
                        <Line type="monotone" dataKey="inactive" stroke={COLORS[1]} name="Inactive" />
                        <Line type="monotone" dataKey="none" stroke={COLORS[2]} name="No Antivirus" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}