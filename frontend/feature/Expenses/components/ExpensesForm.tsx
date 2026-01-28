import CommonDialog from "@/components/external/CommonDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showErrorToast, showSuccessToast } from "@/service/toast_service";
import { Expense, ExpenseCreate, ExpenseUpdate } from "@/types/expenses";
import { Label, LabelIdentifier } from "@/types/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import { CalendarIcon, MoreHorizontal, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import z from "zod";
import LabelForm from "./LabelForm";

const ExpensesSchema = z.object({
  name: z.string().min(1, { message: "Name required!" }),
  value: z.number().min(1, { message: "Invalid value!" }),
  day: z.date(),
  card: z.string().min(1, { message: "Select an option above!" }),
  payment_type: z.string().min(1, { message: "Select an option above!" }),
  label_id: z.string().nullable(),
});
type ExpensesSchemaType = z.infer<typeof ExpensesSchema>;

interface ExpensesFormProps {
  getExpenses: () => void;
  currentExpense: Expense | null;
  closeDialog: () => void;
}

const ExpensesForm = ({
  getExpenses,
  currentExpense,
  closeDialog,
}: ExpensesFormProps) => {
  const form = useForm<ExpensesSchemaType>({
    resolver: zodResolver(ExpensesSchema),
    defaultValues: {
      name: currentExpense?.name ?? "",
      value: currentExpense?.value ?? 0,
      day: currentExpense?.day
        ? new Date(currentExpense.day + "T00:00:00")
        : new Date(),
      card: currentExpense?.card ?? "",
      payment_type: currentExpense?.payment_type ?? "",
      label_id: String(currentExpense?.label_id) ?? null,
    },
  });
  const [options, setOptions] = useState<Label[]>([]);
  const [openLabelDialog, setOpenLabelDialog] = useState<boolean>(false);
  const [labelData, setLabelData] = useState<Label | null>(null);

  const onSubmit = (values: ExpensesSchemaType) => {
    if (!currentExpense) {
      createNewExpense(values);
    } else {
      updateExpense(values);
    }
  };

  const createNewExpense = useCallback((values: ExpensesSchemaType) => {
    const onSuccess = (response: AxiosResponse<Expense>) => {
      getExpenses();

      showSuccessToast({ message: "Expense created with success!" });
      closeDialog();
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };

      showErrorToast({ message: data?.message ?? `${error}` });
      closeDialog();
    };

    const body: ExpenseCreate = {
      user_id: Number(getUser()) ?? 0,
      name: values.name,
      value: values.value,
      card: values.card,
      day: new Intl.DateTimeFormat("sv-SE").format(values.day),
      label_id: values.label_id ? Number(values.label_id) : null,
      payment_type: values.payment_type,
    };

    axios.post("expenses/create", body).then(onSuccess).catch(onError);
  }, []);

  const updateExpense = useCallback((values: ExpensesSchemaType) => {
    const onSuccess = (response: AxiosResponse<Expense>) => {
      getExpenses();

      showSuccessToast({ message: "Expense updated with success!" });
      closeDialog();
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };

      showErrorToast({ message: data?.message ?? `${error}` });
      closeDialog();
    };

    const body: ExpenseUpdate = {
      id: currentExpense?.id ?? 0,
      user_id: Number(getUser()) ?? 0,
      name: values.name,
      value: values.value,
      card: values.card,
      day: new Intl.DateTimeFormat("sv-SE").format(values.day),
      label_id: values.label_id ? Number(values.label_id) : null,
      payment_type: values.payment_type,
    };

    axios.put("expenses/update_expense", body).then(onSuccess).catch(onError);
  }, []);

  const getLabels = async () => {
    try {
      const response: AxiosResponse = await axios.get("/labels/user_labels", {
        params: {
          user_id: getUser(),
          page: 1,
          per_page: 50,
        },
      });

      setOptions(response.data.labels);
    } catch (error) {
      showErrorToast({ message: `${error}` });
    }
  };

  const onCloseLabelDialog = () => {
    setOpenLabelDialog((current) => !current);
  };

  const deleteLabel = (id: number) => {
    const body: LabelIdentifier = {
      id: id,
    };

    axios
      .delete("/labels/delete_label", {
        data: body,
      })
      .then((response: AxiosResponse) => {
        showSuccessToast({ message: response.data.message });

        getLabels();
      })
      .catch((error: AxiosError) => showErrorToast({ message: error.message }));
  };

  useEffect(() => {
    getLabels();
    const apllyColumnInformation: ExpensesSchemaType = {
      name: currentExpense?.name ?? "",
      card: currentExpense?.card ?? "",
      day: currentExpense?.day
        ? new Date(currentExpense.day + "T00:00:00")
        : new Date(),
      label_id: String(currentExpense?.label_id) ?? null,
      payment_type: currentExpense?.payment_type ?? "",
      value: currentExpense?.value ?? 0,
    };

    form.reset(apllyColumnInformation);
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  <span className="text-red-500">*</span>Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Name of expense." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  <span className="text-red-500">*</span>Value
                </FormLabel>
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
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className=" font-bold">
                  <span className="text-red-500">*</span>Day
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="bg-slate-background">
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">
                    <span className="text-red-500">*</span>Payment Bank
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full justify-between">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Bank</SelectLabel>
                          <SelectItem value="Other" className="opacity-70">
                            Other
                          </SelectItem>
                          <SelectItem value="Itaú">Itaú</SelectItem>
                          <SelectItem value="Banco do Brasil">
                            Banco do Brasil
                          </SelectItem>
                          <SelectItem value="Bradesco">Bradesco</SelectItem>
                          <SelectItem value="Santander">Santander</SelectItem>
                          <SelectItem value="Nubank">Nubank</SelectItem>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="C6 Bank">C6 Bank</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">
                    <span className="text-red-500">*</span>Payment Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full justify-between">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                          <SelectItem value="In cash">In cash</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="label_id"
            render={({ field }) => {
              const selectedLabel = options?.find(
                (option: Label) => String(option.id) === String(field.value),
              );
              return (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">Label</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <SelectTrigger
                        className="w-full justify-between"
                        badge
                        badgeColor={selectedLabel?.color || ""}
                      >
                        {selectedLabel?.name ? selectedLabel.name : "No label"}
                      </SelectTrigger>
                      <SelectContent>
                        <div className="justify-end flex">
                          <Button
                            size="icon"
                            className="mb-2 mt-1"
                            variant="default"
                            onClick={() => {
                              setLabelData(null);
                              setOpenLabelDialog(true);
                            }}
                          >
                            <Plus />
                          </Button>
                        </div>
                        <Separator />
                        <SelectGroup>
                          <SelectLabel>Labels </SelectLabel>
                          <SelectItem value="none" className="opacity-70">
                            No label
                          </SelectItem>

                          {options?.map((option: Label) => (
                            <div className="flex" key={option.id}>
                              <SelectItem value={String(option.id)}>
                                <Badge
                                  variant="outline"
                                  style={{ backgroundColor: option.color }}
                                  className="border dark:hover:opacity-60 scale-105"
                                >
                                  <p>{option.name}</p>
                                </Badge>
                              </SelectItem>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setLabelData(option);
                                      setOpenLabelDialog(true);
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() => deleteLabel(option.id)}
                                    className="font-bold text-red-700"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {currentExpense ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>

      <CommonDialog
        title="Label"
        open={openLabelDialog}
        description={
          !labelData
            ? "Create a new label by defining its name and choosing a color."
            : "Update your current label."
        }
        setOpen={setOpenLabelDialog}
        content={
          <LabelForm
            closeDialog={onCloseLabelDialog}
            currentLabel={labelData}
            getLabels={getLabels}
          />
        }
      />
    </>
  );
};

export default ExpensesForm;
