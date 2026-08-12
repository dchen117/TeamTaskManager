import api from '../services/api.js';

async function getStatuses(projectId) {
  const res = await api.get(
    `/projects/${projectId}/get-statuses`
  );
  return res.data;
}

async function createStatus({ projectId, data }) {
  const res = await api.post(
    `/projects/${projectId}/create-status`,
    data,
  );
  return res.data;
}

async function updateStatus({ statusId, data }) {
  const res = await api.put(
    `/statuses/${statusId}/update-status`,
    data
  );
  return res.data;
}

async function deleteStatus({ statusId, data = {} }) {
  const res = await api.delete(
    `/statuses/${statusId}/delete-status`,
    { data }
  )
  return res.data;
}

export { getStatuses, createStatus, updateStatus, deleteStatus };