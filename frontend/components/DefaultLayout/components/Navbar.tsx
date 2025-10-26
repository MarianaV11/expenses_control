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
import { getUser } from "@/service/local_storage";
import { UserIdentifier, UserRead } from "@/types/user";
import { Menu, XIcon } from "lucide-react";
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
  const [user, setUser] = useState<UserRead | null>(null);

  const getUserInfo = useCallback(() => {
    const userId: string | null = getUser();

    if (userId) {
      const body: UserIdentifier = {
        user_id: parseInt(userId),
      };

      axios
        .get(`/users/user`, { params: body })
        .then((response) => setUser(response.data))
        .catch((error) => console.log(error));
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <nav className="p-2 border-b sticky top-0 z-50 flex justify-between items-center mb-0">
      {/* <SwitchTheme /> TODO: Remove this switch theme. */}
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
              variant="outline"
              className="rounded-md p-1 flex items-center h-[3rem] "
            >
              {user ? (
                <p>{user.name.split(" ").slice(0, 2).join(" ")}</p>
              ) : (
                <p>User</p>
              )}
            </Button>
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
      </div>
    </nav>
  );
}
