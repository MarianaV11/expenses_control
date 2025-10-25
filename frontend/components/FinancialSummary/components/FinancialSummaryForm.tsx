import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showErrorToast, showSuccessToast } from "@/service/toast_service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FinancialSchema = z.object({
  monthly_revenue: z.number().min(1, { message: "Invalid value!" }),
});

type FinancialSchemaType = z.infer<typeof FinancialSchema>;

interface FinancialSummaryFormProps {
  monthlyRevenue: number;
  getMonthlyStatus: () => Promise<void>;
}

const FinancialSummaryForm = ({
  monthlyRevenue,
  getMonthlyStatus,
}: FinancialSummaryFormProps) => {
  const form = useForm<FinancialSchemaType>({
    resolver: zodResolver(FinancialSchema),
    defaultValues: {
      monthly_revenue: monthlyRevenue,
    },
  });

  const onSubmit = useCallback((values: FinancialSchemaType) => {
    const onSuccess = (response: AxiosResponse) => {
      const data = response.data;
      showSuccessToast({ message: data?.message });

      getMonthlyStatus();
    };

    const onError = (error: AxiosError) => {
      showErrorToast({ message: error.message });
    };

    const user_id = getUser();

    axios
      .patch(
        `users/monthly_revenue?user_id=${user_id}&new_monthly_revenue=${values.monthly_revenue}`
      )
      .then(onSuccess)
      .catch(onError);
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="monthly_revenue"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CurrencyInput
                  prefix={"R$ "}
                  decimalsLimit={2}
                  className="rounded-sm border border-slate-300 dark:border-slate-600 bg-transparent px-3 py-1 
                              text-sm shadow-sm transition-colors file:border-0 file:text-sm 
                              placeholder:text-muted-foreground focus-visible:outline-none 
                              focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  decimalSeparator=","
                  groupSeparator="."
                  placeholder={"R$ 0,00"}
                  defaultValue={field.value && String(field.value)}
                  onValueChange={(value, name, values) =>
                    field.onChange(values?.float)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button className="w-20" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinancialSummaryForm;
