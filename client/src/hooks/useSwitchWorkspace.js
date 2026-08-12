import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProjects } from "@/services/projects";

export function useSwitchWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const switchWorkspace = async (workspaceId) => {
    await queryClient.fetchQuery({
      queryKey: ["projects", workspaceId],
      queryFn: () => getProjects(workspaceId),
    });

    navigate(`/home/${workspaceId}`);
  };

  return switchWorkspace;
}