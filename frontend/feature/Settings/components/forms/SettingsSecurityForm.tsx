"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showToast } from "@/service/toast_service";
import { UserPasswordUpdate, UserRead } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { Eye, EyeClosed, Save } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const SettingsSecuritySchema = z.object({
  new_password: z.string().min(1, { message: "Field required!" }),
  old_password: z.string().min(1, { message: "Field required!" }),
});
type SettingsSecuritySchemaType = z.infer<typeof SettingsSecuritySchema>;

interface SettingsSecurityFormProps {
  setOpenForm: (open: boolean) => void;
}

const SettingsSecurityForm = ({ setOpenForm }: SettingsSecurityFormProps) => {
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const form = useForm<SettingsSecuritySchemaType>({
    resolver: zodResolver(SettingsSecuritySchema),
    defaultValues: {
      new_password: "",
      old_password: "",
    },
  });

  const onSubmit = useCallback((values: SettingsSecuritySchemaType) => {
    const onSuccess = (response: AxiosResponse<UserRead>) => {
      setOpenForm(false);
      showToast({ message: "Password updated successfully!", type: "success" });
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };
      showToast({ message: data?.message ?? String(error), type: "error" });
    };

    const body: UserPasswordUpdate = {
      id: Number(getUser()),
      old_password: values.old_password,
      new_password: values.new_password,
    };

    axios.patch("users/update_password", body).then(onSuccess).catch(onError);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel className="font-bold">Old Password</FormLabel>
              <FormDescription>Type your current password here</FormDescription>
              <FormControl>
                <div className="flex gap-2 items-center justify-center">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Your old password comes here"
                    {...field}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <Eye className="opacity-50" />
                    ) : (
                      <EyeClosed className="opacity-50" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex">
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="mb-5 flex-1">
                <FormLabel className="font-bold">New Password</FormLabel>
                <FormDescription>Type your new password here</FormDescription>
                <FormControl>
                  <div className="flex gap-2 items-center justify-center">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Your new password comes here"
                      {...field}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <Eye className="opacity-50" />
                      ) : (
                        <EyeClosed className="opacity-50" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row-reverse gap-2">
          <Button type="submit">Confirm</Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpenForm(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingsSecurityForm;
