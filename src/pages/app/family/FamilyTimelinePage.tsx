import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import TimelineBars from "@/components/TimelineBars";

const TimelinePage: React.FC = () => {
  const {
    familyData,
    familyId,
    isLoading: isFamilyLoading,
    error: familyError,
  } = useFamilyDataContext();
  const {
    petTimelines,
    isLoading: isPetTimelineLoading,
    error: petTimelineError,
  } = usePetTimelineContext();

  const isLoading = isFamilyLoading || isPetTimelineLoading;
  const error = familyError || petTimelineError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading ...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col sm:flex-row gap-4 items-stretch justify-center min-h-screen p-0  "
        id="pet-detail-container"
      >
        <TimelineBars petTimelines={petTimelines} />
      </div>
    </>
  );
};

export default TimelinePage;
