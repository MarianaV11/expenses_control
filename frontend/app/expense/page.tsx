"use client";

import DefaultLayout from "@/components/DefaultLayout/DefaultLayout";
import Expenses from "@/components/Expenses/Expenses";
import FinancialSummary from "@/components/FinancialSummary/FinancialSummary";
import React from "react";

const Expense = () => {
  return (
    <DefaultLayout>
      <div className="m-4 flex flex-col gap-4">
        <FinancialSummary />
        <Expenses />
      </div>
    </DefaultLayout>
  );
};

export default Expense;
