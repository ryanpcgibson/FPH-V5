import React from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import { format } from "date-fns";
import DetailListItem, {
  createEditItem,
  createDisconnectItem,
} from "@/components/DetailListItem";
import EntityLink from "@/components/EntityLink";
import { useURLContext } from "@/context/URLContext";
interface PetConnectionListProps {
  petId: number | undefined;
  onMomentClick: (momentId: number) => void;
  currentMomentId?: number;
}

interface TimelineItem {
  id: number;
  name: string;
  start_date: Date;
  end_date?: Date;
  type: "pet" | "moment" | "location";
  originalItem: any;
}

const PetConnectionList: React.FC<PetConnectionListProps> = ({
  petId,
  onMomentClick,
  currentMomentId,
}) => {
  const { familyData } = useFamilyDataContext();
  const { selectedFamilyId } = useURLContext();
  const { disconnectMoment } = useMoments();
  const navigate = useNavigate();

  if (!petId || !familyData) return null;

  const pet = familyData.pets.find((p) => p.id === petId);
  if (!pet) return null;

  const overlappingLocations =
    familyData.overlappingLocationsForPets[petId] || [];
  const overlappingPets = familyData.overlappingPetsForPets[petId] || [];
  const petMoments = familyData.moments.filter((moment) =>
    moment.pets?.some((p) => p.id === petId)
  );

  // Combine moments and locations (excluding pet)
  const timelineItems: TimelineItem[] = [
    ...petMoments.map((moment) => ({
      id: moment.id,
      name: moment.title,
      start_date: moment.start_date,
      end_date: moment.end_date,
      type: "moment" as const,
      originalItem: { ...moment, name: moment.title },
    })),
    ...overlappingLocations.map((location) => ({
      id: location.id,
      name: location.name,
      start_date: location.start_date,
      end_date: location.end_date,
      type: "location" as const,
      originalItem: location,
    })),
    ...overlappingPets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      start_date: pet.start_date,
      type: "pet" as const,
      originalItem: pet,
    })),
  ];

  // Sort by start_date in reverse order
  const sortedItems = timelineItems.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  function getDateDisplay(startDate: Date, endDate?: Date) {
    const startYear = format(new Date(String(startDate)), "yyyy");
    const endYear = endDate ? format(new Date(String(endDate)), "yyyy") : "";
    if (!endDate) {
      return `${startYear} - `;
    }

    if (endYear === startYear) {
      return startYear;
    }
    return `'${startYear.slice(-2)} - '${endYear.slice(-2)}`;
  }

  return (
    <Card className="w-full h-full p-0 overflow-y-auto">
      <CardContent className="h-full p-2">
        {/* Pet header always first */}
        <DetailListItem
          dateDisplay={getDateDisplay(pet.start_date, pet.end_date)}
          dropdownItems={[
            createEditItem(`pet/${pet.id}/edit`, () =>
              navigate(`/app/family/${selectedFamilyId}/pet/${pet.id}/edit`)
            ),
          ]}
        >
          <span className="text-xl font-bold text-primary-foreground">
            {pet.name}
          </span>
        </DetailListItem>

        {/* Sorted timeline items */}
        {sortedItems.map((item) => (
          <DetailListItem
            key={`${item.type}-${item.id}`}
            // Only the currently selected Pet/Location will be displayed as 'start_date YYYY - ' with the dash implying still current. For anything else with just start_date, we assume it's a moment in time and display 'start_date' YYYY in the list
            dateDisplay={getDateDisplay(
              item.start_date,
              item.end_date || item.start_date
            )}
            dropdownItems={[
              createEditItem(`${item.type}/${item.id}/edit`, () =>
                navigate(
                  `/app/family/${selectedFamilyId}/${item.type}/${item.id}/edit`
                )
              ),
              ...(item.type === "moment"
                ? [
                    createDisconnectItem(() =>
                      disconnectMoment(item.id, petId!, "pet")
                    ),
                  ]
                : []),
            ]}
          >
            <EntityLink
              item={item.originalItem}
              itemType={item.type}
              customOnClick={
                item.type === "moment"
                  ? () => onMomentClick(item.id)
                  : undefined
              }
              isSelected={item.type === "moment" && currentMomentId === item.id}
            />
          </DetailListItem>
        ))}
      </CardContent>
    </Card>
  );
};

export default PetConnectionList;
