import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

  return (
    <Card
      onClick={onClick}
      className="relative hover:scale-105 hover:shadow-2xl cursor-pointer transform transition-transform ease-in-out duration-300"
    >
      <div className="bg-gradient-to-r from-[var(--primary)]/50 via-purple-600 to-[var(--secondary)]/60 h-3 w-full rounded-t-lg absolute top-0"></div>
      <CardHeader className="flex justify-between max-sm:flex-col max-sm:items-center">
        <CardTitle>{yearMonth.replace("-", "/")}</CardTitle>
        {totalSpent >= currentRevenue ? (
          <Badge variant="destructive">
            <TrendingDown />
            {formatCurrency(totalRemaining)}
          </Badge>
        ) : (
          <Badge variant="success">
            <TrendingUp />
            {formatCurrency(totalRemaining)}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-10 max-sm:flex-col max-sm:gap-1">
          <div>
            <p className="text-sm font-light">Revenue</p>
            <p className="text-success font-bold">
              {formatCurrency(currentRevenue)}
            </p>
          </div>
          <div>
            <p className="text-sm font-light">Spent</p>
            <p className="text-destructive font-bold">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
        <div className="relative">
          <p className="text-sm font-light">Revenue Expenditure</p>
          <Progress
            className="w-full"
            value={(totalSpent / currentRevenue) * 100}
          />
          <p className="text-sm font-light absolute top-0 right-0 max-sm:hidden">
            {((totalSpent / currentRevenue) * 100).toFixed(2)}%
          </p>
        </div>
        <div className="mt-4">
          <p className="font-light">By category</p>
          {totalByLabel &&
            Object.entries(totalByLabel)
              .slice(0, 3)
              .map(([label, value], index) => (
                <div key={index}>
                  <p className="font-light text-sm">{label}</p>
                  <div className="flex gap-1 items-center">
                    <Progress
                      className="w-full"
                      value={(value / totalSpent) * 100}
                    />
                    <p className="text-sm font-medium max-sm:hidden">
                      {formatCurrency(value)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingHistoryCard;
