import { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EntityFormProps<T extends z.ZodType> {
  form: UseFormReturn<z.infer<T>>;
  entityId?: number;
  entityType: string;
  onDelete?: () => void;
  onSubmit: (values: z.infer<T>) => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
  children: ReactNode;
  connectionSection?: ReactNode;
}

export function EntityFormField({
  control,
  name,
  label,
  placeholder,
  onChange,
  children,
}: {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-cols-4 gap-4 items-center">
          <FormLabel className="col-span-1">{label}</FormLabel>
          <div
            className="col-span-3 space-y-2"
            data-testid={`${name}-input`}
          >
            <FormControl onChange={(e) => onChange?.(e.target.value)}>
              {children}
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export function EntityForm<T extends z.ZodType>({
  form,
  entityId,
  entityType,
  onDelete,
  onSubmit,
  onCancel,
  isSaveDisabled,
  children,
  connectionSection,
}: EntityFormProps<T>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      data-testid={`${entityType.toLowerCase()}-form-container`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent className="p-3">{children}</CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {entityId && onDelete && (
                  <>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      data-testid="delete-button"
                    >
                      Delete
                    </Button>
                    <AlertDialog
                      open={showDeleteDialog}
                      onOpenChange={setShowDeleteDialog}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete {entityType}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this{" "}
                            {entityType.toLowerCase()}? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              onDelete();
                              setShowDeleteDialog(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaveDisabled}
                  data-testid="save-button"
                >
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
      {connectionSection}
    </div>
  );
}
