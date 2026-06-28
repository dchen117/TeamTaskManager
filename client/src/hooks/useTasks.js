import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/tasks";

export function useTasks(projectId) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  })
};