import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: typeof LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: SummaryCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-rose-500 dark:text-rose-400"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}