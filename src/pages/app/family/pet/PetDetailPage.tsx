import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FamilyData, Moment } from "@/db/db_types";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
import PetCarousel from "@/components/pet/PetCarousel";
import PetConnectionList from "@/components/pet/PetConnectionList";
import { useURLContext } from "@/context/URLContext";
const PetDetailPage: React.FC = () => {
  const { familyData } = useFamilyDataContext();
  const { selectedPetId } = useURLContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [moments, setMoments] = useState<FamilyData["moments"]>([]);
  const [currentMomentIndex, setCurrentMomentIndex] = useState<number>(0);

  useEffect(() => {
    if (familyData && selectedPetId) {
      const petMoments = familyData.moments.filter((moment: Moment) =>
        moment.pets?.some((pet: { id: number }) => pet.id === selectedPetId)
      );
      setMoments(petMoments);

      const queryParams = new URLSearchParams(location.search);
      const momentIdParam = queryParams.get("momentId");

      if (momentIdParam) {
        const momentId = parseInt(momentIdParam, 10);
        const index = petMoments.findIndex((moment) => moment.id === momentId);
        if (index !== -1) {
          setCurrentMomentIndex(index);
        }
      } else if (petMoments.length === 1) {
        // If there's only one moment, select it by default
        setCurrentMomentIndex(0);
        // Update URL to reflect the selected moment
        navigate(`${location.pathname}?momentId=${petMoments[0].id}`);
      } else if (petMoments.length > 0) {
        // Set first moment as default if none specified
        setCurrentMomentIndex(0);
      }
    }
  }, [familyData, selectedPetId, location.search, navigate]);

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
  // max-h-[calc(100vh-100px)]
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
        id="pet-detail-container"
      >
        <PetConnectionList
          petId={selectedPetId}
          onMomentClick={handleMomentClick}
          currentMomentId={moments[currentMomentIndex]?.id}
        />
      </div>
    </div>
  );
};

export default PetDetailPage;
