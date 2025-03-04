import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";

interface EntityFormPageConfig<T, V> {
  entityId?: number;
  entityType: string;
  findEntity: (data: any, id: number) => T | undefined;
  createEntity: (data: V) => Promise<any>;
  updateEntity: (data: V & { id: number }) => Promise<any>;
  deleteEntity: (id: number) => Promise<any>;
}

export function useEntityFormPage<T, V>({
  entityId,
  entityType,
  findEntity,
  createEntity,
  updateEntity,
  deleteEntity,
}: EntityFormPageConfig<T, V>) {
  const navigate = useNavigate();
  const { selectedFamilyId, familyData } = useFamilyDataContext();

  const entity = entityId ? findEntity(familyData, entityId) : undefined;

  const handleDelete = async () => {
    if (!entityId) return;
    try {
      await deleteEntity(entityId);
      navigate(`/app/family/${selectedFamilyId}`);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
    }
  };

  const handleSubmit = async (values: V) => {
    const entityData = {
      ...values,
      family_id: selectedFamilyId,
    };

    try {
      if (entityId) {
        await updateEntity({ ...entityData, id: entityId });
      } else {
        const newEntity = await createEntity(entityData);
        console.log(`Created new ${entityType}:`, newEntity);
      }
      navigate(`/app/family/${selectedFamilyId}`);
    } catch (error) {
      console.error(`Error saving ${entityType}:`, error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    entity,
    handleDelete,
    handleSubmit,
    handleCancel,
    handleUpdate: updateEntity,
  };
}
