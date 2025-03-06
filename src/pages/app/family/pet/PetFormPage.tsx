import { useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { usePets } from "@/hooks/usePets";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useURLContext } from "@/context/URLContext";

import EntityForm from "@/components/EntityForm";
import EntityFormField from "@/components/EntityFormField";
import { Input } from "@/components/ui/input";
import ConnectedMoments from "@/components/ConnectedMoments";

const formSchema = z.object({
  name: z.string().min(2, VALIDATION_MESSAGES.PET.NAME_MIN_LENGTH),
  start_date: z
    .date({
      required_error: VALIDATION_MESSAGES.PET.START_DATE_REQUIRED,
      invalid_type_error: VALIDATION_MESSAGES.PET.INVALID_DATE,
    })
    .nullable()
    .refine((date) => date !== null, {
      message: VALIDATION_MESSAGES.PET.START_DATE_REQUIRED,
    }),
  end_date: z
    .date({
      invalid_type_error: VALIDATION_MESSAGES.PET.INVALID_DATE,
    })
    .nullable()
    .refine(
      (date) => {
        console.log("end_date date:", date);
        if (!date) return true; // Allow null/undefined
        return date instanceof Date && !isNaN(date.getTime());
      },
      {
        message: VALIDATION_MESSAGES.PET.INVALID_DATE,
      }
    ),
  description: z.string().optional(),
  moment_connection: z.string().optional(),
  family_id: z.number({
    required_error: "Family ID is required",
  }),
});

// Since start_date is both nullable on load, but required on save, we need to create a new type for the initial form values
export type InitialPetFormValues = Omit<
  z.infer<typeof formSchema>,
  "start_date"
> & {
  start_date: Date | null;
};

const PetFormPage = () => {
  const { selectedFamilyId, selectedPetId } = useURLContext();
  const { familyData, isLoading } = useFamilyDataContext();

  const { createPet, updatePet, deletePet } = usePets();
  const navigate = useNavigate();

  const form = useForm<InitialPetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      start_date: null,
      end_date: null,
      family_id: selectedFamilyId!,
    },
  });

  useEffect(() => {
    if (!isLoading && familyData) {
      const foundPet = selectedPetId
        ? familyData.pets.find((p) => p.id === selectedPetId)
        : null;
      console.log("foundPet:", selectedPetId, foundPet, familyData);

      form.reset({
        name: foundPet?.name || "",
        start_date: foundPet?.start_date || null,
        end_date: foundPet?.end_date || null,
        family_id: selectedFamilyId!,
      });
    }
  }, [isLoading, familyData, selectedPetId, selectedFamilyId, form]);

  const handleSubmit = async (values: InitialPetFormValues) => {
    try {
      if (selectedPetId) {
        await updatePet({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
          family_id: selectedFamilyId!,
          id: selectedPetId,
        });
      } else {
        await createPet({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
        });
      }
    } catch (error) {
      console.error(`Error saving Pet:`, error);
    }
    navigate(-1);
  };

  const handleDelete = async () => {
    await deletePet(selectedPetId!);
    navigate(-1);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full flex flex-col md:flex-row gap-4 items-start justify-center pt-4"
        data-testid={"pet-form-container"}
      >
        <EntityForm<InitialPetFormValues>
          form={form}
          entityType="Pet"
          entityId={selectedPetId}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        >
          <EntityFormField
            control={form.control}
            name="description"
            label="Description"
            testId="description-input"
          >
            {(field) => <Input {...field} />}
          </EntityFormField>
        </EntityForm>
        {selectedPetId && (
          <ConnectedMoments entityId={selectedPetId} entityType="pet" />
        )}
      </div>
    </div>
  );
};

export default PetFormPage;
