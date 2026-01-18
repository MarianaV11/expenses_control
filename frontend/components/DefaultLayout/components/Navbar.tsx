"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axios } from "@/service/axios_config";
import { getUser, removeToken } from "@/service/local_storage";
import { UserRead } from "@/types/user";
import { AxiosError } from "axios";
import { ChevronDown, Menu, User, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface NavbarProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
}

export function Navbar({ expanded, setExpanded }: NavbarProps) {
  const router = useRouter();

  const [profile, setProfile] = useState<string>("/default_user.png");
  const [user, setUser] = useState<UserRead | null>(null);

  const onLogout = useCallback(() => {
    removeToken();
    router.push("/");
  }, []);

  const getUserImage = useCallback(async () => {
    const userId: string | null = getUser();

    if (userId) {
      axios
        .get(`/images/${userId}/profile`, { responseType: "blob" })
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProfile(url);
        })
        .catch((error: AxiosError) => console.log(error));
      axios
        .get(`/users/user`, {
          params: {
            user_id: userId,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error: AxiosError) => console.log(error));
    }
  }, []);

  useEffect(() => {
    getUserImage();
  }, [getUserImage]);

  return (
    <nav className="p-2 border-b sticky top-0 z-50 flex justify-between items-center mb-0">
      <Button
        className="rounded-lg cursor-pointer border-zing-400 border bg-card"
        variant="ghost"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? <XIcon /> : <Menu />}
      </Button>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="menu"
              className="flex items-center justify-center border-none bg-transparent m-1 [&[data-state=open]_svg]:rotate-180"
            >
              <div className="flex max-md:hidden">
                {profile ? (
                  <div className="w-11 h-11 relative overflow-hidden rounded-full">
                    <Image
                      alt="user_profile"
                      src={profile}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User className="h-8 w-8 dark:text-slate-300" />
                )}
                {user && (
                  <div className="flex justify-center flex-col ml-3">
                    <h4 className="font-semiboldy">
                      {user.name.split(" ").slice(0, 2).join(" ")}
                    </h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                )}
              </div>
              <ChevronDown className="transition-transform duration-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Spending</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/expense")}>
              Current Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/history")}>
              Previous Months
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
