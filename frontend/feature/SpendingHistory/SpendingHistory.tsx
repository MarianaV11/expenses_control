"use client";

import { axios } from "@/service/axios_config";
import { showToast } from "@/service/toast_service";
import { Pagination } from "@/types/general";
import { MonthlySnapshot, MonthlySnapshots } from "@/types/monthly_snapshots";
import { AxiosError, AxiosResponse } from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CommonDialog from "../../components/external/CommonDialog";
import { Button } from "../../components/ui/button";
import SpendingHistoryCard from "./components/SpendingHistoryCard";
import SpendingHistoryMetrics from "./components/SpendingHistoryMetrics";

const SpendingHistory = () => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 9,
  });
  const [monthlySnapshots, setMonthlySnapshots] =
    useState<MonthlySnapshots | null>(null);
  const [currentSnapshot, setCurrentSnapshot] =
    useState<MonthlySnapshot | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    getMonthlyHistory();
  }, [pagination]);

  const getMonthlyHistory = () => {
    axios
      .get("/monthly_snapshots/snapshots", {
        params: {
          user_id: 8,
          page: pagination.page,
          per_page: pagination.per_page,
        },
      })
      .then((response: AxiosResponse<MonthlySnapshots>) => {
        const data = response.data;

        setMonthlySnapshots(data);
      })
      .catch((error: AxiosError) =>
        showToast({ message: String(error), type: "error" }),
      );
  };

  const setCurrentMonthlySnapshot = (snapshotId: number) => {
    const snapshot: MonthlySnapshot | undefined =
      monthlySnapshots?.snapshots.find(
        (item: MonthlySnapshot) => item.id === snapshotId,
      );

    snapshot && setCurrentSnapshot(snapshot);
    setOpenDialog(true);
  };

  return (
    <>
      <div className="border p-5 rounded-sm border-t-8 border-primary/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {monthlySnapshots?.snapshots &&
            monthlySnapshots?.snapshots.map((snapshot: MonthlySnapshot) => (
              <SpendingHistoryCard
                key={snapshot.id}
                currentRevenue={snapshot.current_revenue}
                totalByLabel={snapshot.total_by_label}
                totalSpent={snapshot.total_spent}
                yearMonth={snapshot.year_month}
                onClick={() => setCurrentMonthlySnapshot(snapshot.id)}
              />
            ))}
        </div>
        {!monthlySnapshots?.snapshots.length && (
          <div className="text-center w-full">No history found ✘</div>
        )}

        <h2 className="font-light text-muted-foreground text-end mt-5">
          <span className="font-bold">{monthlySnapshots?.total_snapshots}</span>{" "}
          months recorded.
        </h2>

        <div className="mt-5 flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setPagination((current) => ({
                ...current,
                page: current.page - 1,
              }))
            }
            disabled={pagination.page === 1}
          >
            <ChevronLeft /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setPagination((current) => ({
                ...current,
                page: current.page + 1,
              }))
            }
            disabled={pagination.page === monthlySnapshots?.total_page}
          >
            Next <ChevronRight />
          </Button>
        </div>
      </div>

      {currentSnapshot && (
        <CommonDialog
          title="Metrics of Month"
          open={openDialog}
          setOpen={setOpenDialog}
          className="w-fit min-h-[80dvh] max-h-[100dvh] max-w-none overflow-scroll overflow-x-hidden"
          content={
            <SpendingHistoryMetrics
              onCloseModal={setOpenDialog}
              monthSnapshot={currentSnapshot}
            />
          }
        />
      )}
    </>
  );
};

export default SpendingHistory;
