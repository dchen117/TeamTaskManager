import api from '../services/api.js';

async function getTasks(projectId) {
  const res = await api.get(
    `/projects/${projectId}/get-tasks`
  );
  return res.data;
}

async function createTask({ projectId, data }) {
  const res = await api.post(
    `/projects/${projectId}/create-task`,
    data,
  );
  return res.data;
}

async function updateTask({ taskId, data }) {
  const res = await api.put(
    `/tasks/${taskId}/update-task`,
    data
  );
  return res.data;
}

async function deleteTask(taskId) {
  const res = await api.delete(
    `/tasks/${taskId}/delete-task`
  )
  return res.data;
}

export { getTasks, createTask, updateTask, deleteTask };