import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

const FinancialSummary = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Receita Mensal</p>
            <h3 className="text-2xl font-bold text-foreground">
              {formatCurrency(5000)}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-gradient-primary">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Gastos do Mês</p>
            <h3 className="text-2xl font-bold text-foreground">
              {formatCurrency(2000)}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-gradient-danger">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Saldo Restante</p>
            <h3
              className={`text-2xl font-bold ${
                300 >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatCurrency(300)}
            </h3>
          </div>
          <div
            className={`p-3 rounded-full ${
              300 >= 0 ? "bg-gradient-success" : "bg-gradient-danger"
            }`}
          >
            <TrendingUp className="text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSummary;
