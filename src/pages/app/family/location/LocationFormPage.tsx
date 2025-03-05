import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { useLocations } from "@/hooks/useLocations";
import EntityForm from "@/components/EntityForm";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import EntityFormField from "@/components/EntityFormField";
import { useURLContext } from "@/context/URLContext";
import { useMoments } from "@/hooks/useMoments";
import { CardHeader, CardTitle } from "@/components/ui/card";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { InitialFormValues } from "@/components/EntityForm";
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
type InitialLocationFormValues = InitialFormValues<z.infer<typeof formSchema>>;

function LocationFormPage() {
  const { selectedFamilyId, selectedLocationId } = useURLContext();
  const { familyData, isLoading } = useFamilyDataContext();
  const navigate = useNavigate();

  const { createLocation, updateLocation, deleteLocation } = useLocations();
  const { connectMoment, disconnectMoment } = useMoments();

  const form = useForm<InitialLocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      map_reference: "",
      start_date: null,
      end_date: null,
      family_id: selectedFamilyId!,
    },
  });

  useEffect(() => {
    if (!isLoading && familyData) {
      const foundLocation = selectedLocationId
        ? familyData.locations.find(
            (location) => location.id === selectedLocationId
          )
        : null;
      console.log("foundLocation", foundLocation);

      form.reset({
        name: foundLocation?.name || "",
        map_reference: foundLocation?.map_reference || "",
        start_date: foundLocation?.start_date || null,
        end_date: foundLocation?.end_date || null,
        family_id: selectedFamilyId!,
      });
    }
  }, [isLoading, familyData, selectedLocationId, selectedFamilyId, form]);

  async function onSubmit(values: InitialLocationFormValues) {
    try {
      if (selectedLocationId) {
        await updateLocation({
          ...values,
          start_date: values.start_date as Date, // zod will ensure not null
          end_date: values.end_date || undefined,
          family_id: selectedFamilyId!,
          id: selectedLocationId,
        });
      } else {
        await createLocation({
          ...values,
          start_date: values.start_date as Date, // zod will ensure not null
          end_date: values.end_date || undefined,
        });
      }
      navigate(-1); // Navigate back to the previous page after success
    } catch (error) {
      console.error("Error saving location:", error);
    }
  }

  const onDelete = () => {
    if (selectedLocationId) {
      deleteLocation(selectedLocationId);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full flex flex-col md:flex-row gap-4 items-start justify-center pt-4"
        data-testid={"location-form-container"}
      >
        <EntityForm<InitialLocationFormValues>
          form={form}
          entityType="Location"
          entityId={selectedLocationId}
          onSubmit={onSubmit}
          onDelete={onDelete}
        >
          <EntityFormField
            control={form.control}
            name="map_reference"
            label="Map Reference"
            testId="map-reference-input"
          >
            {(field) => <Input {...field} />}
          </EntityFormField>
        </EntityForm>
        {selectedLocationId && (
          <Card className="w-full max-w-2xl">
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
                      m.locations?.some((l) => l.id === selectedLocationId)
                    ) || []
                  }
                  availableEntities={
                    familyData?.moments.filter(
                      (m) =>
                        !m.locations?.some((l) => l.id === selectedLocationId)
                    ) || []
                  }
                  onConnect={(momentId) =>
                    connectMoment(momentId, selectedLocationId!, "location")
                  }
                  onDisconnect={(momentId) =>
                    disconnectMoment(momentId, selectedLocationId!, "location")
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LocationFormPage;
