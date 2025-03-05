import React, { ReactNode } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface EntityFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  label: string;
  children: (field: any) => ReactNode;
}

const EntityFormField = <T extends FieldValues>({
  control,
  name,
  label,
  children,
}: EntityFormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default EntityFormField;
