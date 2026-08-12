import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatuses, createStatus, updateStatus, deleteStatus } from "../services/statuses";

export function useStatuses(projectId) {
  const queryClient = useQueryClient();

  // add an id field for dnd-kit's move helper
  const selectStatuses = (statuses) => statuses.map(status => ({...status, id: status._id}))

  // READ
  const statusesQuery = useQuery({
    queryKey: ["statuses", projectId],
    queryFn: () => getStatuses(projectId),
    enabled: !!projectId,
    select: selectStatuses
  })

  // WRITE
  const createStatusMutation = useMutation({
    mutationFn: createStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["statuses", projectId]
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["statuses", projectId],
      });
    },
  });

  const deleteStatusMutation = useMutation({
    mutationFn: deleteStatus,
    onMutate: async ({ statusId, data = {} }) => {
      const { deleteItemsOnly = false } = data;
      await queryClient.cancelQueries({
        queryKey: ["statuses", projectId],
      });
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });
      // store current statuses and tasks in case rollback is needed
      const previousStatuses = queryClient.getQueryData(["statuses", projectId]);
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);
      // Optimistically remove status and tasks
      if (!deleteItemsOnly) {
          queryClient.setQueryData(
            ["statuses", projectId],
            (oldStatuses) => {
              return oldStatuses?.filter((status) => status._id !== statusId)
            }
          );
      }
      queryClient.setQueryData(
        ["tasks", projectId],
        (tasks) => tasks?.filter((task) => task.statusId !== statusId)
      )
      return { previousStatuses, previousTasks };
    },

    onError: (_error, _statusId, context) => {
      // Restore the statuses and tasks if deletion failed
      queryClient.setQueryData(
        ["statuses", projectId],
        context?.previousStatuses
      );
      queryClient.setQueryData(
        ["tasks", projectId],
        context?.previousTasks
      )
    },

    onSettled: () => {
      // Make sure cache matches server
      queryClient.invalidateQueries({
        queryKey: ["statuses", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId]
      });
    },
  })

  return {
    ...statusesQuery,
    createStatus: createStatusMutation.mutate,
    isCreating: createStatusMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    deleteStatus: deleteStatusMutation.mutate,
    isDeleting: deleteStatusMutation.isPending,
  }
};