import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExpenseFilter } from "@/types/expenses";
import { format } from "date-fns-tz";
import { ArrowRight, Timer } from "lucide-react";
import React from "react";

interface ExpensesRangeDateProps {
  filter: {
    start_date: Date;
    end_date: Date;
  };
  setFilter: React.Dispatch<React.SetStateAction<ExpenseFilter>>;
}

const ExpensesRangeDate = ({ filter, setFilter }: ExpensesRangeDateProps) => {
  const onSelectDate = (
    date: Date | undefined,
    type: "start_date" | "end_date",
  ) => {
    setFilter((current) => ({
      ...current,
      [type]: date,
    }));
  };

  return (
    <div className="flex gap-4 items-center max-md:flex-col">
      <Popover>
        <PopoverTrigger asChild className="bg-slate-background">
          <Button variant="outline">
            {format(filter.start_date, "PPP")}
            <Timer className="ml-auto h-4 w-4 opacity-80 text-secondary" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Calendar
            mode="single"
            selected={filter.start_date}
            onSelect={(date) => onSelectDate(date, "start_date")}
            captionLayout="dropdown"
            disabled={{ after: filter.end_date }}
          />
        </PopoverContent>
      </Popover>

      <ArrowRight className="h-5 w-5 opacity-50 text-secondary max-md:rotate-90" />

      <Popover>
        <PopoverTrigger asChild className="bg-slate-background">
          <Button variant="outline">
            {format(filter.end_date, "PPP")}
            <Timer className="ml-auto h-4 w-4 opacity-80 text-secondary" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Calendar
            mode="single"
            selected={filter.end_date}
            onSelect={(date) => onSelectDate(date, "end_date")}
            disabled={{ before: filter.start_date }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExpensesRangeDate;
