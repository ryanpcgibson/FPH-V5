import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useMoments } from "@/hooks/useMoments";
import { useURLContext } from "@/context/URLContext";
import { Pet, Location } from "@/db/db_types";

interface ConnectedMomentsCardProps {
  entityId: number;
  entityType: "pet" | "location" | "moment";
}

const ConnectedMoments: React.FC<ConnectedMomentsCardProps> = ({
  entityId,
  entityType,
}) => {
  const { selectedMomentId, selectedPetId, selectedLocationId } =
    useURLContext();
  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

  let connectedEntities: any[] = [];
  let availableEntities: any[] = [];
  let connectedPets: Pet[] = [];
  let connectedLocations: Location[] = [];
  let availablePets: Pet[] = [];
  let availableLocations: Location[] = [];

  if (entityType === "moment") {
    const moment = familyData?.moments.find((m) => m.id === entityId);
    connectedPets = moment?.pets || [];
    connectedLocations = moment?.locations || [];
    availablePets =
      familyData?.pets.filter(
        (p) => !moment?.pets?.some((mp) => mp.id === p.id)
      ) || [];
    availableLocations =
      familyData?.locations.filter(
        (l) => !moment?.locations?.some((ml) => ml.id === l.id)
      ) || [];
  } else {
    connectedEntities =
      familyData?.moments?.filter((m) =>
        m[entityType === "pet" ? "pets" : "locations"]?.some(
          (entity) => entity.id === entityId
        )
      ) || [];

    availableEntities =
      familyData?.moments.filter(
        (m) =>
          !m[entityType === "pet" ? "pets" : "locations"]?.some(
            (entity) => entity.id === entityId
          )
      ) || [];
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-center p-2 pt-4">
        <CardTitle>Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Changes to connections are saved immediately
          </div>

          {entityType === "moment" ? (
            <>
              <EntityConnectionManager
                entityType="pet"
                connectedEntities={connectedPets}
                availableEntities={availablePets}
                onConnect={(entityId) =>
                  connectMoment(selectedMomentId!, entityId, "pet")
                }
                onDisconnect={(entityId) =>
                  disconnectMoment(selectedMomentId!, entityId, "pet")
                }
              />
              <EntityConnectionManager
                entityType="location"
                connectedEntities={connectedLocations}
                availableEntities={availableLocations}
                onConnect={(entityId) =>
                  connectMoment(selectedMomentId!, entityId, "location")
                }
                onDisconnect={(entityId) =>
                  disconnectMoment(selectedMomentId!, entityId, "location")
                }
              />
            </>
          ) : (
            <EntityConnectionManager
              entityType={entityType}
              connectedEntities={connectedEntities}
              availableEntities={availableEntities}
              onConnect={(entityId) => {
                connectMoment(
                  entityId,
                  entityType === "pet" ? selectedPetId! : selectedLocationId!,
                  entityType
                );
              }}
              onDisconnect={(entityId) =>
                disconnectMoment(
                  entityId,
                  entityType === "pet" ? selectedPetId! : selectedLocationId!,
                  entityType
                )
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedMoments;
