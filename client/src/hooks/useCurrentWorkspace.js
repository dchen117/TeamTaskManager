import { useParams } from "react-router-dom";
import { useWorkspaces } from "./useWorkspaces";

export function useCurrentWorkspace() {
  const { workspaceId } = useParams();
  const { data: workspaces } = useWorkspaces();

  return workspaces?.find(
    w => w._id === workspaceId
  );
}