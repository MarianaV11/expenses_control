"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { MonthlySnapshot } from "@/types/monthly_snapshots";
import { AxiosResponse } from "axios";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
  const chartDataPaymentType = useMemo(
    () =>
      Object.entries(monthSnapshot.total_by_payment_type ?? {}).map(
        ([label, value]) => ({
          paymentType: label,
          value,
        }),
      ),
    [monthSnapshot.total_by_payment_type],
  );

  const chartDataCardType = useMemo(
    () =>
      Object.entries(monthSnapshot.total_by_card ?? {}).map(
        ([card, value]) => ({
          cardType: card,
          value,
        }),
      ),
    [monthSnapshot.total_by_card],
  );

  const chartDataLabelType = useMemo(
    () =>
      Object.entries(monthSnapshot.total_by_label ?? {}).map(
        ([label, value]) => ({
          label: label,
          value,
        }),
      ),
    [monthSnapshot.total_by_label],
  );

  const remainingValue =
    monthSnapshot.current_revenue - monthSnapshot.total_spent;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4 max-md:grid-cols-1 max-md:gap-4">
        <div className="text-lg border border-t-secondary border-t-4 p-2 text-center font-bold rounded-md">
          <p className="text-sm text-muted-foreground font-light">
            Current Revenue
          </p>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(monthSnapshot.current_revenue)}
        </div>
        <div className="text-lg border p-2 border-t-destructive border-t-4 text-center font-bold rounded-md">
          <p className="text-sm text-muted-foreground font-light">
            Total Spent
          </p>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(monthSnapshot.total_spent)}
        </div>
        <div className="text-lg border p-2 border-t-blue-400 border-t-4 text-center font-bold rounded-md">
          <p className="text-sm text-muted-foreground font-light">
            Remaining Value
          </p>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(remainingValue)}
        </div>
      </div>
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
        <div className="border flex flex-col overflow-y-scroll rounded-md p-4 max-h-100">
          <h2 className="font-medium mb-2">Percentage</h2>
          {monthSnapshot.percentage_by_label &&
            Object.entries(monthSnapshot.percentage_by_label).map(
              ([label, percentage], index) => (
                <Badge key={index} variant="outline" className="mb-2">
                  {label}: {percentage}%
                </Badge>
              ),
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
