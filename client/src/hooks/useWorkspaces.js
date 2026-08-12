import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace } from "../services/workspaces";

export function useWorkspaces() {
  const queryClient = useQueryClient();

  // READ
  const workspacesQuery = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces
  });

  // WRITE
  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,

    onSuccess: ({workspace}) => {
      queryClient.setQueryData(["workspaces"], (workspaces = []) => [...workspaces, workspace]);
      queryClient.invalidateQueries({
        queryKey: ["workspaces"]
      });
    }
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: updateWorkspace,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"]
      });
    }
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"]
      });
    }
  });

  return {
    ...workspacesQuery,
    createWorkspace: createWorkspaceMutation.mutate,
    createWorkspaceAsync: createWorkspaceMutation.mutateAsync,
    isCreating: createWorkspaceMutation.isPending,
    updateWorkspace: updateWorkspaceMutation.mutate,
    isUpdating: updateWorkspaceMutation.isPending,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    deleteWorkspaceAsync: deleteWorkspaceMutation.mutateAsync,
    isDeleting: deleteWorkspaceMutation.isPending
  };
}