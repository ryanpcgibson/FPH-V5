import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FamilyData, Moment } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import PetCarousel from "@/components/pet/PetCarousel";
import LocationConnectionList from "@/components/location/LocationConnectionList";
import { useURLContext } from "@/context/URLContext";

const LocationDetailPage: React.FC = () => {
  const { familyData } = useFamilyDataContext();
  const { selectedLocationId } = useURLContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && selectedLocationId) {
      const locationMoments = familyData.moments.filter((moment: Moment) =>
        moment.locations?.some((loc) => loc.id === selectedLocationId)
      );
      setMoments(locationMoments);

      const queryParams = new URLSearchParams(location.search);
      const momentIdParam = queryParams.get("momentId");

      if (momentIdParam) {
        const momentId = parseInt(momentIdParam, 10);
        const index = locationMoments.findIndex(
          (moment) => moment.id === momentId
        );
        if (index !== -1) {
          setCurrentMomentIndex(index);
        }
      } else if (locationMoments.length === 1) {
        setCurrentMomentIndex(0);
        navigate(`${location.pathname}?momentId=${locationMoments[0].id}`);
      } else if (locationMoments.length > 0) {
        setCurrentMomentIndex(0);
      }
    }
  }, [familyData, selectedLocationId, location.search, navigate]);

  useEffect(() => {
    if (moments.length > 0) {
      const currentMoment = moments[currentMomentIndex];
      if (currentMoment) {
        const newUrl = `${location.pathname}?momentId=${currentMoment.id}`;
        navigate(newUrl);
      }
    }
  }, [currentMomentIndex, moments, location.pathname, navigate]);

  const handleMomentClick = (momentId: number) => {
    const index = moments.findIndex((moment) => moment.id === momentId);
    if (index !== -1) {
      setCurrentMomentIndex(index);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col portrait:flex-col landscape:flex-row gap-2"
      id="page-container"
    >
      <div
        className="w-full landscape:w-3/5 portrait:h-1/2 landscape:h-full flex-grow overflow-hidden"
        id="carousel-container"
      >
        <PetCarousel
          moments={moments}
          currentMomentIndex={currentMomentIndex}
          setCurrentMomentIndex={setCurrentMomentIndex}
        />
      </div>
      <div
        className="w-full landscape:w-2/5 portrait:h-1/2 landscape:h-full flex flex-col flex-grow overflow-auto"
        id="location-detail-container"
      >
        <LocationConnectionList
          locationId={selectedLocationId}
          onMomentClick={handleMomentClick}
          currentMomentId={moments[currentMomentIndex]?.id}
        />
      </div>
    </div>
  );
};

export default LocationDetailPage;
