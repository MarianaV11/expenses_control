import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import React, { ReactNode } from "react";

export type DropdownActionItem = {
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isThereSeparator?: boolean;
};

interface ExpensesHeaderDropdownProps {
  title: string;
  actions: DropdownActionItem[];
}

const ExpensesHeaderDropdown = ({
  title,
  actions,
}: ExpensesHeaderDropdownProps) => {
  return (
    <div className="w-full text-center flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="ml-5 text-muted-foreground max-h-6 data-[state=open]:bg-slate-200 dark:data-[state=open]:bg-slate-700"
            variant="ghost"
          >
            {title} <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-50">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </DropdownMenuItem>
              {action.isThereSeparator && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExpensesHeaderDropdown;
