import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { useMoments } from "@/hooks/useMoments";

interface ConnectedMomentsCardProps {
  entityId: number;
  entityType: "pet" | "location";
}

const ConnectedMomentsCard: React.FC<ConnectedMomentsCardProps> = ({
  entityId,
  entityType,
}) => {
  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

  const connectedEntities =
    familyData?.moments?.filter((m) =>
      m[entityType === "pet" ? "pets" : "locations"]?.some(
        (entity) => entity.id === entityId
      )
    ) || [];

  const availableEntities =
    familyData?.moments.filter(
      (m) =>
        !m[entityType === "pet" ? "pets" : "locations"]?.some(
          (entity) => entity.id === entityId
        )
    ) || [];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Connected Moments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Changes to connections are saved immediately
          </div>
          <EntityConnectionManager
            entityType="moment"
            connectedEntities={connectedEntities}
            availableEntities={availableEntities}
            onConnect={(momentId) =>
              connectMoment(momentId, entityId, entityType)
            }
            onDisconnect={(momentId) =>
              disconnectMoment(momentId, entityId, entityType)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedMomentsCard;
