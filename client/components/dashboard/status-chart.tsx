"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemReport } from "@/lib/api";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

interface StatusChartProps {
  data: SystemReport[];
  type: "pie" | "bar" | "line";
  title: string;
  dataKey: keyof SystemReport | "count";
  colors?: string[];
  className?: string;
}

export function StatusChart({
  data,
  type,
  title,
  dataKey,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"],
  className,
}: StatusChartProps) {
  // Process data according to the chart type and dataKey
  const processedData = processChartData(data, dataKey, type);
  console.log(processedData)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base p-0">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(type, processedData, colors) ?? <div>No data available</div>}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Process data for different chart types
function processChartData(
  data: SystemReport[],
  dataKey: keyof SystemReport | "count",
  chartType: "pie" | "bar" | "line"
) {
  if (dataKey === "os") {
    const osCounts = data.reduce<Record<string, number>>((acc, system) => {
      acc[system.os] = (acc[system.os] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(osCounts).map(([name, value]) => ({ name, value }));
  }
  
  if (dataKey === "disk_encrypted") {
    const encryptedCount = data.filter(system => system.disk_encrypted).length;
    const notEncryptedCount = data.length - encryptedCount;
    
    return [
      { name: "Encrypted", value: encryptedCount },
      { name: "Not Encrypted", value: notEncryptedCount }
    ];
  }
  
  if (dataKey === "antivirus_active") {
    const activeCount = data.filter(system => system.antivirus_active).length;
    const inactiveCount = data.filter(system => system.antivirus_exists && !system.antivirus_active).length;
    const noAntivirusCount = data.filter(system => !system.antivirus_exists).length;
    
    return [
      { name: "Active", value: activeCount },
      { name: "Inactive", value: inactiveCount },
      { name: "No Antivirus", value: noAntivirusCount }
    ];
  }
  
  if (dataKey === "os_up_to_date") {
    const upToDateCount = data.filter(system => system.os_up_to_date).length;
    const outdatedCount = data.length - upToDateCount;
    
    if (chartType === "line") {
      // For line chart, create some historical data (mock)
      return [
        { name: "Week 1", upToDate: 60, outdated: 40 },
        { name: "Week 2", upToDate: 65, outdated: 35 },
        { name: "Week 3", upToDate: 70, outdated: 30 },
        { name: "Week 4", upToDate: 75, outdated: 25 },
        { name: "Current", upToDate: (upToDateCount / data.length) * 100, outdated: (outdatedCount / data.length) * 100 }
      ];
    }
    
    return [
      { name: "Up to Date", value: upToDateCount },
      { name: "Outdated", value: outdatedCount }
    ];
  }
  
  return [];
}

// Render the appropriate chart based on type
function renderChart(
  type: "pie" | "bar" | "line",
  data: any[],
  colors: string[]
) {
  if (type === "pie") {
    return (
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    );
  }
  
  if (type === "bar") {
    return (
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={colors[0]} />
      </BarChart>
    );
  }
  
  if (type === "line") {
    return (
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="upToDate" stroke={colors[0]} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="outdated" stroke={colors[1]} />
      </LineChart>
    );
  }
  
  return null;
}