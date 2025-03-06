import React from "react";
import { format } from "date-fns";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMoments } from "@/hooks/useMoments";
import DetailListItem, {
  createEditItem,
  createDisconnectItem,
} from "@/components/DetailListItem";
import EntityLink from "@/components/EntityLink";
import { useURLContext } from "@/context/URLContext";

interface LocationConnectionListProps {
  locationId: number | undefined;
  onMomentClick: (momentId: number) => void;
  currentMomentId?: number;
}

interface TimelineItem {
  id: number;
  name: string;
  start_date: Date;
  end_date?: Date;
  type: "location" | "moment" | "pet";
  originalItem: any;
}

const LocationConnectionList: React.FC<LocationConnectionListProps> = ({
  locationId,
  onMomentClick,
  currentMomentId,
}) => {
  const { familyData } = useFamilyDataContext();
  const { selectedFamilyId } = useURLContext();
  const { disconnectMoment } = useMoments();
  const navigate = useNavigate();

  if (!locationId || !familyData) return null;

  const location = familyData.locations.find((l) => l.id === locationId);
  if (!location) return null;

  const overlappingPets =
    familyData.overlappingPetsForLocations[locationId] || [];
  const overlappingLocations =
    familyData.overlappingLocationsForLocations[locationId] || [];
  const locationMoments = familyData.moments.filter((moment) =>
    moment.locations?.some((l) => l.id === locationId)
  );

  const timelineItems: TimelineItem[] = [
    ...locationMoments.map((moment) => ({
      id: moment.id,
      name: moment.title,
      start_date: moment.start_date,
      end_date: moment.end_date,
      type: "moment" as const,
      originalItem: { ...moment, name: moment.title },
    })),
    ...overlappingPets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      start_date: pet.start_date,
      end_date: pet.end_date,
      type: "pet" as const,
      originalItem: pet,
    })),
    ...overlappingLocations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      start_date: loc.start_date,
      end_date: loc.end_date,
      type: "location" as const,
      originalItem: loc,
    })),
  ];

  const sortedItems = timelineItems.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  function getDateDisplay(startDate: Date, endDate?: Date) {
    const startYear = format(new Date(String(startDate)), "yyyy");
    const endYear = endDate ? format(new Date(String(endDate)), "yyyy") : "";
    if (!endDate) return `${startYear} - `;
    if (endYear === startYear) return startYear;
    return `'${startYear.slice(-2)} - '${endYear.slice(-2)}`;
  }

  return (
    <Card className="w-full h-full p-0 overflow-y-auto">
      <CardContent className="h-full p-2">
        <DetailListItem
          dateDisplay={getDateDisplay(location.start_date, location.end_date)}
          dropdownItems={[
            createEditItem(`location/${location.id}/edit`, () =>
              navigate(
                `/app/family/${selectedFamilyId}/location/${location.id}/edit`
              )
            ),
          ]}
        >
          <span className="text-xl font-bold text-primary-foreground">
            {location.name}
          </span>
        </DetailListItem>

        {sortedItems.map((item) => (
          <DetailListItem
            key={`${item.type}-${item.id}`}
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
                      disconnectMoment(item.id, locationId!, "location")
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

export default LocationConnectionList;
