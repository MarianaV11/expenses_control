"use client";

import TitlePage from "@/components/TitlePage";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import SpendingHistory from "@/feature/SpendingHistory/SpendingHistory";
import { useSidebarIcon } from "@/store/sidebar_icon.store";
import { useEffect } from "react";

const Page = () => {
  const setCurrentActive = useSidebarIcon((state) => state.setCurrentActive);

  useEffect(() => {
    setCurrentActive("Spending History");
  }, []);

  return (
    <DefaultLayout>
      <TitlePage name="Spending History" />
      <SpendingHistory />
    </DefaultLayout>
  );
};

export default Page;
