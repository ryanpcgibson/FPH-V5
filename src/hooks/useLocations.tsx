import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { LocationInsert, LocationUpdate } from "@/db/db_types";
import { prepareEntityForDB } from "@/utils/dbUtils";

export function useLocations() {
  const queryClient = useQueryClient();

  const createLocationMutation = useMutation({
    mutationFn: async (locationData: LocationInsert) => {
      console.log("createLocationMutation", locationData);
      const preparedData = prepareEntityForDB(locationData);
      const { data, error } = await supabaseClient
        .from("locations")
        .insert([preparedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: LocationUpdate) => {
      if (!locationData.id) throw new Error("Location ID is required");

      const preparedData = prepareEntityForDB(locationData);
      const { data, error } = await supabaseClient
        .from("locations")
        .update(preparedData)
        .eq("id", locationData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (locationId: number) => {
      const { error } = await supabaseClient
        .from("locations")
        .delete()
        .eq("id", locationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  return {
    createLocation: createLocationMutation.mutateAsync,
    updateLocation: updateLocationMutation.mutateAsync,
    deleteLocation: deleteLocationMutation.mutateAsync,
    isLoading:
      createLocationMutation.isPending ||
      updateLocationMutation.isPending ||
      deleteLocationMutation.isPending,
    error:
      createLocationMutation.error ||
      updateLocationMutation.error ||
      deleteLocationMutation.error,
  };
}
