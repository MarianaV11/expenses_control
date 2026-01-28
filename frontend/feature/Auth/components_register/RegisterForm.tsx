"use client";

import StyledRegisterButton from "@/components/external/Button";
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
import { removeToken, setToken } from "@/service/local_storage";
import { showToast } from "@/service/toast_service";
import { AuthResponse } from "@/types/auth";
import { UserCreate } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name required!" }),
  birthdate: z.date({ message: "Birthdate required!" }),
  email: z.email("Email required!"),
  password: z.string().min(1, { message: "Password required!" }),
});
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      birthdate: new Date(),
    },
  });

  useEffect(() => {
    removeToken();
  }, []);

  const onSubmit = useCallback(
    (values: RegisterSchemaType) => {
      const onSuccess = (response: AxiosResponse<AuthResponse>) => {
        const data = response.data;
        setToken(data.auth.access_token, data.id.toString());

        router.push("/expense");
      };

      const onError = (error: AxiosError) => {
        const data = error.response?.data as { message?: string };

        showToast({ message: data?.message ?? String(error), type: "error" });
      };

      const body: UserCreate = {
        email: values.email,
        password: values.password,
        name: values.name,
        birthday: new Intl.DateTimeFormat("sv-SE").format(values.birthdate),
        is_restricted: false,
        is_admin: false,
      };

      axios.post("auth/create", body).then(onSuccess).catch(onError);
    },
    [router],
  );

  return (
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
              <FormLabel className=" font-bold">Date of Birth</FormLabel>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel className="font-bold ">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your password comes here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StyledRegisterButton type="submit">Register</StyledRegisterButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
