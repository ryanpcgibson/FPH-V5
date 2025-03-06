import { useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { useLocations } from "@/hooks/useLocations";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useURLContext } from "@/context/URLContext";

import EntityForm from "@/components/EntityForm";
import EntityFormField from "@/components/EntityFormField";
import { Input } from "@/components/ui/input";
import ConnectedMoments from "@/components/ConnectedMoments";

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

// Since start_date is both nullable on load, but required on save, we need to create a new type for the initial form values
export type InitialLocationFormValues = Omit<
  z.infer<typeof formSchema>,
  "start_date"
> & {
  start_date: Date | null;
};

function LocationFormPage() {
  const { selectedFamilyId, selectedLocationId } = useURLContext();
  const { familyData, isLoading } = useFamilyDataContext();

  const { createLocation, updateLocation, deleteLocation } = useLocations();
  const navigate = useNavigate();

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
      console.log("foundLocation:", foundLocation);
      form.reset({
        name: foundLocation?.name || "",
        map_reference: foundLocation?.map_reference || "",
        start_date: foundLocation?.start_date || null,
        end_date: foundLocation?.end_date || null,
        family_id: selectedFamilyId!,
      });
    }
  }, [isLoading, familyData, selectedLocationId, selectedFamilyId, form]);

  // While similar, each formPage will have to manage it's own handleSubmit and handleDelete since TypeScript get's unwieldy with different types for blank form, database insert and update.
  const handleSubmit = async (values: InitialLocationFormValues) => {
    try {
      if (selectedLocationId) {
        await updateLocation({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
          family_id: selectedFamilyId!,
          id: selectedLocationId,
        });
      } else {
        await createLocation({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
        });
      }
    } catch (error) {
      console.error(`Error saving Location:`, error);
    }
    navigate(-1);
  };

  const handleDelete = async () => {
    await deleteLocation(selectedLocationId!);
    navigate(-1);
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
          onSubmit={handleSubmit}
          onDelete={handleDelete}
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
          <ConnectedMoments
            entityId={selectedLocationId}
            entityType="location"
          />
        )}
      </div>
    </div>
  );
}

export default LocationFormPage;
