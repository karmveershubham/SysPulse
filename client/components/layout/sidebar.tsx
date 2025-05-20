"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Cpu, LayoutDashboard, Settings, Laptop, Activity, AppWindow as Windows, Link as Linux, Server } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      matches: (path: string) => path === "/dashboard",
    },
    {
      name: "All Systems",
      icon: Server,
      href: "/dashboard/systems",
      matches: (path: string) => path === "/dashboard/systems",
    },
    // {
    //   name: "By Hostname",
    //   icon: Laptop,
    //   href: "/dashboard/filter?sort=hostname",
    //   matches: (path: string) => path.includes("sort=hostname"),
    // },
    // {
    //   name: "By OS",
    //   icon: Cpu,
    //   href: "/dashboard/filter?group=os",
    //   matches: (path: string) => path.includes("group=os"),
    // },
    // {
    //   name: "By Machine ID",
    //   icon: Activity,
    //   href: "/dashboard/filter?sort=machine_id",
    //   matches: (path: string) => path.includes("sort=machine_id"),
    // },
    // {
    //   name: "Windows Systems",
    //   icon: Windows,
    //   href: "/dashboard/filter?os=windows",
    //   matches: (path: string) => path.includes("os=windows"),
    // },
    // {
    //   name: "Linux Systems",
    //   icon: Linux,
    //   href: "/dashboard/filter?os=linux",
    //   matches: (path: string) => path.includes("os=linux"),
    // },
    {
      name: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      matches: (path: string) => path === "/dashboard/analytics",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      matches: (path: string) => path === "/dashboard/settings",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Activity className="h-6 w-6 text-primary" />
          <span>SysPulse</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md group transition-colors",
              route.matches(pathname)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <route.icon className="mr-3 h-5 w-5 shrink-0" />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">SP</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@syspulse.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}