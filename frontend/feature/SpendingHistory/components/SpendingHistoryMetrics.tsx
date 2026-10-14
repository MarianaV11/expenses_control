"use client";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { MonthlySnapshot } from "@/types/monthly_snapshots";
import { formatCurrency } from "@/utils/currency";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface SpendingHistoryMetricsProps {
  monthSnapshot: MonthlySnapshot;
  onCloseModal: Dispatch<SetStateAction<boolean>>;
}

const chartConfig = {
  value: {
    label: "Spent",
  },
} satisfies ChartConfig;

const COLORS = [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`);

const toChartData = (totals: Record<string, number> | undefined) =>
  Object.entries(totals ?? {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

const compactCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(value);

const tooltip = (
  <ChartTooltip
    cursor={{ fill: "var(--muted)" }}
    content={
      <ChartTooltipContent
        formatter={(value, name) => (
          <div className="flex w-full justify-between gap-4">
            <span className="text-muted-foreground">{name}</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(Number(value))}
            </span>
          </div>
        )}
      />
    }
  />
);

const Section = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn(
      "border-t-10 border-t-muted-foreground/20 rounded-md border p-4",
      className,
    )}
  >
    <h2 className="font-medium mb-4">{title}</h2>
    {children}
  </div>
);

const SpendingHistoryMetrics = ({
  monthSnapshot,
  onCloseModal,
}: SpendingHistoryMetricsProps) => {
  const byCard = useMemo(
    () => toChartData(monthSnapshot.total_by_card),
    [monthSnapshot.total_by_card],
  );
  const byPaymentType = useMemo(
    () => toChartData(monthSnapshot.total_by_payment_type),
    [monthSnapshot.total_by_payment_type],
  );
  const byLabel = useMemo(
    () => toChartData(monthSnapshot.total_by_label),
    [monthSnapshot.total_by_label],
  );

  const remainingValue =
    monthSnapshot.current_revenue - monthSnapshot.total_spent;

  const summary = [
    { title: "Revenue", value: monthSnapshot.current_revenue },
    {
      title: "Total Spent",
      value: monthSnapshot.total_spent,
      className: "text-destructive",
    },
    {
      title: "Remaining",
      value: remainingValue,
      className: remainingValue >= 0 ? "text-success" : "text-destructive",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
        {summary.map(({ title, value, className }) => (
          <div
            key={title}
            className="border border-t-4 border-t-muted-foreground/20 rounded-md p-3"
          >
            <p className="text-xs text-muted-foreground">{title}</p>
            <p
              className={cn("text-xl font-bold tabular-nums mt-1", className)}
            >
              {formatCurrency(value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Section title="By Card">
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={byCard} margin={{ left: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={compactCurrency}
                width={70}
              />
              {tooltip}
              <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Section>

        <Section title="By Payment Type">
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={byPaymentType} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={compactCurrency}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={90}
              />
              {tooltip}
              <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </Section>
      </div>

      <Section title="By Label">
        {byLabel.length ? (
          <div className="flex items-center gap-6 max-md:flex-col">
            <ChartContainer
              config={chartConfig}
              className="h-[220px] w-[220px] shrink-0"
            >
              <PieChart>
                {tooltip}
                <Pie
                  data={byLabel}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="var(--card)"
                >
                  {byLabel.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex-1 w-full flex flex-col gap-2 max-h-[220px] overflow-y-auto">
              {byLabel.map(({ name, value }, index) => (
                <li key={name} className="flex items-center gap-3 text-sm">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1 truncate">{name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(value)}
                  </span>
                  <span className="tabular-nums font-medium w-14 text-right">
                    {(monthSnapshot.percentage_by_label?.[name] ?? 0).toFixed(
                      1,
                    )}
                    %
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No expenses this month.</p>
        )}
      </Section>

      <div className="flex justify-end">
        <Button onClick={() => onCloseModal(false)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
};

export default SpendingHistoryMetrics;
