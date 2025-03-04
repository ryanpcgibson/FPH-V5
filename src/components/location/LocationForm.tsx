import React from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "react-day-picker/dist/style.css";
import { Location } from "@/db/db_types";
import { Input } from "@/components/ui/input";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import EntityConnectionManager from "@/components/EntityConnectionManager";
import { useMoments } from "@/hooks/useMoments";
import DatePickerWithInput from "@/components/DatePickerWithInput";
import { EntityForm } from "@/components/EntityForm";
import { EntityFormField } from "@/components/EntityFormField";
import { EntityFormProps } from "@/components/EntityForm";
import { LocationFormValues } from "@/pages/app/family/location/LocationFormPage";


// interface LocationFormProps {
//   locationId?: number;
//   familyId: number;
//   initialData?: Location;
//   onFamilyChange: (familyId: number) => void;
//   onDelete?: () => void;
//   onSubmit: (values: LocationFormValues) => void;
//   onCancel: () => void;
// }

const LocationForm: React.FC<EntityFormProps<LocationFormValues>> = ({
  locationId: entityId,
  initialData,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  

  const { familyData } = useFamilyDataContext();
  const { connectMoment, disconnectMoment } = useMoments();

  return (
    <EntityForm
      form={form}
      entityId={locationId}
      entityType="Location"
      onDelete={onDelete}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSaveDisabled={isSaveDisabled}
      connectionSection={
        locationId && (
          <Card>
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
                  connectedEntities={
                    familyData?.moments?.filter((m) =>
                      m.locations?.some((l) => l.id === locationId)
                    ) || []
                  }
                  availableEntities={
                    familyData?.moments.filter(
                      (m) => !m.locations?.some((l) => l.id === locationId)
                    ) || []
                  }
                  onConnect={(momentId) =>
                    connectMoment(momentId, locationId!, "location")
                  }
                  onDisconnect={(momentId) =>
                    disconnectMoment(momentId, locationId!, "location")
                  }
                />
              </div>
            </CardContent>
          </Card>
        )
      }
    >
      <EntityFormField control={form.control} name="name" label="Location Name">
        <Input
          data-testid="location-name-input"
          placeholder="Location Name"
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </EntityFormField>
      <EntityFormField
        control={form.control}
        name="start_date"
        label="Start Date"
      >
        <DatePickerWithInput
          data-testid="start-date-input"
          date={form.watch("start_date")}
          setDate={(value) => handleFieldChange("start_date", value)}
          required={true}
        />
      </EntityFormField>
      <EntityFormField control={form.control} name="end_date" label="End Date">
        <DatePickerWithInput
          data-testid="end-date-input"
          date={form.watch("end_date")}
          setDate={(value) => handleFieldChange("end_date", value)}
          required={false}
        />
      </EntityFormField>
      <EntityFormField
        control={form.control}
        name="map_reference"
        label="Map Reference"
      >
        <Input
          data-testid="map-reference-input"
          placeholder="Map Reference (optional)"
          onChange={(e) => handleFieldChange("map_reference", e.target.value)}
        />
      </EntityFormField>
    </EntityForm>
  );
};

export default LocationForm;
