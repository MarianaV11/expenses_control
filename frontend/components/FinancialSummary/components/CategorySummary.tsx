import { SunMedium } from "lucide-react";
import React from "react";

interface CategorySummaryProps {
  total: number;
  category: string;
  Icon: React.ElementType;
}

const CategorySummary = ({ total, category, Icon }: CategorySummaryProps) => {
  return (
    <div className="border rounded-md flex items-center gap-4 shadow-sm">
      <div>
        <p className="text-sm font-light text-slate-200">{category}</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      {Icon && <Icon className="w-8 h-8 text-slate-400" />}
    </div>
  );
};

export default CategorySummary;
