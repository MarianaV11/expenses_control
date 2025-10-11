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
import { Home, Settings, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import SwitchTheme from "../../external/switch_theme";
import { axios } from "@/service/axios_config";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Despesas", url: "/expenses", icon: Wallet },
  { title: "Relatórios", url: "/reports", icon: TrendingUp },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserImage(1);
  }, []);

  const getUserImage = (user_id: number) => {
    axios
      .get(`/images/${user_id}/profile`)
      .then((response) => setUser(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <nav className="p-2 border-b sticky top-0 z-50 flex justify-end">
      <SwitchTheme />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-4xl"></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Previous Months</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
