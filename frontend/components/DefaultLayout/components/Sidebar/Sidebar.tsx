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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
}

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const [profile, setProfile] = useState<string | null>(null);

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
        "transition-all duration-300 ease-in-out transform",
        expanded
          ? "max-sm:fixed translate-x-0 max-sm:top-0 max-sm:left-0 max-sm:h-full bg-background/90 max-sm:w-full max-sm:z-50 w-64"
          : "w-[80px] max-sm:translate-x-0 translate-x-0"
      )}
    >
      <div className={cn("h-[100%] flex flex-col border-r shadow-sm")}>
        <div
          className={cn(
            "flex justify-center items-center transition-all duration-75",
            expanded && "p-4 pb-4 border-b justify-between"
          )}
        >
          <h1
            className={cn(
              "text-xl duration-300 text-nowrap transition-colors font-medium",
              !expanded && "opacity-0 max-h-0 max-w-0 -z-10"
            )}
          >
            Expenses Control
          </h1>
          <Button
            className={cn(
              "rounded-lg cursor-pointer border-zing-400 border bg-card",
              expanded ? "hidden max-sm:block" : "hidden"
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
        </div>

        <div
          className={cn(
            "flex p-3 items-center border-t transition-all duration-300 ease-in-out transform",
            !expanded && "justify-center"
          )}
        >
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
              expanded
                ? "flex justify-between items-center overflow-hidden transition-all duration-300 ml-3 opacity-100"
                : "max-w-0 opacity-0"
            )}
          >
            <div className="leading-4">
              <h4 className="font-semiboldy">Mariana Vieira</h4>
              <span className="text-xs text-gray-300">
                marianavieiracostaarauj@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
