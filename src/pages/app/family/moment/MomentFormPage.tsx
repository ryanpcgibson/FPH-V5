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
import { useMoments } from "@/hooks/useMoments";

const formSchema = z.object({
  title: z.string().min(2, VALIDATION_MESSAGES.MOMENT.TITLE_MIN_LENGTH),
  body: z.string().optional(),
  start_date: z
    .date({
      required_error: VALIDATION_MESSAGES.MOMENT.START_DATE_REQUIRED,
      invalid_type_error: VALIDATION_MESSAGES.MOMENT.INVALID_DATE,
    })
    .nullable()
    .refine((date) => date !== null, {
      message: VALIDATION_MESSAGES.MOMENT.START_DATE_REQUIRED,
    }),
  end_date: z
    .date({
      invalid_type_error: VALIDATION_MESSAGES.MOMENT.INVALID_DATE,
    })
    .nullable(),
  pet_connection: z.string().optional(),
  location_connection: z.string().optional(),
  family_id: z.number({
    required_error: "Family ID is required",
  }),
});

// Since start_date is both nullable on load, but required on save, we need to create a new type for the initial form values
export type InitialMomentFormValues = Omit<
  z.infer<typeof formSchema>,
  "start_date"
> & {
  start_date: Date | null;
};

interface MomentFormValues {
  title: string;
  body: string;
  start_date: Date | null;
  end_date: Date | null;
  pets?: number[];
  locations?: number[];
}

const MomentFormPage = () => {
  const { selectedFamilyId, selectedMomentId } = useURLContext();
  const { familyData, isLoading } = useFamilyDataContext();

  const { createMoment, updateMoment, deleteMoment } = useMoments();
  const navigate = useNavigate();

  const form = useForm<InitialMomentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      start_date: null,
      end_date: null,
      family_id: selectedFamilyId!,
    },
  });

  useEffect(() => {
    if (!isLoading && familyData) {
      const foundMoment = selectedMomentId
        ? familyData.moments.find((m) => m.id === selectedMomentId)
        : null;
      form.reset({
        title: foundMoment?.title || "",
        body: foundMoment?.body || "",
        start_date: foundMoment?.start_date || null,
        end_date: foundMoment?.end_date || null,
        family_id: selectedFamilyId!,
      });
    }
  }, [isLoading, familyData, selectedMomentId, selectedFamilyId, form]);

  const handleSubmit = async (values: InitialMomentFormValues) => {
    try {
      if (selectedMomentId) {
        await updateMoment({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
          family_id: selectedFamilyId!,
          id: selectedMomentId,
        });
      } else {
        await createMoment({
          ...values,
          start_date: values.start_date as Date,
          end_date: values.end_date || undefined,
        });
      }
    } catch (error) {
      console.error(`Error saving Moment:`, error);
    }
    navigate(-1);
  };

  const handleDelete = async () => {
    await deleteMoment(selectedMomentId!);
    navigate(-1);
  };

  return (
    <div
      className="w-full h-full flex portrait:flex-col landscape:flex-row gap-2  overflow-auto items-center"
      data-testid={"moment-form-container"}
    >
      <div
        className="w-full landscape:w-1/2 landscape:h-full"
        id="moment-entity-form-container"
      >
        <EntityForm<InitialMomentFormValues>
          form={form}
          entityType="Moment"
          entityId={selectedMomentId}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        >
          <EntityFormField
            control={form.control}
            name="body"
            label="Body"
            testId="body-input"
          >
            {(field) => <Input {...field} />}
          </EntityFormField>
        </EntityForm>
      </div>
      {selectedMomentId && (
        <div
          className="w-full landscape:w-1/2 h-full"
          id="moment-connection-form-container"
        >
          <ConnectedMoments entityId={selectedMomentId} entityType="moment" />
        </div>
      )}
    </div>
  );
};

export default MomentFormPage;
