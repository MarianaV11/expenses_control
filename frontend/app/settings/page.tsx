"use client";

import DefaultLayout from "@/components/DefaultLayout/DefaultLayout";
import Settings from "@/components/Settings/Settings";
import { useSidebarIcon } from "@/store/sidebar_icon.store";
import { useEffect } from "react";

const Page = () => {
  const setCurrentActive = useSidebarIcon((state) => state.setCurrentActive);

  useEffect(() => {
    setCurrentActive("Settings");
  }, []);

  return (
    <DefaultLayout>
      <Settings />
    </DefaultLayout>
  );
};

export default Page;
