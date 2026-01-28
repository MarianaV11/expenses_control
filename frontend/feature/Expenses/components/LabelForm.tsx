import { Badge } from "@/components/ui/badge";
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
import { Label, LabelCreate, LabelUpdate } from "@/types/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import z from "zod";

const LabelSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name required!" })
    .max(20, { message: "The character limit is 30." }),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, {
    message: "Invalid HEX color! Use the format #RRGGBB.",
  }),
});
type LabelSchemaType = z.infer<typeof LabelSchema>;

interface LabelFormProps {
  getLabels: () => void;
  currentLabel: Label | null;
  closeDialog: () => void;
}

const LabelForm = ({
  getLabels,
  currentLabel,
  closeDialog,
}: LabelFormProps) => {
  const form = useForm<LabelSchemaType>({
    resolver: zodResolver(LabelSchema),
    defaultValues: {
      name: currentLabel?.name ?? "",
      color: currentLabel?.color ?? "#9b6dff",
    },
  });

  const currentColor = form.watch("color");
  const name = form.watch("name");

  const onSubmit = (values: LabelSchemaType) => {
    if (!currentLabel) {
      createNewLabel(values);
    } else {
      updateLabel(values);
    }
  };

  const createNewLabel = useCallback((values: LabelSchemaType) => {
    const onSuccess = (response: AxiosResponse<Label>) => {
      getLabels();

      showToast({ message: "Label created with success!", type: "success" });
      closeDialog();
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };

      showToast({ message: data?.message ?? String(error), type: "error" });
      closeDialog();
    };

    const body: LabelCreate = {
      user_id: Number(getUser()),
      name: values.name,
      color: values.color,
    };

    axios.post("labels/create", body).then(onSuccess).catch(onError);
  }, []);

  const updateLabel = useCallback((values: LabelSchemaType) => {
    const onSuccess = (response: AxiosResponse<Label>) => {
      getLabels();

      showToast({ message: "Label updated with success!", type: "success" });
      closeDialog();
    };

    const onError = (error: AxiosError) => {
      const data = error.response?.data as { message?: string };

      showToast({ message: data?.message ?? String(error), type: "error" });
      closeDialog();
    };

    const body: LabelUpdate = {
      id: Number(currentLabel?.id),
      name: values.name,
      color: values.color,
    };

    axios.put("labels/update_label", body).then(onSuccess).catch(onError);
  }, []);

  useEffect(() => {
    const applyColumnInformation: LabelSchemaType = {
      name: currentLabel?.name ?? "",
      color: currentLabel?.color ?? "#9b6dff",
    };

    form.reset(applyColumnInformation);
  }, []);

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
              <FormLabel className="font-bold">
                <span className="text-red-500">*</span>Name
              </FormLabel>
              <FormDescription>Enter the name of your label.</FormDescription>
              <FormControl>
                <Input maxLength={20} placeholder="Name of label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">
                <span className="text-red-500">*</span>Color
              </FormLabel>
              <FormDescription>Choose your label’s color.</FormDescription>
              <FormControl>
                <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                      className="w-full h-full"
                    />
                    <Input className="w-full mt-2" {...field} />
                  </div>
                  <div className="flex flex-col h-full items-center justify-between border rounded-sm p-2 w-full">
                    <h2 className="text-center">Example of Label </h2>
                    <div className="flex-1 flex items-center justify-center">
                      <Badge
                        variant="outline"
                        style={{ backgroundColor: currentColor }}
                        className="text-white border max-md:mt-6 max-md:mb-6 dark:hover:opacity-60 animate-bounce scale-105"
                      >
                        <p>{!name ? "No label" : name}</p>
                      </Badge>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button type="submit">{currentLabel ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default LabelForm;
