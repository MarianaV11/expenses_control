"use client";

import Button from "@/components/external/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosLogin } from "@/service/axios_config";
import { removeToken, setToken } from "@/service/local_storage";
import { showErrorToast } from "@/service/toast_service";
import { AuthRequest, AuthResponse } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AuthSchema = z.object({
  email: z.email("Invalid email!"),
  password: z.string().min(1, { message: "Password required!" }),
});
type AuthSchemaType = z.infer<typeof AuthSchema>;

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<AuthSchemaType>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    removeToken();
  }, []);

  const onSubmit = useCallback(
    (values: AuthSchemaType) => {
      const onSuccess = (response: AxiosResponse<AuthResponse>) => {
        const data = response.data;
        setToken(data.auth.access_token, data.id.toString());

        router.push("/expense");
      };

      const onError = (error: AxiosError) => {
        showErrorToast({ message: String(error) });
      };

      const body: AuthRequest = {
        email: values.email,
        password: values.password,
      };

      axiosLogin.post("users/login", body).then(onSuccess).catch(onError);
    },
    [router]
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
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
              <FormLabel className="font-bold">Password</FormLabel>
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
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
