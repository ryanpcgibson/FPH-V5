import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useMoments } from "@/hooks/useMoments";
import PhotoUploadModal from "@/components/photo/PhotoUploadModal";
import { EntityForm } from "../EntityForm";
import { EntityFormField } from "../EntityFormField";
import DatePicker from "../DatePicker";
import { useEntityFormState } from "@/hooks/useEntityFormState";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().optional(),
  start_date: z.date().nullable(),
  end_date: z.date().nullable(),
  pet_connection: z.string().optional(),
  location_connection: z.string().optional(),
  family_id: z.number(),
});

export type MomentFormValues = z.infer<typeof formSchema>;

interface MomentFormProps {
  momentId?: number;
  familyId: number;
  initialData?: MomentFormValues;
  onDelete?: () => void;
  onSubmit: (values: MomentFormValues) => void;
  onCancel: () => void;
}

const MomentForm: React.FC<MomentFormProps> = ({
  momentId,
  familyId,
  initialData,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const { form, isSaveDisabled, handleFieldChange } = useEntityFormState(
    formSchema,
    {
      title: initialData?.title ?? "",
      body: initialData?.body ?? "",
      start_date: initialData?.start_date ?? null,
      end_date: initialData?.end_date ?? null,
      family_id: familyId,
    }
  );

  const ConnectionSection = () => {
    return (
      <>
        <EntityConnectionManager
          entityType="pet"
          connectedEntities={initialData?.pets || []}
          availableEntities={
            familyData?.pets.filter(
              (p) => !initialData?.pets?.some((mp) => mp.id === p.id)
            ) || []
          }
          onConnect={(petId) => connectMoment(momentId!, petId, "pet")}
          onDisconnect={(petId) => disconnectMoment(momentId!, petId, "pet")}
        />
        <EntityConnectionManager
          control={form.control}
          name="location_connection"
          label="Locations"
          entityType="location"
          connectedEntities={initialData?.locations || []}
          availableEntities={
            familyData?.locations.filter(
              (l) => !initialData?.locations?.some((ml) => ml.id === l.id)
            ) || []
          }
          onConnect={(locationId) =>
            connectMoment(momentId!, locationId, "location")
          }
          onDisconnect={(locationId) =>
            disconnectMoment(momentId!, locationId, "location")
          }
        />
        <EntityConnectionManager
          control={form.control}
          name="photo_connection"
          label="Photos"
          entityType="photo"
          onAdd={() => setIsUploadModalOpen(true)}
          connectedEntities={initialData?.photos || []}
          availableEntities={[]}
          onConnect={() => {}}
          onDisconnect={() => {}}
        />
      </>
    );
  };

  return (
    <EntityForm
      form={form}
      entityId={momentId}
      entityType="Moment"
      onDelete={onDelete}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSaveDisabled={isSaveDisabled}
      connectionSection={<ConnectionSection />}
    >
      <EntityFormField control={form.control} name="title" label="Title">
        <Input
          placeholder="Title"
          className="w-full bg-background"
          {...form.register("title")}
        />
      </EntityFormField>
      <EntityFormField control={form.control} name="body" label="Description">
        <Input
          placeholder="Description (optional)"
          className="w-full bg-background"
          {...form.register("body")}
        />
      </EntityFormField>
      <EntityFormField
        control={form.control}
        name="start_date"
        label="Start Date"
      >
        <DatePicker
          date={form.watch("start_date")}
          setDate={(date) => form.setValue("start_date", date)}
        />
      </EntityFormField>
      <EntityFormField control={form.control} name="end_date" label="End Date">
        <DatePicker
          date={form.watch("end_date")}
          setDate={(date) => form.setValue("end_date", date)}
        />
      </EntityFormField>
    </EntityForm>
  );
};

export default MomentForm;
