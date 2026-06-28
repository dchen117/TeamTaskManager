import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, getWorkspaces } from "../services/workspaces";

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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"]
      });
    }
  });

  return {
    ...workspacesQuery,
    createWorkspace: createWorkspaceMutation.mutate,
    isCreating: createWorkspaceMutation.isPending
  };
}