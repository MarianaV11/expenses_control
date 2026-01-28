"use client";

import TitlePage from "@/components/TitlePage";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import Settings from "@/feature/Settings/Settings";
import { useSidebarIcon } from "@/store/sidebar_icon.store";
import { useEffect } from "react";

const Page = () => {
  const setCurrentActive = useSidebarIcon((state) => state.setCurrentActive);

  useEffect(() => {
    setCurrentActive("Settings");
  }, []);

  return (
    <DefaultLayout>
      <TitlePage name="Settings" />
      <Settings />
    </DefaultLayout>
  );
};

export default Page;
