"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showErrorToast, showSuccessToast } from "@/service/toast_service";
import { Expenses as ExpensesType } from "@/types/expenses";
import { Pagination } from "@/types/general";
import { ColumnDef } from "@tanstack/react-table";
import { Axios, AxiosError, AxiosResponse } from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ExpensesTable, {
  Expense as ExpenseColumnType,
} from "./components/ExpensesTable";

const Expenses = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const [data, setData] = useState<ExpenseColumnType[]>([]);

  const getExpenses = useCallback(async () => {
    axios
      .get("/expenses/user_expenses", {
        params: {
          user_id: getUser(),
          page: pagination.page,
          per_page: pagination.per_page,
        },
      })
      .then((response: AxiosResponse<ExpensesType>) => {
        const data = response.data;

        setData(() =>
          data.expenses.map(
            (expense): ExpenseColumnType => ({
              name: expense.name,
              value: expense.value,
              day: expense.day,
              card: expense.card,
              payment_type: expense.payment_type,
              id: expense.id,
            })
          )
        );
      })
      .catch((error: AxiosError) => showErrorToast({ message: error.message }));
  }, []);

  useEffect(() => {
    getExpenses();
  }, []);

  const columns = useMemo<ColumnDef<ExpenseColumnType>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Name
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center font-medium">
              {row.getValue("name")}
            </div>
          );
        },
      },
      {
        accessorKey: "value",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Value
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("value"));
          const formatted = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount);

          return <div className="text-center font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "day",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Day
          </div>
        ),
        cell: ({ row }) => {
          const zonedDate = toZonedTime(
            row.getValue("day"),
            "America/Sao_Paulo"
          );
          const formatted = format(zonedDate, "dd/MM/yyyy");
          return <div className="text-center font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "card",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Card
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center font-medium">
              {row.getValue("card")}
            </div>
          );
        },
      },
      {
        accessorKey: "payment_type",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Payment Type
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center font-medium">
              {row.getValue("payment_type")}
            </div>
          );
        },
      },
      {
        id: "actions",
        parentId: "id",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Edit</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => console.log("click")}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => console.log(row.getValue("id"))}
                  className="font-bold text-red-700"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const deleteExpense = useCallback((id: number) => {
    axios
      .delete("/expenses/delete_expense", {
        params: {
          expense_id: id,
        },
      })
      .then((response: AxiosResponse) =>
        showSuccessToast({ message: response.data })
      )
      .catch((error: AxiosError) => showErrorToast({ message: error.message }));
  }, []);

  return (
    <div>
      <div className="rounded-md border p-2 shadow-sm">
        <h1 className="text-center font-bold text-2xl mb-2">Expenses</h1>
        <ExpensesTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Expenses;
