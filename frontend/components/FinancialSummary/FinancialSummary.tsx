"use client";

import { Card } from "@/components/ui/card";
import { MonthlyStatus } from "@/types/expenses";
import { formatCurrency } from "@/utils/currency";
import { DollarSign, Edit, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import CommonDialog from "../external/CommonDialog";
import { Button } from "../ui/button";
import FinancialSummaryForm from "./components/FinancialSummaryForm";

interface FinancialSummaryProps {
  getMonthlyStatus: () => Promise<void>;
  monthlyStatus: MonthlyStatus | undefined;
}

const FinancialSummary = ({
  getMonthlyStatus,
  monthlyStatus,
}: FinancialSummaryProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    getMonthlyStatus();
  }, [getMonthlyStatus]);

  const closeDialog = () => {
    setOpenDialog((current) => !current);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12 p-5 relative rounded-lg border">
      <Button
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => setOpenDialog((current) => !current)}
      >
        <Edit size={20} />
      </Button>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-xs break-words overflow-hidden">
            <p className="text-sm text-muted-foreground mb-1">
              Monthly Revenue
            </p>
            <p className="text-2xl font-bold text-foreground">
              {monthlyStatus
                ? formatCurrency(Number(monthlyStatus?.monthly_revenue))
                : "R$ 0,00"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-gradient-primary max-md:hidden">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-xs break-words overflow-hidden">
            <p className="text-sm text-muted-foreground mb-1">
              Monthly Expenses
            </p>
            <p className="text-2xl font-bold text-foreground">
              {monthlyStatus
                ? formatCurrency(Number(monthlyStatus?.total_expenses))
                : "R$ 0,00"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-gradient-danger max-md:hidden">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
        <div className="flex items-center justify-between">
          <div className="w-full max-w-xs break-words overflow-hidden">
            <p className="text-sm text-muted-foreground mb-1">
              Remaining Balance
            </p>
            <p
              className={`text-2xl font-bold ${
                300 >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {monthlyStatus
                ? formatCurrency(Number(monthlyStatus?.remaining_value))
                : "R$ 0,00"}
            </p>
          </div>
          <div
            className={`p-3 rounded-full max-md:hidden ${
              300 >= 0 ? "bg-gradient-success" : "bg-gradient-danger"
            }`}
          >
            <TrendingUp className="text-white" />
          </div>
        </div>
      </Card>

      <CommonDialog
        open={openDialog}
        setOpen={setOpenDialog}
        content={
          <FinancialSummaryForm
            closeDialog={closeDialog}
            getMonthlyStatus={getMonthlyStatus}
            monthlyRevenue={
              monthlyStatus ? Number(monthlyStatus?.monthly_revenue) : 0.0
            }
          />
        }
        description="Change your monthly revenue here."
        title="Monthly Revenue"
      />
    </div>
  );
};

export default FinancialSummary;
