"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showToast } from "@/service/toast_service";
import { useBank } from "@/store/banks.store";
import { useLabel } from "@/store/label.store";
import {
  Expense,
  ExpenseFilter,
  Expenses as ExpensesType,
} from "@/types/expenses";
import { Pagination } from "@/types/general";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError, AxiosResponse } from "axios";
import { format, toZonedTime } from "date-fns-tz";
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  CreditCard,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CommonDialog from "../../components/external/CommonDialog";
import { Badge } from "../../components/ui/badge";
import ExpensesForm from "./components/ExpensesForm";
import ExpensesHeaderDropdown from "./components/ExpensesHeaderDropdown";
import ExpensesRangeDate from "./components/ExpensesRangeDate";
import ExpensesTable, {
  Expense as ExpenseColumnType,
} from "./components/ExpensesTable";

const now = new Date();

const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
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
  const [selectedData, setSelectedData] = useState<Expense | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [filter, setFilter] = useState<ExpenseFilter>({
    sort_by: "day",
    order: "desc",
    start_date: firstDayOfMonth,
    end_date: lastDayOfMonth,
    label_id: null,
    card_name: null,
    payment_type: null,
  });

  const banks = useBank((state) => state.banks);
  const typePayment = useBank((state) => state.typePayment);

  const labels = useLabel((state) => state.labels);
  const setLabels = useLabel((state) => state.setLabel);

  const getExpenses = useCallback(async () => {
    try {
      const response: AxiosResponse<ExpensesType> = await axios.get(
        "/expenses/user_expenses",
        {
          params: {
            user_id: getUser(),
            page: pagination.page,
            per_page: pagination.per_page,
            sort_by: filter.sort_by,
            order: filter.order,
            start_date: format(filter.start_date, "yyyy-MM-dd"),
            end_date: format(filter.end_date, "yyyy-MM-dd"),
            label_id: filter.label_id,
            card_name: filter.card_name,
            payment_type: filter.payment_type,
          },
        },
      );

      const data = response.data;

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
          }),
        ),
      );

      setObjectData(data);
      getMonthlyStatus();
    } catch (error) {
      showToast({ message: String(error), type: "error" });
    }
  }, [pagination, filter, getMonthlyStatus]);

  const getLabels = useCallback(async () => {
    try {
      const response: AxiosResponse = await axios.get("/labels/user_labels", {
        params: {
          user_id: getUser(),
          page: 1,
          per_page: 50,
        },
      });

      setLabels(response.data.labels);
    } catch (error) {
      showToast({ message: String(error), type: "error" });
    }
  }, []);

  useEffect(() => {
    getExpenses();
  }, [pagination, filter]);

  useEffect(() => {
    getLabels();
  }, [getLabels]);

  const deleteExpense = (id: number) => {
    axios
      .delete("/expenses/delete_expense", {
        params: { expense_id: id },
      })
      .then((response: AxiosResponse) => {
        setData((prev) => prev.filter((item) => item.id !== id));

        showToast({ message: response.data.message, type: "success" });

        getExpenses();
        getMonthlyStatus();
      })
      .catch((error: AxiosError) =>
        showToast({ message: error.message, type: "error" }),
      );
  };

  const changeFilters = useCallback(
    (
      sort_by: ExpenseFilter["sort_by"],
      order: ExpenseFilter["order"],
      label_id: number | null = null,
      card_name: string | null = null,
      payment_type: string | null = null,
    ) => {
      setFilter((current) => ({
        ...current,
        sort_by,
        order,
        label_id,
        payment_type,
        card_name,
      }));
    },
    [],
  );

  const columns = useMemo<ColumnDef<ExpenseColumnType>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <ExpensesHeaderDropdown
            title="Name"
            actions={[
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowUp />
                    Sort from A-Z
                  </div>
                ),
                onClick: () => changeFilters("name", "asc"),
              },
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowDown />
                    Sort from Z-A
                  </div>
                ),
                onClick: () => changeFilters("name", "desc"),
              },
            ]}
          />
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "value",
        header: () => (
          <ExpensesHeaderDropdown
            title="Value"
            actions={[
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowUp />
                    Crescent
                  </div>
                ),
                onClick: () => changeFilters("value", "asc"),
              },
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowDown />
                    Descending
                  </div>
                ),
                onClick: () => changeFilters("value", "desc"),
              },
            ]}
          />
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
          <ExpensesHeaderDropdown
            title="Day"
            actions={[
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowUp />
                    Oldest
                  </div>
                ),
                onClick: () => changeFilters("day", "asc"),
              },
              {
                label: (
                  <div className="flex items-center gap-2 justify-center">
                    <ArrowDown />
                    Latest
                  </div>
                ),
                onClick: () => changeFilters("day", "desc"),
              },
            ]}
          />
        ),
        cell: ({ row }) => {
          const zonedDate = toZonedTime(
            row.getValue("day"),
            "America/Sao_Paulo",
          );
          const formatted = format(zonedDate, "dd/MM/yyyy");
          return <div className="text-center font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: "card",
        header: () => (
          <ExpensesHeaderDropdown
            title="Card"
            actions={banks.map((bank: string) => ({
              label: (
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>{bank}</span>
                </div>
              ),
              onClick: () => changeFilters("card", "asc", null, bank),
            }))}
          />
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.getValue("card")}</div>
        ),
      },
      {
        accessorKey: "payment_type",
        header: () => (
          <ExpensesHeaderDropdown
            title="Payment Type"
            actions={typePayment.map((type: string) => ({
              label: (
                <div className="flex items-center gap-2">
                  <Banknote size={16} />
                  <span>{type}</span>
                </div>
              ),
              onClick: () =>
                changeFilters("payment_type", "asc", null, null, type),
            }))}
          />
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
          <ExpensesHeaderDropdown
            title="Label"
            actions={labels.map((type) => ({
              label: (
                <div key={type.id} className="flex items-center gap-2">
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: type.color }}
                  >
                    {type.name}
                  </Badge>
                </div>
              ),
              onClick: () => changeFilters("label", "asc", type.id),
            }))}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center font-medium">
              <Badge
                variant="outline"
                style={{ backgroundColor: row.original.label_color }}
                className={cn(
                  "border dark:hover:opacity-60 text-white",
                  row.getValue("label_name") ?? "text-dark",
                )}
              >
                {row.getValue("label_name") ?? "No label"}
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
              <DropdownMenuItem onClick={() => updateExpense(row.original.id)}>
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
    [deleteExpense, changeFilters, banks, typePayment, labels],
  );

  const updateExpense = async (expense_id: number) => {
    axios
      .get("expenses/user_expense", { params: { expense_id: expense_id } })
      .then((response: AxiosResponse<Expense>) => {
        const data = response.data;

        setSelectedData(data);
        setOpenDialog(true);
      })
      .catch((error: AxiosError) =>
        showToast({ message: String(error), type: "error" }),
      );
  };

  const closeDialog = () => {
    setOpenDialog((current) => !current);
  };

  return (
    <>
      <div className="rounded-md border p-2 shadow-sm border-t-10 border-primary/50">
        <div className="flex justify-between p-2">
          <h1 className="text-center font-medium text-2xl mb-2">Expenses</h1>
          <ExpensesRangeDate
            filter={{
              start_date: filter.start_date,
              end_date: filter.end_date,
            }}
            setFilter={setFilter}
          />
          <Button
            size="icon"
            onClick={() => {
              setSelectedData(null);
              setOpenDialog((current) => !current);
            }}
          >
            <Plus />
          </Button>
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

      <CommonDialog
        open={openDialog}
        setOpen={setOpenDialog}
        content={
          <ExpensesForm
            closeDialog={closeDialog}
            currentExpense={selectedData}
            getExpenses={getExpenses}
          />
        }
        description="Create a new expense to add in the table here."
        title="Add new expense"
      />
    </>
  );
};

export default Expenses;
