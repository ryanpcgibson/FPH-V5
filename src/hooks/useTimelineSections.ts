/**
 * Manages and organizes timeline data for pets and locations into sections for display in a timeline visualization component. It processes raw timeline data and returns a structured format that can be easily rendered.
 */
import { useMemo } from "react";
import type { TimelineSection } from "@/types/timeline";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { useLocationTimelineContext } from "@/context/LocationTimelineContext";

// Utility function to determine the sort year for both pets and locations
const getSortYear = (segments, isLocation = false) => {
  if (isLocation) {
    const moveOutSegment = segments.find(
      (segment) => segment.status === "move-out"
    );
    const moveInSegment = segments.find(
      (segment) => segment.status === "move-in"
    );
    const finalYear = moveOutSegment
      ? moveOutSegment.year
      : new Date().getFullYear();
    const initialYear = moveInSegment ? moveInSegment.year : 0;
    return { finalYear, initialYear };
  } else {
    const deathSegment = segments.find((segment) => segment.status === "death");
    const birthSegment = segments.find((segment) => segment.status === "birth");
    const finalYear = deathSegment
      ? deathSegment.year
      : new Date().getFullYear();
    const initialYear = birthSegment ? birthSegment.year : 0;
    return { finalYear, initialYear };
  }
};

export const useTimelineSections = (petId?: number) => {
  const { petTimelines, getFilteredPetTimelines } = usePetTimelineContext();
  const { locationTimelines } = useLocationTimelineContext();
  return useMemo(() => {
    const sections: Record<string, TimelineSection> = {};
    const filteredPetTimelines = getFilteredPetTimelines(petId);
    const petNames = filteredPetTimelines.map((pet) => pet.petName);
    const locationNames = locationTimelines.map(
      (location) => location.locationName
    );
    // TODO: filter locations for pet

    // Sort pets using the utility function
    const sortedPetTimelines = filteredPetTimelines.sort((a, b) => {
      const aSortYear = getSortYear(a.segments);
      const bSortYear = getSortYear(b.segments);
      console.log(
        `Sorting Pets: ${a.petName} (${aSortYear.finalYear}, ${aSortYear.initialYear}) vs ${b.petName} (${bSortYear.finalYear}, ${bSortYear.initialYear})`
      );
      if (bSortYear.finalYear !== aSortYear.finalYear) {
        return bSortYear.finalYear - aSortYear.finalYear; // Sort by final year descending
      }
      return aSortYear.initialYear - bSortYear.initialYear; // Sort by initial year ascending
    });

    if (sortedPetTimelines.length > 0) {
      sections.pets = {
        id: "pet",
        items: sortedPetTimelines.map((pet) => ({
          id: pet.petId,
          name: pet.petName,
          segments: pet.segments,
        })),
        patternIds: ["9", "10", "22", "40"],
        headerStyle: "",
        getSegmentUrl: (baseURL, itemId, momentId) =>
          `${baseURL}/pet/${itemId}${momentId ? `?momentId=${momentId}` : ""}`,
      };
    }

    // Sort locations using the same utility function with isLocation flag
    const sortedLocationTimelines = locationTimelines.sort((a, b) => {
      const aSortYear = getSortYear(a.segments, true);
      const bSortYear = getSortYear(b.segments, true);
      console.log(
        `Sorting Locations: ${a.locationName} (${aSortYear.finalYear}, ${aSortYear.initialYear}) vs ${b.locationName} (${bSortYear.finalYear}, ${bSortYear.initialYear})`
      );
      if (bSortYear.finalYear !== aSortYear.finalYear) {
        return bSortYear.finalYear - aSortYear.finalYear; // Sort by final year descending
      }
      return aSortYear.initialYear - bSortYear.initialYear; // Sort by initial year ascending
    });

    if (sortedLocationTimelines.length > 0) {
      sections.locations = {
        id: "location",
        items: sortedLocationTimelines.map((location) => ({
          id: location.locationId,
          name: location.locationName,
          segments: location.segments,
        })),
        patternIds: ["9", "10", "22", "40"],
        headerStyle: "",
        getSegmentUrl: (baseURL, itemId, momentId) =>
          `${baseURL}/location/${itemId}${
            momentId ? `?momentId=${momentId}` : ""
          }`,
      };
    }

    const allItems = Object.values(sections).flatMap(
      (section) => section.items
    );

    const earliestYear = allItems.reduce(
      (min, item) =>
        item.segments.length > 0 ? Math.min(min, item.segments[0].year) : min,
      Infinity
    );

    const latestYear = allItems.reduce(
      (max, item) =>
        item.segments.length > 0
          ? Math.max(max, item.segments[item.segments.length - 1].year)
          : max,
      -Infinity
    );

    const yearsArray = Array.from(
      { length: latestYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    );

    return {
      sections,
      yearsArray,
      petNames,
      locationNames,
    };
  }, [petTimelines, locationTimelines, petId, getFilteredPetTimelines]);
};
