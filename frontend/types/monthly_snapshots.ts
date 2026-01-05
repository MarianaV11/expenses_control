import { StatusPage } from "./general";
import { UserIdentifier } from "./user";

export type MonthlySnapshotIdentifier = {
  id: number;
};

export type MonthlySnapshotDicts = {
  [label: string]: number;
};

export type MonthlySnapshot = MonthlySnapshotIdentifier &
  UserIdentifier & {
    current_revenue: number;
    year_month: string;
    total_spent: number;
    total_by_label: MonthlySnapshotDicts;
    percentage_by_label: MonthlySnapshotDicts;
    total_by_payment_type: MonthlySnapshotDicts;
    total_by_card: MonthlySnapshotDicts;
    started_at: string;
    ended_at: string;
  };

export type MonthlySnapshots = StatusPage & {
  total_snapshots: number;
  snapshots: MonthlySnapshot[];
};
