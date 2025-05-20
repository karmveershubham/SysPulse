"use client";

import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Server, 
  Shield,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {toast} from "sonner"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      toast("Settings saved. Your settings have been saved successfully.");
    }, 1000);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your SysPulse monitoring dashboard
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account and dashboard preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@syspulse.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh">Dashboard Auto-Refresh</Label>
                <Select defaultValue="300">
                  <SelectTrigger id="refresh">
                    <SelectValue placeholder="Select refresh interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Never</SelectItem>
                    <SelectItem value="60">Every minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                    <SelectItem value="600">Every 10 minutes</SelectItem>
                    <SelectItem value="1800">Every 30 minutes</SelectItem>
                    <SelectItem value="3600">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="local">Local Time Zone</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging for troubleshooting
                  </p>
                </div>
                <Switch id="debug-mode" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Status Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when system status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for security issues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Show real-time alerts in the dashboard
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Toast Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show toast notifications for important events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-email">Alert Email Address</Label>
                <Input id="alert-email" type="email" defaultValue="alerts@example.com" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Bell className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="systems">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system monitoring settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="scan-interval">System Scan Interval</Label>
                <Select defaultValue="86400">
                  <SelectTrigger id="scan-interval">
                    <SelectValue placeholder="Select scan interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3600">Hourly</SelectItem>
                    <SelectItem value="43200">Twice Daily</SelectItem>
                    <SelectItem value="86400">Daily</SelectItem>
                    <SelectItem value="604800">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                    <SelectItem value="180">6 Months</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Checks</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>OS Version Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Check if OS is up to date
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Antivirus Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Check antivirus status
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Disk Encryption Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Check disk encryption status
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sleep Configuration Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Check system sleep configuration
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Server className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Policies</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Disk Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Flag systems without disk encryption as critical
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Active Antivirus</Label>
                    <p className="text-sm text-muted-foreground">
                      Flag systems without active antivirus as critical
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Up-to-date OS</Label>
                    <p className="text-sm text-muted-foreground">
                      Flag systems with outdated OS as critical
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="security-level">Default Security Level</Label>
                <Select defaultValue="high">
                  <SelectTrigger id="security-level">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" type="password" value="••••••••••••••••••••••" readOnly />
                  <Button variant="outline">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Used for API access to SysPulse
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Shield className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}