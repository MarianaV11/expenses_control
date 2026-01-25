"use client";

import DefaultLayout from "@/components/DefaultLayout/DefaultLayout";
import SpendingHistory from "@/components/SpendingHistory/SpendingHistory";
import { useSidebarIcon } from "@/store/sidebar_icon.store";
import { useEffect } from "react";

const Page = () => {
  const setCurrentActive = useSidebarIcon((state) => state.setCurrentActive);

  useEffect(() => {
    setCurrentActive("Spending History");
  }, []);

  return (
    <DefaultLayout>
      <SpendingHistory />
    </DefaultLayout>
  );
};

export default Page;
