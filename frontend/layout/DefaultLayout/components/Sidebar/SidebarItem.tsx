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
        "relative flex items-center py-2 px-2 font-medium rounded-md cursor-pointer transition-colors mt-1 mb-1",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        !showItem && "justify-center",
      )}
    >
      <span
        className={cn(
          "flex justify-center items-center w-5 h-5",
          active && "text-primary",
        )}
      >
        {icon}
      </span>
      <p
        className={cn(
          "text-nowrap text-sm transition-all duration-300 overflow-hidden",
          showItem ? "w-52 opacity-100 ml-3" : "w-0 opacity-0",
        )}
      >
        {text}
      </p>
    </div>
  );
};

export default SidebarItem;
