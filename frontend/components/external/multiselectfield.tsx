"use client";

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { LucideIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  allowNewOptions?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: string[];
  options?: { value: string; label: string; icon?: LucideIcon }[];
  required?: boolean;
}

export default function MultiSelectField<T extends FieldValues>({
  label,
  control,
  name,
  allowNewOptions,
  placeholder,
  description,
  defaultValue,
  options,
  required = false,
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            <span className="font-bold">{label}</span>
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <MultiSelect
            options={options ?? []}
            onValueChange={field.onChange}
            defaultValue={field.value}
            placeholder={placeholder}
            variant="default"
            maxCount={2}
            animation={3}
            asChild={true}
            modalPopover={true}
          />
          <FormDescription> {description} </FormDescription>
          <span className="text-red-500">
            {Array.isArray(error) && error[0].message}
          </span>
        </FormItem>
      )}
    />
  );
}
