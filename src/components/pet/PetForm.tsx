// import React from "react";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useFamilyDataContext } from "@/context/FamilyDataContext";
// import { useMoments } from "@/hooks/useMoments";
// import DatePickerWithInput from "@/components/DatePickerWithInput";
// import EntityConnectionManager from "@/components/EntityConnectionManager";
// import { EntityForm } from "@/components/EntityForm";
// import { EntityFormField } from "@/components/EntityFormField";
// import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
// import { Pet } from "@/db/db_types";
// import { useEntityFormState } from "@/hooks/useEntityFormState";

// const formSchema = z.object({
//   name: z.string().min(2, VALIDATION_MESSAGES.PET.NAME_MIN_LENGTH),
//   start_date: z
//     .date({
//       required_error: VALIDATION_MESSAGES.PET.START_DATE_REQUIRED,
//       invalid_type_error: VALIDATION_MESSAGES.PET.INVALID_DATE,
//     })
//     .nullable()
//     .refine((date) => date !== null, {
//       message: VALIDATION_MESSAGES.PET.START_DATE_REQUIRED,
//     }),
//   end_date: z
//     .date({
//       invalid_type_error: VALIDATION_MESSAGES.PET.INVALID_DATE,
//     })
//     .nullable()
//     .refine(
//       (date) => {
//         console.log("end_date date:", date);
//         if (!date) return true; // Allow null/undefined
//         return date instanceof Date && !isNaN(date.getTime());
//       },
//       {
//         message: VALIDATION_MESSAGES.PET.INVALID_DATE,
//       }
//     ),
//   description: z.string().optional(),
//   moment_connection: z.string().optional(),
//   family_id: z.number({
//     required_error: "Family ID is required",
//   }),
// });

// export type PetFormValues = z.infer<typeof formSchema>;

// interface PetFormProps {
//   petId?: number;
//   familyId: number;
//   initialData?: Pet;
//   onFamilyChange: (familyId: number) => void;
//   onDelete?: () => void;
//   onSubmit: (values: PetFormValues) => void;
//   onUpdate?: (values: PetFormValues) => void;
//   onCancel: () => void;
// }

// const PetForm: React.FC<PetFormProps> = ({
//   petId,
//   familyId,
//   initialData,
//   onDelete,
//   onSubmit,
//   onCancel,
// }) => {
//   const { form, isSaveDisabled, handleFieldChange } = useEntityFormState(
//     formSchema,
//     {
//       name: initialData?.name || "",
//       start_date: initialData?.start_date || null,
//       end_date: initialData?.end_date || null,
//       description: initialData?.description || undefined,
//       family_id: familyId,
//     }
//   );

//   const { familyData } = useFamilyDataContext();
//   const { connectMoment, disconnectMoment } = useMoments();

//   const ConnectionSection = () => {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Connected Moments</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-2">
//             <div className="text-sm text-muted-foreground">
//               Changes to connections are saved immediately
//             </div>
//             <EntityConnectionManager
//               entityType="moment"
//               connectedEntities={
//                 familyData?.moments?.filter((m) =>
//                   m.pets?.some((p) => p.id === petId)
//                 ) || []
//               }
//               availableEntities={
//                 familyData?.moments.filter(
//                   (m) => !m.pets?.some((p) => p.id === petId)
//                 ) || []
//               }
//               onConnect={(momentId) => connectMoment(momentId, petId!, "pet")}
//               onDisconnect={(momentId) =>
//                 disconnectMoment(momentId, petId!, "pet")
//               }
//             />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };
  
//   return (
//     <EntityForm
//       form={form}
//       entityId={petId}
//       entityType="Pet"
//       onDelete={onDelete}
//       onSubmit={onSubmit}
//       onCancel={onCancel}
//       isSaveDisabled={isSaveDisabled}
//       connectionSection={petId && <ConnectionSection />}
//     >
//       <EntityFormField control={form.control} name="name" label="Pet Name">
//         <Input
//           data-testid="pet-name-input"
//           placeholder="Pet Name"
//           onChange={(e) => handleFieldChange("name", e.target.value)}
//         />
//       </EntityFormField>
//       <EntityFormField
//         control={form.control}
//         name="start_date"
//         label="Start Date"
//       >
//         <DatePickerWithInput
//           data-testid="start-date-input"
//           date={form.watch("start_date")}
//           setDate={(value) => handleFieldChange("start_date", value)}
//           required={true}
//         />
//       </EntityFormField>
//       <EntityFormField control={form.control} name="end_date" label="End Date">
//         <DatePickerWithInput
//           data-testid="end-date-input"
//           date={form.watch("end_date")}
//           setDate={(value) => handleFieldChange("end_date", value)}
//           required={false}
//         />
//       </EntityFormField>
//       <EntityFormField
//         control={form.control}
//         name="description"
//         label="Description"
//       >
//         <Input
//           data-testid="pet-description-input"
//           placeholder="Pet description (optional)"
//           onChange={(e) => handleFieldChange("description", e.target.value)}
//         />
//       </EntityFormField>
//     </EntityForm>
//   );
// };

// export default PetForm;
