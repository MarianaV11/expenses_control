"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showToast } from "@/service/toast_service";
import { UserPersonalInfoUpdate, UserRead } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SettingsProfileInfoSchema = z.object({
  name: z.string().min(1, { message: "Name required!" }),
  email: z.email("Email required!"),
  birthdate: z.date({ message: "Birthdate required!" }),
});
type SettingsProfileInfoSchemaType = z.infer<typeof SettingsProfileInfoSchema>;

interface SettingsProfileInfoFormProps {
  name: string;
  email: string;
  birthdate: Date;
  getUserData: () => void;
}

const SettingsProfileInfoForm = ({
  name,
  email,
  birthdate,
  getUserData,
}: SettingsProfileInfoFormProps) => {
  const form = useForm<SettingsProfileInfoSchemaType>({
    resolver: zodResolver(SettingsProfileInfoSchema),
    defaultValues: {
      name: name,
      email: email,
      birthdate: birthdate,
    },
  });

  const onSubmit = useCallback((values: SettingsProfileInfoSchemaType) => {
    const onSuccess = (response: AxiosResponse<UserRead>) => {
      getUserData();
      showToast({
        message: "Information updated with success!",
        type: "success",
      });
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };
      showToast({
        message: data?.message ?? String(error),
        type: "error",
      });
    };

    const body: UserPersonalInfoUpdate = {
      id: Number(getUser()),
      name: values.name,
      email: values.email,
      birthday: new Intl.DateTimeFormat("sv-SE").format(values.birthdate),
    };

    axios.patch("users/user_info", body).then(onSuccess).catch(onError);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name comes here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className=" font-bold">Birthdate</FormLabel>
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold ">Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email comes here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>
          <Save />
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default SettingsProfileInfoForm;
