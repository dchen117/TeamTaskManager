import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "../services/projects";

export function useProjects(workspaceId) {
  const queryClient = useQueryClient();

  // READ
  const projectsQuery = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId),
    enabled: !!workspaceId,
  });

  // WRITE
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", workspaceId]
      });
    }
  });

  return {
    ...projectsQuery,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending
  }
}