import api from '../services/api.js';

async function getTasks({ workspaceId, projectId }) {
  const res = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/get-tasks`
  );
  return res.data;
}

async function createTask({ workspaceId, projectId, data }) {
  const res = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/create-task`,
    data,
  );
  return res.data;
}

async function updateTask({ workspaceId, taskId, data }) {
  const res = await api.put(
    `/workspaces/${workspaceId}/tasks/${taskId}/update-task`,
    data
  );
  return res.data;
}

async function deleteTask({ workspaceId, taskId}) {
  const res = await api.delete(
    `/workspaces/${workspaceId}/tasks/${taskId}/delete-task`
  )
  return res.data;
}

export { getTasks, createTask, updateTask, deleteTask };