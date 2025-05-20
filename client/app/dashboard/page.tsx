import { Suspense } from "react";
import { 
  Computer, 
  Shield, 
  Lock, 
  AlertTriangle,
  Laptop, 
  Server,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getAllSystems } from "@/lib/api";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { StatusChart } from "@/components/dashboard/status-chart";
import { SystemsTable } from "@/components/dashboard/systems-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  const systems = await getAllSystems();
  
  // Calculate summary data
  const totalSystems = systems.length;
  const windowsSystems = systems.filter(s => s.os === "windows").length;
  const linuxSystems = systems.filter(s => s.os === "linux").length;
  const otherSystems = totalSystems - windowsSystems - linuxSystems;
  
  const upToDateSystems = systems.filter(s => s.os_up_to_date).length;
  const antivirusActiveSystems = systems.filter(s => s.antivirus_active).length;
  const encryptedSystems = systems.filter(s => s.disk_encrypted).length;
  
  const criticalIssues = systems.filter(
    s => !s.os_up_to_date || !s.antivirus_active || !s.disk_encrypted
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all your system monitoring data
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Systems"
          value={totalSystems}
          icon={Computer}
          description="Systems being monitored"
          trend={{ value: 5, isPositive: true }}
        />
        <SummaryCard
          title="Up-to-Date Systems"
          value={`${Math.round((upToDateSystems / totalSystems) * 100)}%`}
          icon={CheckCircle}
          description={`${upToDateSystems} of ${totalSystems} systems`}
          trend={upToDateSystems > 0 ? { value: 8, isPositive: true } : undefined}
        />
        <SummaryCard
          title="Active Antivirus"
          value={`${Math.round((antivirusActiveSystems / totalSystems) * 100)}%`}
          icon={Shield}
          description={`${antivirusActiveSystems} of ${totalSystems} systems`}
          trend={antivirusActiveSystems > 0 ? { value: 3, isPositive: true } : undefined}
        />
        <SummaryCard
          title="Critical Issues"
          value={criticalIssues}
          icon={AlertTriangle}
          description="Systems requiring attention"
          trend={criticalIssues > 0 ? { value: 2, isPositive: false } : undefined}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatusChart 
          data={systems}
          type="pie"
          title="Disk Encryption Status"
          dataKey="disk_encrypted"
        />
        <StatusChart 
          data={systems}
          type="bar"
          title="Antivirus Status"
          dataKey="antivirus_active"
        />
        <StatusChart 
          data={systems}
          type="pie"
          title="OS Distribution"
          dataKey="os"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Systems Update Status Trend</CardTitle>
          <CardDescription>Percentage of up-to-date systems over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Suspense
              fallback={<Skeleton className="h-[300px] w-full rounded-md" />}
            >
              <StatusChart 
                data={systems}
                type="line"
                title=""
                dataKey="os_up_to_date"
                className="border-0 shadow-none"
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent System Reports</h2>
        <Suspense
          fallback={<Skeleton className="h-[400px] w-full rounded-md" />}
        >
          <SystemsTable data={systems} />
        </Suspense>
      </div>
    </div>
  );
}