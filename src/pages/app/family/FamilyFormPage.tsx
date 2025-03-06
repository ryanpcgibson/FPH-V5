import { useNavigate } from "react-router-dom";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import FamilyForm from "@/components/family/FamilyForm";
import { useFamilies } from "@/hooks/useFamilies";
import type { FamilyInsert } from "@/db/db_types";
import { useURLContext } from "@/context/URLContext";

const FamilyFormPage = () => {
  const { selectedFamilyId } = useURLContext();
  const navigate = useNavigate();
  const { families = [], familyData } = useFamilyDataContext();
  const family = selectedFamilyId
    ? families.find((f) => f.id === selectedFamilyId)
    : undefined;
  const { deleteFamily, updateFamily, createFamily } = useFamilies();

  const handleDelete = async () => {
    if (!selectedFamilyId) return;
    try {
      await deleteFamily(selectedFamilyId);
      navigate("/app/families");
    } catch (error) {
      console.error("Error deleting family:", error);
    }
  };

  const handleSubmit = async (values: FamilyInsert) => {
    try {
      if (selectedFamilyId) {
        await updateFamily({ ...values, id: selectedFamilyId });
        navigate(`/app/family/${selectedFamilyId}`);
      } else {
        const newFamily = await createFamily(values);
        navigate(`/app/family/${newFamily.id}`);
      }
    } catch (error) {
      console.error("Error saving family:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FamilyForm
      familyId={selectedFamilyId}
      initialData={
        familyData && family?.name ? { name: family.name } : undefined
      }
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default FamilyFormPage;
