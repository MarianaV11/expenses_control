import { cn } from "@/lib/utils";
import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  showItem?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  text,
  active,
  showItem,
  onClick,
}: SidebarItemProps) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors",
        active
          ? "bg-gradient-to-tr from-primary to-indigo-100 text-white"
          : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-card dark:text-slate-300"
      )}
    >
      {icon}
      <span className={cn("w-52 ml-3", !showItem && "hidden")}>{text}</span>
    </li>
  );
};

export default SidebarItem;
