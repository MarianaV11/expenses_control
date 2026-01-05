import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showErrorToast } from "@/service/toast_service";
import { UserRead } from "@/types/user";
import { AxiosError } from "axios";
import {
  ChevronFirst,
  ChevronLast,
  HandCoins,
  History,
  LayoutDashboardIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [profile, setProfile] = useState<string | null>(null);
  const [user, setUser] = useState<UserRead | null>(null);

  const getUserImage = useCallback(async () => {
    const userId: string | null = getUser();

    if (userId) {
      axios
        .get(`/images/${userId}/profile`, { responseType: "blob" })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProfile(url);
        })
        .catch(() => setProfile("/default_user.png"));
      axios
        .get(`/users/user`, {
          params: {
            user_id: userId,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error: AxiosError) =>
          showErrorToast({ message: String(error) })
        );
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
        <div className="flex justify-end">
          <Button
            className={cn(
              "rounded-lg cursor-pointer border-zing-400 border bg-card m-2",
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
            onClick={() => router.push("/expense")}
          />
          <SidebarItem
            icon={<LayoutDashboardIcon />}
            text="Dashboard"
            showItem={expanded}
          />
          <SidebarItem
            icon={<History />}
            text="Spending History"
            showItem={expanded}
            onClick={() => router.push("/history")}
          />
        </div>

        <div
          className={cn(
            "flex p-3 items-center border-t transition-all duration-300 ease-in-out transform",
            !expanded && "justify-center"
          )}
        >
          {profile ? (
            <div className="w-11 h-11 relative overflow-hidden rounded-full flex-shrink-0">
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
            {user && (
              <div className="leading-4">
                <h4 className="font-semiboldy truncate">
                  {user.name.split(" ").slice(0, 2).join(" ")}
                </h4>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
