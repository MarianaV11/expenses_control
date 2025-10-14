"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import {
  ChevronFirst,
  ChevronLast,
  HandCoins,
  LayoutDashboardIcon,
  PiggyBank,
  User,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const [profile, setProfile] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(true);

  const getUserImage = useCallback(async () => {
    const userId: string | null = getUser();

    if (userId) {
      axios
        .get(`/images/${userId}/profile`, { responseType: "blob" })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProfile(url);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  useEffect(() => {
    getUserImage();
  }, [getUserImage]);

  return (
    <aside
      className={cn(
        expanded ? "w-64" : "w-min",
        "transition delay-150 duration-300 ease-in-out"
      )}
    >
      <nav
        className={cn(
          "h-[100%] flex flex-col border-r shadow-sm",
          expanded && ""
        )}
      >
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1 className={cn("text-xl text-shadow-md", !expanded && "hidden")}>
            Expenses Control
          </h1>
          <Button
            className="rounded-lg cursor-pointer border-zing-400 border bg-card"
            variant="ghost"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>

        <ul className="flex-1 px-3">
          <SidebarItem
            icon={<HandCoins />}
            text="Current Month"
            showItem={expanded}
          />
          <SidebarItem
            icon={<LayoutDashboardIcon />}
            text="Dashboard"
            showItem={expanded}
          />
          <SidebarItem
            icon={<PiggyBank />}
            text="History of Spending"
            showItem={expanded}
          />
        </ul>

        <div className="flex p-3 items-center border-t">
          {profile ? (
            <div className="w-10 h-10 relative overflow-hidden rounded-full flex-shrink-0">
              <Image
                alt="user_profile"
                src={profile}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <User className="h-8 w-8 dark:text-slate-300 flex-shrink-0" />
          )}
          <div
            className={cn(
              "flex justify-between items-center overflow-hidden transition-all duration-300",
              expanded ? "ml-3 opacity-100" : "max-w-0 opacity-0"
            )}
          >
            <div className="leading-4">
              <h4 className="font-semiboldy">Mariana Vieira</h4>
              <span className="text-xs text-gray-500">
                marianavieiracostaarauj@gmail.com
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
