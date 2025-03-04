import React, { createContext, useContext, ReactNode } from "react";
import { useParams } from "react-router-dom";

interface URLContextType {
  selectedFamilyId?: number;
  selectedLocationId?: number;
  selectedPetId?: number;
  selectedMomentId?: number;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

interface URLProviderProps {
  children: ReactNode;
}

export const URLProvider: React.FC<URLProviderProps> = ({ children }) => {
  const {
    selectedFamilyId,
    selectedLocationId,
    selectedPetId,
    selectedMomentId,
  } = useParams<{
    selectedFamilyId?: string;
    selectedLocationId?: string;
    selectedPetId?: string;
    selectedMomentId?: string;
  }>();

  const parsedIds: URLContextType = {
    selectedFamilyId: selectedFamilyId
      ? parseInt(selectedFamilyId, 10)
      : undefined,
    selectedLocationId: selectedLocationId
      ? parseInt(selectedLocationId, 10)
      : undefined,
    selectedPetId: selectedPetId ? parseInt(selectedPetId, 10) : undefined,
    selectedMomentId: selectedMomentId
      ? parseInt(selectedMomentId, 10)
      : undefined,
  };

  return (
    <URLContext.Provider value={parsedIds}>{children}</URLContext.Provider>
  );
};

export const useURLContext = () => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error("useURLContext must be used within a URLProvider");
  }
  return context;
};
