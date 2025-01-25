import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { format } from "date-fns";
import Link from "@/components/Link";

interface PetTimelineFactsProps {
  petId: number | null;
  onMomentClick: (momentId: number) => void;
}

const PetTimelineFacts: React.FC<PetTimelineFactsProps> = ({
  petId,
  onMomentClick,
}) => {
  const { familyData, selectedFamilyId } = useFamilyDataContext();

  if (!petId || !familyData) return null;

  const pet = familyData.pets.find((p) => p.id === petId);
  if (!pet) return null;

  const overlappingLocations =
    familyData.overlappingLocationsForPets[petId] || [];

  return (
    <ul className="space-y-2">
      {pet.start_date && (
        <li>Born: {format(pet.start_date, "MMMM d, yyyy")}</li>
      )}
      {pet.end_date && <li>Died: {format(pet.end_date, "MMMM d, yyyy")}</li>}
      {overlappingLocations.length > 0 && (
        <>
          <li className="font-semibold mt-4">Locations:</li>
          {overlappingLocations.map((location) => (
            <li key={location.id} className="ml-4">
              <Link
                href={`/app/family/${selectedFamilyId}/location/${location.id}`}
              >
                {location.name}
              </Link>
            </li>
          ))}
        </>
      )}
    </ul>
  );
};

export default PetTimelineFacts;
