import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../services/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask } from "../services/tasks";

export function useTasks(projectId) {
  const queryClient = useQueryClient();

  // add an id field for dnd-kit's move helper
  const selectTasks = (tasks) => tasks.map(task => ({...task, id: task._id}))

  // READ
  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
    select: selectTasks
  })

  // WRITE
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId]
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });
      const previousTasks = queryClient.getQueryData([
        "tasks",
        projectId,
      ]);
      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      // Roll back if the request fails
      queryClient.setQueryData(
        ["tasks", projectId],
        context.previousTasks
      );
    },
    onSettled: () => {
      // Make sure cache matches server
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  return {
    ...tasksQuery,
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,
  }
};