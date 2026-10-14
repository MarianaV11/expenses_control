"use client";

import StyledButton from "@/components/external/Button";
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
import { CalendarIcon, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
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

        if (error?.status === 409) {
          showToast({ message: "Already has a user register with this e-mail.", type: "error" });
        } else {
          showToast({ message: data?.message ?? String(error), type: "error" });
        }
      };

      const body: UserCreate = {
        email: values.email,
        password: values.password,
        name: values.name,
        birthday: new Intl.DateTimeFormat("sv-SE").format(values.birthdate),
        is_restricted: false,
        is_admin: false,
      };

      return axios.post("auth/create", body).then(onSuccess).catch(onError);
    },
    [router],
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    className="pl-9"
                    placeholder="Your name"
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[100%] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    className="pl-9"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input
                    className="pl-9 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <StyledButton type="submit" disabled={form.formState.isSubmitting}>
            Register
          </StyledButton>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
