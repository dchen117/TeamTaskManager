import api from '../services/api.js';

export async function getTasks(projectId) {
  const res = await api.get(
    `/projects/${projectId}/tasks`
  );
  return res.data;
}