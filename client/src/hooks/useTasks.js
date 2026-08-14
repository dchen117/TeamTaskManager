import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../services/tasks";

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
    onSettled: () => {
      // Make sure cache matches server
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });
      // store current tasks in case rollback is needed
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);
      // Optimistically remove task
      queryClient.setQueryData(
        ["tasks", projectId],
        (oldTasks) => {
          return oldTasks?.filter((task) => task._id !== taskId)
        }
      );
      return { previousTasks };
    },

    onError: (_error, _taskId, context) => {
      // Restore the tasks if deletion failed
      queryClient.setQueryData(
        ["tasks", projectId],
        context?.previousTasks
      );
    },

    onSettled: () => {
      // Make sure cache matches server
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  })

  return {
    ...tasksQuery,
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
  }
};