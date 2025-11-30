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
import { AxiosError, AxiosResponse } from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommonDialog from "../external/CommonDialog";
import { Badge } from "../ui/badge";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesTable, {
  Expense as ExpenseColumnType,
} from "./components/ExpensesTable";

interface ExpensesProps {
  getMonthlyStatus: () => Promise<void>;
}

const Expenses = ({ getMonthlyStatus }: ExpensesProps) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });

  const [data, setData] = useState<ExpenseColumnType[]>([]);
  const [objectData, setObjectData] = useState<ExpensesType>();

  const getExpenses = async () => {
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

        if (data) {
          setData(
            data.expenses.map(
              (expense): ExpenseColumnType => ({
                name: expense.name,
                value: expense.value,
                day: expense.day,
                card: expense.card,
                payment_type: expense.payment_type,
                id: expense.id,
                label_name: expense.label_name,
                label_color: expense.label_color,
              })
            )
          );

          setObjectData(data);
          getMonthlyStatus();
        }
      })
      .catch((error: AxiosError) => showErrorToast({ message: error.message }));
  };

  useEffect(() => {
    getExpenses();
  }, [pagination]);

  const deleteExpense = (id: number) => {
    axios
      .delete("/expenses/delete_expense", {
        params: { expense_id: id },
      })
      .then((response: AxiosResponse) => {
        setData((prev) => prev.filter((item) => item.id !== id));

        showSuccessToast({ message: response.data.message });

        getExpenses();
        getMonthlyStatus();
      })
      .catch((error: AxiosError) => showErrorToast({ message: error.message }));
  };

  const columns = useMemo<ColumnDef<ExpenseColumnType>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Name
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.getValue("name")}</div>
        ),
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
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.getValue("card")}</div>
        ),
      },
      {
        accessorKey: "payment_type",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Payment Type
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.getValue("payment_type")}
          </div>
        ),
      },
      {
        accessorKey: "label_name",
        header: () => (
          <div className="text-center font-extrabold dark:text-slate-300">
            Label
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center font-medium">
              <Badge
                variant="outline"
                style={{ backgroundColor: row.original.label_color }}
                className="border dark:hover:opacity-60"
              >
                <p className="text-white">
                  {row.getValue("label_name") ?? "No label"}
                </p>
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => console.log("edit")}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => deleteExpense(row.original.id)}
                className="font-bold text-red-700"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [deleteExpense]
  );

  return (
    <div>
      <div className="rounded-md border p-2 shadow-sm">
        <div className="flex justify-between p-2">
          <h1 className="text-center font-bold text-2xl mb-2">Expenses</h1>

          <CommonDialog
            content={<ExpensesForm getExpenses={getExpenses} />}
            description="Create a new expense to add in the table here."
            title="Add new expense"
            openButton={
              <Button size="icon">
                <Plus />
              </Button>
            }
          />
        </div>

        <ExpensesTable
          key={
            data.length === 0 ? "empty" : JSON.stringify(data.map((d) => d.id))
          }
          columns={columns}
          data={data}
        />

        <div className="flex items-center justify-end space-x-2 py-4 flex-1">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((current) => ({
                  ...current,
                  page: current.page - 1,
                }))
              }
              disabled={pagination.page === 1 || !objectData}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
              disabled={
                pagination.page === objectData?.total_page || !objectData
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
