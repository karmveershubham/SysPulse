"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  X, 
  ExternalLink, 
  Shield, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  ArrowUpDown, 
  MoreHorizontal 
} from "lucide-react";
import { SystemReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SystemsTableProps {
  data: SystemReport[];
  className?: string;
}

type SortField = "hostname" | "os" | "reported_at" | "machine_id";
type SortDirection = "asc" | "desc";

export function SystemsTable({ data, className }: SystemsTableProps) {
  const [sortField, setSortField] = useState<SortField>("hostname");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    const sortOrder = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * sortOrder;
    }
    
    if (sortField === "reported_at") {
      return (new Date(a.reported_at).getTime() - new Date(b.reported_at).getTime()) * sortOrder;
    }
    
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("hostname")}>
                Hostname
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("os")}>
                OS
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("reported_at")}>
                Last Report
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No systems found
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((system) => (
              <TableRow key={system.machine_id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{system.hostname}</span>
                    <span className="text-xs text-muted-foreground">
                      {system.machine_id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      system.os === "windows" && "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
                      system.os === "linux" && "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
                      system.os === "macos" && "bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
                    )}
                  >
                    {system.os === "windows" ? "Windows" : 
                     system.os === "linux" ? "Linux" : 
                     system.os === "macos" ? "macOS" : system.os}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {system.current_os_version}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      {system.os_up_to_date ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {system.os_up_to_date ? "Up to date" : "Update required"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {system.antivirus_active ? (
                        <Shield className="h-4 w-4 text-green-500" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {system.antivirus_active
                          ? `${system.antivirus_name} (active)`
                          : system.antivirus_exists
                          ? `${system.antivirus_name} (inactive)`
                          : "No antivirus"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {system.disk_encrypted ? (
                        <Lock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Unlock className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {system.disk_encrypted
                          ? `Encrypted (${system.disk_encryption_method})`
                          : "Not encrypted"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {/* <span className="text-sm">{formatDate(system.reported_at)}</span> */}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/dashboard/systems/${system.machine_id}`} className="flex items-center w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Request Update
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}