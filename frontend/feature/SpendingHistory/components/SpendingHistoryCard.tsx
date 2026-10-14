import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";
import { TrendingDown, TrendingUp } from "lucide-react";

interface SpendingHistoryCardProps {
  currentRevenue: number;
  totalSpent: number;
  yearMonth: string;
  totalByLabel: Record<string, number>;
  onClick: () => void;
}

const SpendingHistoryCard = ({
  currentRevenue,
  totalSpent,
  yearMonth,
  totalByLabel,
  onClick,
}: SpendingHistoryCardProps) => {
  const totalRemaining = currentRevenue - totalSpent;
  const isOverBudget = totalSpent >= currentRevenue;
  const spentPercentage =
    currentRevenue > 0 ? (totalSpent / currentRevenue) * 100 : 0;

  const [year, month] = yearMonth.split("-").map(Number);
  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const now = new Date();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const topLabels = Object.entries(totalByLabel ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer gap-4 transition-shadow duration-300 hover:shadow-lg border-t-4 border-t-muted-foreground/20"
    >
      <CardHeader className="flex items-start justify-between gap-2">
        <div>
          <CardTitle className="text-lg">{monthName}</CardTitle>
          {isCurrentMonth && (
            <span className="text-xs text-muted-foreground">Current month</span>
          )}
        </div>
        <Badge variant={isOverBudget ? "destructive" : "success"}>
          {isOverBudget ? <TrendingDown /> : <TrendingUp />}
          {formatCurrency(totalRemaining)}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="font-semibold tabular-nums">
              {formatCurrency(currentRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="font-semibold tabular-nums text-destructive">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Revenue spent</span>
            <span
              className={cn(
                "tabular-nums",
                isOverBudget && "text-destructive font-medium",
              )}
            >
              {spentPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress
            value={Math.min(spentPercentage, 100)}
            className={cn(isOverBudget && "[&>div]:bg-destructive")}
          />
        </div>

        {topLabels.length > 0 && (
          <div className="border-t pt-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Top categories
            </p>
            {topLabels.map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate">{label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(value)}
                  </span>
                </div>
                <Progress
                  className="h-1.5"
                  value={totalSpent > 0 ? (value / totalSpent) * 100 : 0}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingHistoryCard;
