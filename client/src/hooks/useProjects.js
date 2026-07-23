import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "../services/projects";
import { updateStatus } from "@/services/tasks";

export function useProjects(workspaceId) {
  const queryClient = useQueryClient();

  // add an id field for dnd-kit's move helper
  const selectProjects = (projects) =>
      projects.map(project => ({
        ...project,
        statuses: (project.statuses ?? []).map(status => ({
          ...status,
          id: status._id,
        })),
      }))

  // READ
  const projectsQuery = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId),
    enabled: !!workspaceId,
    select: selectProjects
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

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: (updatedProject, variables) => {
      queryClient.setQueryData(
        ["projects", variables.workspaceId],
        projects =>
          projects?.map(project =>
            project._id === updatedProject._id
              ? updatedProject
              : project
          )
      );
    }
  })

  return {
    ...projectsQuery,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    updateStatus: updateStatusMutation.mutate
  }
}