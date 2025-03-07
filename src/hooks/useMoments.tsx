import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@/db/supabaseClient";
import { prepareEntityForDB } from "@/utils/dbUtils";
import type { MomentInsert, MomentUpdate } from "@/db/db_types";

export function useMoments() {
  const queryClient = useQueryClient();

  const connectMomentMutation = useMutation({
    mutationFn: async (params: {
      momentId: number;
      entityId: number;
      entityType: "pet" | "location";
    }) => {
      const { momentId, entityId, entityType } = params;
      const tableName =
        entityType === "pet" ? "pet_moments" : "location_moments";

      const { error } = await supabaseClient.from(tableName).insert([
        {
          moment_id: momentId,
          [`${entityType}_id`]: entityId,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const disconnectMomentMutation = useMutation({
    mutationFn: async (params: {
      momentId: number;
      entityId: number;
      entityType: "pet" | "location";
    }) => {
      const { momentId, entityId, entityType } = params;
      const tableName =
        entityType === "pet" ? "pet_moments" : "location_moments";

      const query = supabaseClient
        .from(tableName)
        .delete()
        .eq("moment_id", momentId)
        .eq(`${entityType}_id`, entityId);

      console.log('Executing query:', query);
      
      const { error } = await query;

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const createMomentMutation = useMutation({
    mutationFn: async (momentData: MomentInsert) => {
      const preparedData = prepareEntityForDB(momentData);
      const { data, error } = await supabaseClient
        .from("moments")
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

  const updateMomentMutation = useMutation({
    mutationFn: async (momentData: MomentUpdate) => {
      if (!momentData.id) throw new Error("Moment ID is required");

      const preparedData = prepareEntityForDB(momentData);
      const { data, error } = await supabaseClient
        .from("moments")
        .update(preparedData)
        .eq("id", momentData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  const deleteMomentMutation = useMutation({
    mutationFn: async (momentId: number) => {
      const { error } = await supabaseClient
        .from("moments")
        .delete()
        .eq("id", momentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyData"] });
    },
  });

  return {
    connectMoment: (
      momentId: number,
      entityId: number,
      entityType: "pet" | "location"
    ) => connectMomentMutation.mutateAsync({ momentId, entityId, entityType }),
    disconnectMoment: (
      momentId: number,
      entityId: number,
      entityType: "pet" | "location"
    ) =>
      disconnectMomentMutation.mutateAsync({ momentId, entityId, entityType }),
    createMoment: createMomentMutation.mutateAsync,
    updateMoment: updateMomentMutation.mutateAsync,
    deleteMoment: deleteMomentMutation.mutateAsync,
    isLoading:
      connectMomentMutation.isPending ||
      disconnectMomentMutation.isPending ||
      createMomentMutation.isPending ||
      updateMomentMutation.isPending ||
      deleteMomentMutation.isPending,
    error:
      connectMomentMutation.error ||
      disconnectMomentMutation.error ||
      createMomentMutation.error ||
      updateMomentMutation.error ||
      deleteMomentMutation.error,
  };
}
