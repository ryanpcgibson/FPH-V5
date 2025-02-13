// pages/FamilyDataPage.tsx - debugging page to see raw family data

import React, { useMemo } from "react";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { JsonToTable } from "react-json-to-table";
import { Pet, Location, Moment, FamilyData } from "@/db/db_types";
import { convertDateToISODateString } from "@/utils/dateUtils";

const DataPage: React.FC = () => {
  const {
    families,
    familyData,
    selectedFamilyId: familyId,
    selectedFamilyName: familyName,
    isLoading,
    error,
  } = useFamilyDataContext();

  const convertFamilyData = (familyData: any): FamilyData => {
    if (!familyData) {
      return {
        pets: [],
        locations: [],
        users: [],
        moments: [],
        overlappingPetsForLocations: {},
        overlappingLocationsForPets: {},  
        overlappingPetsForPets: {},
        overlappingLocationsForLocations: {},
      };
    } else {
      return {
        pets: familyData.pets.map((pet: Pet) => ({
          ...pet,
          start_date: convertDateToISODateString(pet.start_date),
          end_date: convertDateToISODateString(pet.end_date || undefined),
        })),
        locations: familyData.locations.map((location: Location) => ({
          ...location,
          start_date: convertDateToISODateString(location.start_date),
          end_date: convertDateToISODateString(location.end_date || undefined),
        })),
        users: familyData.users, // Assuming users don't have date fields
        moments: familyData.moments.map((moment: Moment) => ({
          ...moment,
          start_date: convertDateToISODateString(moment.start_date),
          end_date: convertDateToISODateString(moment.end_date || undefined),
        })),
        overlappingPetsForLocations: familyData.overlappingPetsForLocations,
        overlappingLocationsForPets: familyData.overlappingLocationsForPets,
        overlappingPetsForPets: familyData.overlappingPetsForPets,
        overlappingLocationsForLocations:
          familyData.overlappingLocationsForLocations,
      };
    }
  };

  const updatedData = useMemo(
    () => ({
      families,
      familyData: convertFamilyData(familyData),
      selectedFamilyId: familyId,
      selectedFamilyName: familyName,
    }),
    [families, familyData, familyId, familyName]
  );

  return (
    <div className="overflow-auto max-h-full max-w-full">
      <JsonToTable json={updatedData} />
    </div>
  );
};

export default DataPage;
