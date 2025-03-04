import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Families, FamilyData } from "@/db/db_types";
import { useFamilyData } from "@/hooks/useFamilyData";
import { useURLContext } from "./URLContext";

interface FamilyDataContextType {
  families: Families | undefined;
  familyData: FamilyData | undefined;
  selectedFamilyId: number | undefined;
  selectedFamilyName: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

const FamilyDataContext = createContext<FamilyDataContextType | undefined>(
  undefined
);

const FamilyDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { selectedFamilyId } = useURLContext();
  const { families, familyData, isLoading, isError, error } = useFamilyData(
    selectedFamilyId ?? undefined
  );

  const contextValue = useMemo(() => {
    if (!familyData) {
      return {
        families,
        familyData: undefined,
        selectedFamilyId: null,
        selectedFamilyName: null,
        isLoading,
        error: isError ? error : null,
      };
    }
    const selectedFamilyName =
      families?.find(
        (family: { id: number; name: string }) => family.id === selectedFamilyId
      )?.name ?? null;

    return {
      families,
      familyData,
      selectedFamilyId,
      selectedFamilyName,
      isLoading,
      error: isError ? error : null,
    };
  }, [families, familyData, selectedFamilyId, isLoading, isError, error]);

  return (
    <FamilyDataContext.Provider value={contextValue}>
      {children}
    </FamilyDataContext.Provider>
  );
};

export const useFamilyDataContext = () => {
  const context = useContext(FamilyDataContext);
  if (!context) {
    throw new Error(
      "useFamilyDataContext must be used within a FamilyDataProvider"
    );
  }
  return context;
};

export default FamilyDataProvider;
