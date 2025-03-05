import { ReactNode } from "react";
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
  testId?: string;
}

const EntityFormField = <T extends FieldValues>({
  control,
  name,
  label,
  children,
  testId,
}: EntityFormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field, fieldState }) => (
        <FormItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <FormLabel className="col-span-1 text-right">{label}</FormLabel>
          <div className="col-span-1 w-full max-w-[300px]">
            <FormControl
              className="text-left bg-background"
              data-testid={testId}
            >
              {children(field)}
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

export default EntityFormField;
