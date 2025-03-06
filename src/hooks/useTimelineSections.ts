/**
 * Manages and organizes timeline data for pets and locations into sections for display in a timeline visualization component. It processes raw timeline data and returns a structured format that can be easily rendered.
 */
import { useMemo } from "react";
import type { TimelineSection } from "@/types/timeline";
import { usePetTimelineContext } from "@/context/PetTimelineContext";
import { useLocationTimelineContext } from "@/context/LocationTimelineContext";

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

    if (filteredPetTimelines.length > 0) {
      sections.pets = {
        id: "pet",
        items: filteredPetTimelines.map((pet) => ({
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

    if (locationTimelines.length > 0) {
      sections.locations = {
        id: "location",
        items: locationTimelines.map((location) => ({
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
