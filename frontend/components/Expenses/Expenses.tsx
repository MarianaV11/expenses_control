"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format, toZonedTime } from "date-fns-tz";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import ExpensesTable, { Expense } from "./components/ExpensesTable";

const Expenses = () => {
  const data = [
    {
      name: "Pão",
      value: 100,
      day: "2024-01-01",
      card: "Santander",
      payment_type: "debit",
    },
    {
      name: "Pão",
      value: 100,
      day: "2024-01-01",
      card: "Santander",
      payment_type: "debit",
    },
    {
      name: "Pão",
      value: 100,
      day: "2024-01-01",
      card: "Santander",
      payment_type: "debit",
    },
    {
      name: "Pão",
      value: 100,
      day: "2024-01-01",
      card: "Santander",
      payment_type: "debit",
    },
  ];

  const columns = useMemo<ColumnDef<Expense>[]>(
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
                <DropdownMenuItem className="font-bold text-red-700">
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

  return (
    <div>
      <div className="rounded-md border p-2 shadow-sm">
        <p className="text-center font-bold text-xl mb-2">Expenses</p>
        <ExpensesTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Expenses;
