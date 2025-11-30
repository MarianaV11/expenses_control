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
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center py-2 px-2 font-medium rounded-md cursor-pointer transition-colors",
        active
          ? "border"
          : "hover:bg-indigo-50 hover:scale-105 text-gray-600 dark:hover:bg-card dark:text-slate-300",
        !showItem && "justify-center"
      )}
    >
      <span className="flex justify-center items-center w-5 h-5">{icon}</span>
      <p
        className={cn(
          "text-nowrap text-sm transition-all duration-300 overflow-hidden",
          showItem ? "w-52 opacity-100 ml-3" : "w-0 opacity-0"
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default SidebarItem;
