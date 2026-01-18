import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronFirst,
  ChevronLast,
  Cog,
  HandCoins,
  History,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback } from "react";
import SidebarItem from "./SidebarItem";
import { removeToken } from "@/service/local_storage";

interface SidebarProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
}

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const router = useRouter();

  const onLogout = useCallback(() => {
    removeToken();
    router.push("/");
  }, []);

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out transform",
        expanded
          ? "max-sm:fixed translate-x-0 max-sm:top-0 max-sm:left-0 max-sm:h-full bg-background/90 max-sm:w-full max-sm:z-50 w-64"
          : "w-[80px] max-sm:translate-x-0 translate-x-0",
      )}
    >
      <div className={cn("h-[100%] flex flex-col border-r shadow-sm")}>
        <div className="flex justify-end">
          <Button
            className={cn(
              "rounded-lg cursor-pointer border-zing-400 border bg-card m-2",
              expanded ? "hidden max-sm:block" : "hidden",
            )}
            variant="ghost"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>
        <div className="flex-1 p-4">
          <SidebarItem
            icon={<HandCoins />}
            text="Current Month"
            showItem={expanded}
            onClick={() => router.push("/expense")}
          />
          <SidebarItem
            icon={<History />}
            text="Spending History"
            showItem={expanded}
            onClick={() => router.push("/history")}
          />
          <SidebarItem
            icon={<Cog />}
            text="Settings"
            showItem={expanded}
            onClick={() => router.push("/settings")}
          />
        </div>
        <div className="border-t border-destructive/50 p-3">
          <SidebarItem
            icon={<LogOut className="text-destructive" />}
            text="Log out"
            showItem={expanded}
            onClick={onLogout}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
