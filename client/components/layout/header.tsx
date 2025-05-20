"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { ModeToggle } from "../mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="flex items-center justify-between w-full">
          <div className="relative md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search systems..."
              className="w-full rounded-md pl-8 md:w-[300px] bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}