import { z } from "zod";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { useLocations } from "@/hooks/useLocations";
import EntityForm from "@/components/EntityForm";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useURLContext } from "@/context/URLContext";
import { useMoments } from "@/hooks/useMoments";
import { CardHeader, CardTitle } from "@/components/ui/card";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { Card, CardContent } from "@/components/ui/card";

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
export type InitialFormValues = Omit<
  z.infer<typeof formSchema>,
  "start_date" | "id" | "added_by" | "created_at"
> & {
  start_date: Date | null;
};

function LocationFormPage() {
  const { selectedFamilyId, selectedLocationId } = useURLContext();
  const { familyData } = useFamilyDataContext();

  const foundLocation = selectedLocationId
    ? familyData?.locations.find(
        (location) => location.id === selectedLocationId
      )
    : null;

  const initialLocationFormValues: InitialFormValues = {
    name: foundLocation?.name || "",
    map_reference: foundLocation?.map_reference || "",
    start_date: foundLocation?.start_date || null,
    end_date: foundLocation?.end_date || null,
    family_id: selectedFamilyId!,
  };

  const { createLocation, updateLocation, deleteLocation } = useLocations();
  const { connectMoment, disconnectMoment } = useMoments();

  function onSubmit(values: InitialFormValues) {
    if (initialLocationFormValues) {
      updateLocation({
        ...values,
        start_date: values.start_date as Date, // zod will ensure not null
        end_date: values.end_date || undefined,
      });
    } else {
      createLocation({
        ...values,
        start_date: values.start_date as Date, // zod will ensure not null
        end_date: values.end_date || undefined,
      });
    }
  }

  return (
    <>
      <EntityForm<InitialFormValues>
        formSchema={formSchema}
        initialFormValues={initialLocationFormValues}
        onSubmit={onSubmit}
      />
      {selectedLocationId && (
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
                      m.locations?.some((l) => l.id === selectedLocationId)
                    ) || []
                  }
                  availableEntities={
                    familyData?.moments.filter(
                      (m) => !m.locations?.some((l) => l.id === selectedLocationId)
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
      {/* Insert connection form fields here */}
    </>
  );
}

// export type LocationFormValues = z.infer<typeof formSchema>;

// const LocationFormPage = () => {
//   const { locationId: locationIdParam } = useParams<{
//     locationId?: string;
//   }>();
//   const locationId = locationIdParam
//     ? parseInt(locationIdParam, 10)
//     : undefined;
//   const { createLocation, updateLocation, deleteLocation } = useLocations();
//   const { form, isSaveDisabled, handleFieldChange } = useEntityFormState(
//     formSchema,
//     {
//       name: initialData?.name || "",
//       map_reference: initialData?.map_reference || "",
//       start_date: initialData?.start_date || null,
//       end_date: initialData?.end_date || null,
//       family_id: familyId,
//     }
//   );

//   const {
//     entity: location,
//     handleDelete,
//     handleSubmit,
//     handleCancel,
//   } = useEntityFormPage<Location, LocationFormValues>({
//     entityId: locationId,
//     entityType: "location",
//     findEntity: (data, id) =>
//       data?.locations.find((l: Location) => l.id === id),
//     createEntity: createLocation,
//     updateEntity: updateLocation,
//     deleteEntity: deleteLocation,
//   });

//   return (
//     <div className="w-full h-full" id="page-container">
//       <EntityForm
//         form={form}
//         entityId={locationId}
//         entityType="Location"
//         onDelete={handleDelete}
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//         isSaveDisabled={isSaveDisabled}
//       >
//         <EntityFormField
//           control={form.control}
//           name="name"
//           label="Location Name"
//         >
//           <Input
//             data-testid="location-name-input"
//             placeholder="Location Name"
//             onChange={(e) => handleFieldChange("name", e.target.value)}
//           />
//         </EntityFormField>
//         <EntityFormField
//           control={form.control}
//           name="map_reference"
//           label="Map Reference"
//           placeholder="Map Reference"
//           onChange={(e: string) => handleFieldChange("map_reference", e)}
//         />
//         <EntityFormField
//           control={form.control}
//           name="start_date"
//           label="Start Date"
//         >
//           <DatePickerWithInput
//             date={form.watch("start_date")}
//             setDate={(value) => handleFieldChange("start_date", value)}
//             required={true}
//           />
//         </EntityFormField>
//         <EntityFormField
//           control={form.control}
//           name="end_date"
//           label="End Date"
//         />
//         <EntityFormField
//           control={form.control}
//           name="moment_connection"
//           label="Moment Connection"
//         />
//         <EntityFormField
//           control={form.control}
//           name="family_id"
//           label="Family ID"
//         />
//       </EntityForm>
//     </div>
//   );
// };

export default LocationFormPage;
