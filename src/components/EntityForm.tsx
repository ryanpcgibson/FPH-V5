import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import DatePickerWithInput from "./DatePickerWithInput";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useState, ReactNode } from "react";
import EntityFormField from "@/components/EntityFormField";

interface EntityFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  onDelete: () => Promise<void>;
  entityType: string;
  entityId?: number;
  children: ReactNode;
}

// EntityForm contains the common fields for pet, location forms etc. It also contains the buttons, and the delete dialog.
function EntityForm<T extends FieldValues>({
  entityType,
  entityId,
  form,
  onSubmit,
  onDelete,
  children,
}: EntityFormProps<T>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isDirty } = form.formState;
  // TODO: figure out if we still need this and why (maybe if no permissions?)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardContent className="p-3">
            <EntityFormField control={form.control} name="name" label="Name">
              {(field) => <Input {...field} data-testid="name-input" />}
            </EntityFormField>
            <EntityFormField
              control={form.control}
              name="start_date"
              label="Start Date"
            >
              {(field) => (
                <DatePickerWithInput
                  date={field.value}
                  setDate={(value) => field.onChange(value)}
                  required={true}
                  testId="start-date-input"
                />
              )}
            </EntityFormField>
            <EntityFormField
              control={form.control}
              name={"end_date" as Path<T>}
              label="End Date"
            >
              {(field) => (
                <DatePickerWithInput
                  date={field.value}
                  setDate={(value) => field.onChange(value)}
                  required={true}
                  testId="end-date-input"
                />
              )}
            </EntityFormField>
            {children}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {entityId && (
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
                        <AlertDialogTitle>Delete {entityType}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this{" "}
                          {entityType.toLowerCase()}? This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
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
                onClick={() => navigate(-1)}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaveDisabled || !isDirty}
                data-testid="save-button"
              >
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default EntityForm;
