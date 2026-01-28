"use client";

import TitlePage from "@/components/TitlePage";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import Expenses from "@/feature/Expenses/Expenses";
import FinancialSummary from "@/feature/FinancialSummary/FinancialSummary";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { useSidebarIcon } from "@/store/sidebar_icon.store";
import { MonthlyStatus } from "@/types/expenses";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [monthlyStatus, setMonthlyStatus] = useState<MonthlyStatus>();
  const setCurrentActive = useSidebarIcon((state) => state.setCurrentActive);

  useEffect(() => {
    setCurrentActive("Current Month");
  }, []);

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

  return (
    <DefaultLayout>
      <TitlePage name="Expense Log" />
      <div className="flex flex-col gap-4">
        <FinancialSummary
          getMonthlyStatus={getMonthlyStatus}
          monthlyStatus={monthlyStatus}
        />
        <Expenses getMonthlyStatus={getMonthlyStatus} />
      </div>
    </DefaultLayout>
  );
};

export default Page;
