import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useMoments } from "@/hooks/useMoments";

interface ConnectedEntitiesProps {
  entityId: number;
  entityType: "pet" | "location" | "moment";
}

const ConnectedEntities: React.FC<ConnectedEntitiesProps> = ({
  entityId,
  entityType,
}) => {
  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

  let connectedEntities = [];
  let availableEntities = [];

  if (entityType === "moment") {
    const moment = familyData?.moments.find((m) => m.id === entityId);
    connectedEntities = [...(moment?.pets || []), ...(moment?.locations || [])];
    availableEntities = [
      ...(familyData?.pets.filter(
        (p) => !moment?.pets.some((mp) => mp.id === p.id)
      ) || []),
      ...(familyData?.locations.filter(
        (l) => !moment?.locations.some((ml) => ml.id === l.id)
      ) || []),
    ];
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          Connected {entityType === "moment" ? "Entities" : "Moments"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Changes to connections are saved immediately
          </div>
          <EntityConnectionManager
            entityType={entityType}
            connectedEntities={connectedEntities}
            availableEntities={availableEntities}
            onConnect={(entityId) =>
              connectMoment(entityId, entityId, entityType)
            }
            onDisconnect={(entityId) =>
              disconnectMoment(entityId, entityId, entityType)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedEntities;
