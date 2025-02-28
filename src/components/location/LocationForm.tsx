import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "react-day-picker/dist/style.css";
import { Location } from "@/db/db_types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useMoments } from "@/hooks/useMoments";
import DatePickerWithInput from "../DatePickerWithInput";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
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

const formSchema = z.object({
  name: z.string().min(2, VALIDATION_MESSAGES.LOCATION.NAME_MIN_LENGTH),
  map_reference: z.string().optional(),
  start_date: z
    .date({
      required_error: VALIDATION_MESSAGES.LOCATION.START_DATE_REQUIRED,
      invalid_type_error: VALIDATION_MESSAGES.LOCATION.INVALID_DATE,
    })
    .nullable()
    .refine((date) => date !== null, {
      message: VALIDATION_MESSAGES.LOCATION.START_DATE_REQUIRED,
    }),
  end_date: z
    .date({
      invalid_type_error: VALIDATION_MESSAGES.LOCATION.INVALID_DATE,
    })
    .nullable(),
  moment_connection: z.string().optional(),
  family_id: z.number({
    required_error: "Family ID is required",
  }),
});

interface LocationFormValues {
  name: string;
  map_reference?: string;
  start_date: Date | null;
  end_date: Date | null;
}

interface LocationFormProps {
  locationId?: number;
  familyId: number;
  initialData?: Location;
  onFamilyChange: (familyId: number) => void;
  onDelete?: () => void;
  onSubmit: (values: LocationFormValues) => void;
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  locationId,
  familyId,
  initialData,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      map_reference: initialData?.map_reference || "",
      start_date: initialData?.start_date || null,
      end_date: initialData?.end_date || null,
      family_id: familyId,
    },
  });

  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

  const formState = form.formState;
  const isDirty = Object.keys(formState.dirtyFields).length > 0;
  const hasErrors = Object.keys(formState.errors).length > 0;
  const isSaveDisabled = !isDirty || hasErrors;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleFieldChange = (
    field: keyof z.infer<typeof formSchema>,
    value: any
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (
      (field === "start_date" || field === "end_date") &&
      value === undefined
    ) {
      form.trigger(field);
    }
  };

  useEffect(() => {
    if (locationId === null) {
      form.setValue("name", "");
      form.setValue("map_reference", "");
      form.setValue("start_date", null);
      form.setValue("end_date", null);
    } else {
      form.setValue("name", initialData?.name || "");
      form.setValue("map_reference", initialData?.map_reference || "");
      form.setValue("start_date", initialData?.start_date || null);
      form.setValue("end_date", initialData?.end_date || null);
    }
  }, [locationId, familyId, initialData, form]);

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      data-testid="location-form-container"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent className="p-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 gap-4 items-center">
                    <FormLabel className="col-span-1">Location Name</FormLabel>
                    <div className="col-span-3 space-y-2">
                      <FormControl>
                        <Input
                          data-testid="location-name-input"
                          placeholder="Location Name"
                          {...field}
                          onChange={(e) =>
                            handleFieldChange("name", e.target.value)
                          }
                          className="w-full bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 gap-4 items-center">
                    <FormLabel className="col-span-1">Start Date</FormLabel>
                    <div className="col-span-3 space-y-2">
                      <FormControl>
                        <DatePickerWithInput
                          data-testid="start-date-input"
                          date={field.value}
                          setDate={(value) =>
                            handleFieldChange("start_date", value)
                          }
                          required={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 gap-4 items-center">
                    <FormLabel className="col-span-1">End Date</FormLabel>
                    <div className="col-span-3 space-y-2">
                      <FormControl>
                        <DatePickerWithInput
                          data-testid="end-date-input"
                          date={field.value}
                          setDate={(value) =>
                            handleFieldChange("end_date", value)
                          }
                          required={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="map_reference"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 gap-4 items-center">
                    <FormLabel className="col-span-1">Map Reference</FormLabel>
                    <div className="col-span-3 space-y-2">
                      <FormControl>
                        <Input
                          data-testid="map-reference-input"
                          placeholder="Map Reference (optional)"
                          {...field}
                          onChange={(e) =>
                            handleFieldChange("map_reference", e.target.value)
                          }
                          className="w-full bg-background"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between">
              <div>
                {locationId && (
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
                          <AlertDialogTitle>Delete Location</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this location? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              onDelete?.();
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

      {locationId && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Moments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Changes to connections are saved immediately
              </div>
              <EntityConnectionManager
                entityType="moment"
                connectedEntities={
                  familyData?.moments?.filter((m) =>
                    m.locations?.some((l) => l.id === locationId)
                  ) || []
                }
                availableEntities={
                  familyData?.moments.filter(
                    (m) => !m.locations?.some((l) => l.id === locationId)
                  ) || []
                }
                onConnect={(momentId) =>
                  connectMoment(momentId, locationId!, "location")
                }
                onDisconnect={(momentId) =>
                  disconnectMoment(momentId, locationId!, "location")
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationForm;
