import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Server, 
  RefreshCw, 
  Check, 
  X,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Calendar
} from "lucide-react";
import { getSystemById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default async function SystemDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const system = await getSystemById(params.id);

  if (!system) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/systems">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{system.hostname}</h1>
          <Badge
            variant="outline"
            className={cn(
              "ml-2",
              system.os === "windows" && "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
              system.os === "linux" && "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
              system.os === "macos" && "bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
            )}
          >
            {system.os === "windows" ? "Windows" : 
             system.os === "linux" ? "Linux" : 
             system.os === "macos" ? "macOS" : system.os}
          </Badge>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Request Update
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
            <CardDescription>Basic system details and identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hostname</p>
                <p className="text-lg font-medium">{system.hostname}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Machine ID</p>
                <p className="text-sm font-mono bg-muted p-1 rounded">{system.machine_id}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operating System</p>
              <p className="text-lg font-medium">{system.current_os_version}</p>
              <div className="flex items-center gap-1 mt-1">
                {system.os_up_to_date ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {system.os_up_to_date
                    ? "System is up to date"
                    : `Update required (latest: ${system.latest_os_version})`}
                </span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Reported</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(system.reported_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Status</CardTitle>
            <CardDescription>Security and compliance information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Antivirus Protection</p>
                <Badge
                  variant={system.antivirus_active ? "default" : "destructive"}
                >
                  {system.antivirus_active ? "Active" : system.antivirus_exists ? "Inactive" : "Not Installed"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {system.antivirus_active ? (
                  <Shield className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm">
                    {system.antivirus_exists
                      ? system.antivirus_name
                      : "No antivirus software detected"}
                  </p>
                  {system.antivirus_exists && !system.antivirus_active && (
                    <p className="text-xs text-red-500 mt-1">
                      Antivirus is installed but not active
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Disk Encryption</p>
                <Badge
                  variant={system.disk_encrypted ? "default" : "destructive"}
                >
                  {system.disk_encrypted ? "Encrypted" : "Not Encrypted"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {system.disk_encrypted ? (
                  <Lock className="h-5 w-5 text-green-500" />
                ) : (
                  <Unlock className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm">
                    {system.disk_encrypted
                      ? `Protected using ${system.disk_encryption_method}`
                      : "Disk encryption is not enabled"}
                  </p>
                  {!system.disk_encrypted && (
                    <p className="text-xs text-red-500 mt-1">
                      Enable disk encryption to protect sensitive data
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Sleep Configuration</p>
                <Badge
                  variant={system.sleep_ok ? "default" : "destructive"}
                >
                  {system.sleep_ok ? "Properly Configured" : "Issue Detected"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {system.sleep_ok ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <p className="text-sm">
                  {system.sleep_ok
                    ? "Sleep mode is properly configured"
                    : "Sleep mode configuration has issues"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Complete System Report</CardTitle>
          <CardDescription>Raw report data in JSON format</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
            {JSON.stringify(system, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}