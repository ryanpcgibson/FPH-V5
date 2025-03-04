import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  Path,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DatePickerWithInput from "./DatePickerWithInput";

interface EntityFormProps<T extends FieldValues> {
  formSchema: z.ZodSchema<T>;
  initialFormValues: DefaultValues<T>;
  onSubmit: (values: T) => void;
}

function EntityForm<T extends FieldValues>({
  formSchema,
  initialFormValues,
  onSubmit,
}: EntityFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"name" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"start_date" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePickerWithInput
                  date={field.value}
                  setDate={(value) => field.onChange(value)}
                  required={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"end_date" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePickerWithInput
                  date={field.value}
                  setDate={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
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

export default EntityForm;
