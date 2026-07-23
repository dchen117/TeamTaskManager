import { useParams } from "react-router-dom";
import { useProjects } from "./useProjects";

export function useCurrentProject() {
  const { workspaceId, projectId } = useParams();
  const { data: projects } = useProjects(workspaceId);

  return projects?.find(
    p => p._id === projectId
  );
}