"use client";

import { Card } from "@/components/ui/card";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { MonthlyStatus } from "@/types/expenses";
import { AxiosResponse } from "axios";
import { DollarSign, Edit, TrendingDown, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommonDialog from "../external/CommonDialog";
import { Button } from "../ui/button";
import FinancialSummaryForm from "./components/FinancialSummaryForm";

const FinancialSummary = () => {
  const [monthlyStatus, setMonthlyStatus] = useState<MonthlyStatus>();

  const getMonthlyStatus = useCallback(async () => {
    axios
      .get(`/expenses/monthly_status`, {
        params: {
          user_id: getUser(),
        },
      })
      .then((response: AxiosResponse<MonthlyStatus>) => {
        setMonthlyStatus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monthly status:", error);
      });
  }, []);

  useEffect(() => {
    getMonthlyStatus();
  }, [getMonthlyStatus]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  return (
    <div className="grid relative grid-cols-1 md:grid-cols-3 gap-6 p-5 pt-12 rounded-lg border">
      <CommonDialog
        className="absolute top-2 right-2"
        content={
          <FinancialSummaryForm
            getMonthlyStatus={getMonthlyStatus}
            monthlyRevenue={
              monthlyStatus ? Number(monthlyStatus?.monthly_revenue) : 0.0
            }
          />
        }
        description="Change your monthly revenue here."
        title="Monthly Revenue"
        openButton={
          <Button variant="ghost">
            <Edit size={20} />
          </Button>
        }
      />
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Monthly Revenue
            </p>
            <p className="text-2xl font-bold text-foreground">
              {monthlyStatus
                ? formatCurrency(Number(monthlyStatus?.monthly_revenue))
                : "R$ 0,00"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-gradient-primary">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Monthly Expenses
            </p>
            <p className="text-2xl font-bold text-foreground">
              {monthlyStatus
                ? formatCurrency(Number(monthlyStatus?.total_expenses))
                : "R$ 0,00"}
            </p>
          </div>
          <div className="p-3 rounded-full bg-gradient-danger">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
        <div className="flex items-center justify-between">
          <div>
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
            className={`p-3 rounded-full ${
              300 >= 0 ? "bg-gradient-success" : "bg-gradient-danger"
            }`}
          >
            <TrendingUp className="text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSummary;
