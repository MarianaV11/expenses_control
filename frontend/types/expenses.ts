import { StatusPage } from "./general";

export type MonthlyStatus = {
  monthly_revenue: string;
  remaining_value: string;
  total_expenses: string;
};

export type ExpenseIdentifier = {
  id: number;
};

export type Expense = ExpenseIdentifier & {
  name: string;
  value: number;
  day: string;
  card: string;
  payment_type: string;
  label_id: number;
  label_name: string;
  label_color: string;
  created_at: string;
};

export type Expenses = StatusPage & {
  total_expenses: number;
  expenses: Expense[];
};

export type ExpenseCreate = {
  user_id: number;
  name: string;
  value: number;
  day: string;
  card: string;
  payment_type: string;
  label_id: number | null;
};

export type ExpenseUpdate = ExpenseCreate & ExpenseIdentifier;

export type ExpenseFilter = {
  sort_by:
    | "name"
    | "value"
    | "day"
    | "card"
    | "payment_type"
    | "created_at"
    | "label";
  order: "asc" | "desc";
  start_date: Date;
  end_date: Date;
  label_id: number | null;
  card_name: string | null;
  payment_type: string | null;
};
