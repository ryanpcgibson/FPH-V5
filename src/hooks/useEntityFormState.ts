// DELETE?


import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

interface EntityFormState<T> {
  form: UseFormReturn<T>;
  isDirty: boolean;
  hasErrors: boolean;
  isSaveDisabled: boolean;
  handleFieldChange: (field: keyof T, value: any) => void;
}

export function useEntityFormState<T>(
  formSchema: ZodType<T>,
  defaultValues: T
): EntityFormState<T> {
  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formState = form.formState;
  const isDirty = Object.keys(formState.dirtyFields).length > 0;
  const hasErrors = Object.keys(formState.errors).length > 0;
  const isSaveDisabled = !isDirty || hasErrors;

  const handleFieldChange = (field: keyof T, value: any) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return {
    form,
    isDirty,
    hasErrors,
    isSaveDisabled,
    handleFieldChange,
  };
}
