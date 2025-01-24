import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { format } from "date-fns";

interface MomentTimelineFactsProps {
  momentId: number | null;
}

const MomentTimelineFacts: React.FC<MomentTimelineFactsProps> = ({
  momentId,
}) => {
  const { familyData } = useFamilyDataContext();

  if (!momentId || !familyData) return null;

  const moment = familyData.moments.find((m) => m.id === momentId);
  if (!moment) return null;

  return (
    <ul className="space-y-2">
      {moment.start_date && (
        <li>Date: {format(moment.start_date, "MMMM d, yyyy")}</li>
      )}
      {moment.body && <li>Description: {moment.body}</li>}
      {moment.pets && moment.pets.length > 0 && (
        <>
          <li className="font-semibold mt-4">Pets in this moment:</li>
          {moment.pets.map((pet) => (
            <li key={pet.id} className="ml-4">
              • {pet.name}
            </li>
          ))}
        </>
      )}
      {moment.locations && moment.locations.length > 0 && (
        <>
          <li className="font-semibold mt-4">Locations in this moment:</li>
          {moment.locations.map((location) => (
            <li key={location.id} className="ml-4">
              • {location.name}
            </li>
          ))}
        </>
      )}
    </ul>
  );
};

export default MomentTimelineFacts;
