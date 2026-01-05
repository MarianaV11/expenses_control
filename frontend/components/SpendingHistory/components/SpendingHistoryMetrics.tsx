import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { MonthlySnapshot } from "@/types/monthly_snapshots";
import { Dispatch, SetStateAction } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SpendingHistoryMetricsProps {
  monthSnapshot: MonthlySnapshot;
  onCloseModal: Dispatch<SetStateAction<boolean>>;
}

const chartConfig = {
  value: {
    label: "Value Spent",
  },
} satisfies ChartConfig;

const SpendingHistoryMetrics = ({
  monthSnapshot,
  onCloseModal,
}: SpendingHistoryMetricsProps) => {
  const chartDataPaymentType = Object.entries(
    monthSnapshot.total_by_payment_type ?? {}
  ).map(([label, value]) => ({
    paymentType: label,
    value,
  }));

  const chartDataCardType = Object.entries(
    monthSnapshot.total_by_card ?? {}
  ).map(([card, value]) => ({
    cardType: card,
    value,
  }));

  const chartDataLabelType = Object.entries(
    monthSnapshot.total_by_label ?? {}
  ).map(([label, value]) => ({
    label: label,
    value,
  }));

  return (
    <div>
      <div className="flex justify-center items-center gap-2 mb-4 max-md:flex-col">
        <div className="border-t-10 rounded-md border p-2 flex-1">
          <h2 className="font-medium m-4">Card Type</h2>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataCardType}>
                <XAxis dataKey="cardType" type="category" />
                <YAxis type="number" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="border-t-10 rounded-md border p-2 flex-1">
          <h2 className="font-medium m-4">Payment Type</h2>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataPaymentType} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="paymentType" type="category" />
                <Tooltip />
                <CartesianGrid vertical={false} />
                <Bar
                  dataKey="value"
                  fill="var(--chart-2)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      <div className="border-t-10 border p-2 rounded-2xl flex max-md:flex-col">
        <div className="flex-1">
          <h2 className="font-medium ml-4">Label Type</h2>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart data={chartDataPaymentType}>
                <Tooltip />
                <Pie
                  data={chartDataLabelType}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius="50%"
                  fill="#926ef5"
                />
                <Pie
                  data={chartDataLabelType}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  fill="#4300ff"
                  label
                />
                <LabelList
                  fill="black"
                  position="center"
                  valueAccessor={() => "center"}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="border flex flex-col overflow-y-scroll rounded-md p-4">
          <h2 className="font-medium mb-2">Percentage</h2>
          {monthSnapshot.percentage_by_label &&
            Object.entries(monthSnapshot.percentage_by_label).map(
              ([label, percentage], index) => (
                <Badge key={index} variant="outline" className="mb-2">
                  {label}: {percentage}%
                </Badge>
              )
            )}
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <Button
          onClick={() => onCloseModal(false)}
          variant="outline"
          className="w-20"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default SpendingHistoryMetrics;
