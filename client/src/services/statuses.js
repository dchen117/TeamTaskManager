import api from '../services/api.js';

async function getStatuses({workspaceId, projectId}) {
  const res = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/get-statuses`
  );
  return res.data;
}

async function createStatus({ workspaceId, projectId, data }) {
  const res = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/create-status`,
    data,
  );
  return res.data;
}

async function updateStatus({ workspaceId, statusId, data }) {
  const res = await api.put(
    `/workspaces/${workspaceId}/statuses/${statusId}/update-status`,
    data
  );
  return res.data;
}

async function deleteStatus({ workspaceId, statusId, data = {} }) {
  const res = await api.delete(
    `/workspaces/${workspaceId}/statuses/${statusId}/delete-status`,
    { data }
  )
  return res.data;
}

export { getStatuses, createStatus, updateStatus, deleteStatus };