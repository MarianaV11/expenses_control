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
import { useProfile } from "@/store/profile.store";
import { useUser } from "@/store/user.store";
import { AxiosError } from "axios";
import { ChevronDown, Menu, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { shallow } from "zustand/shallow";

interface NavbarProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  expanded: boolean;
}

export function Navbar({ expanded, setExpanded }: NavbarProps) {
  const router = useRouter();

  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  const onLogout = useCallback(() => {
    removeToken();
    router.push("/");
  }, []);

  const getUserProfile = useCallback(async () => {
    axios
      .get(`/images/${getUser()}/profile`, { responseType: "blob" })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setProfile(url);
      })
      .catch((error: AxiosError) => console.log(error));
  }, []);

  const getUserData = useCallback(async () => {
    axios
      .get(`/users/user`, {
        params: {
          user_id: Number(getUser()),
        },
      })
      .then((response) => setUser(response.data))
      .catch((error: AxiosError) => console.log(error));
  }, []);

  useEffect(() => {
    getUserProfile();
    getUserData();
  }, [getUserProfile, getUserData]);

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
              className="flex items-center justify-center border-none bg-transparent m-1 
              [&[data-state=closed]_svg]:opacity-50
              [&[data-state=open]_svg]:opacity-100
              [&[data-state=open]_svg]:rotate-180"
            >
              <div className="flex max-md:hidden">
                <div className="w-11 h-11 relative overflow-hidden rounded-full">
                  <Image
                    alt="user_profile"
                    src={profile}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
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
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
