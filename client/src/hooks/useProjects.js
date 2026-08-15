import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, deleteProject, updateProject } from "../services/projects";

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
    mutationFn: (data) => createProject({workspaceId, data}),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects", workspaceId]
      });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({projectId, data}) => updateProject({workspaceId, projectId, data}),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", workspaceId],
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId) => deleteProject({workspaceId, projectId}),
    onSettled: () => {
      // Make sure cache matches server
      queryClient.invalidateQueries({
        queryKey: ["projects", workspaceId],
      });
    },
  })

  return {
    ...projectsQuery,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,
  }
}