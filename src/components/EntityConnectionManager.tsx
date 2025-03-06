import React from "react";
import { Link2Off } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Entity is a generic type that can be used for pets, locations, and moments
interface Entity {
  id: number;
  name?: string;
  title?: string;
  start_date: Date;
  end_date?: Date;
}

interface EntityConnectionManagerProps {
  entityType: string;
  connectedEntities: Entity[];
  availableEntities: Entity[];
  onConnect: (entityId: number) => void;
  onDisconnect: (entityId: number) => void;
}

const EntityConnectionManager: React.FC<EntityConnectionManagerProps> = ({
  entityType,
  connectedEntities,
  availableEntities,
  onConnect,
  onDisconnect,
}) => {
  const getEntityDisplayName = (entity: Entity) => {
    const displayName = entity.name || entity.title || "Unnamed";
    if (entity.start_date) {
      try {
        return `${displayName} (${format(
          new Date(entity.start_date),
          "MMM d, yyyy"
        )})`;
      } catch (error) {
        return displayName;
      }
    }
    return displayName;
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col w-full gap-2">
        {connectedEntities.map((entity) => (
          <div
            key={`${entityType}-${entity.id}`}
            className="flex items-center justify-between rounded-md border border-input bg-background p-2 text-sm ring-offset-background h-10"
          >
            <span>{getEntityDisplayName(entity)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDisconnect(entity.id)}
            >
              <Link2Off className=" text-red-500" />
            </Button>
          </div>
        ))}
      </div>
      <Select
        onValueChange={(value) => {
          const entityId = parseInt(value, 10);
          onConnect(entityId);
        }}
      >
        <SelectTrigger
          className="w-full h-10 px-2 text-sm bg-background"
          data-testid={`${entityType.toLowerCase()}-select-trigger`}
        >
          <SelectValue placeholder={`Connect ${entityType}...`} />
        </SelectTrigger>
        <SelectContent>
          {availableEntities.map((entity) => (
            <SelectItem
              key={entity.id}
              value={entity.id.toString()}
              data-testid={`${entityType.toLowerCase()}-select-item-${
                entity.id
              }`}
            >
              {getEntityDisplayName(entity)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EntityConnectionManager;
