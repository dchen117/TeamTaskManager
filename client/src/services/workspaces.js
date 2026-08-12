// api/workspaces.js

import api from "../services/api.js";

async function getWorkspaces() {
  try {
    const res = await api.get("/workspaces/get-workspaces");
    return res.data;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
  }
}

async function createWorkspace(workspaceData) {
  try {
    const res = await api.post("/workspaces/create-workspace", workspaceData);
    return res.data;
  } catch (error) {
    console.error("Error creating workspace:", error);
  }
}

async function updateWorkspace({workspaceId, data}) {
  try {
    const res = await api.put(`/workspaces/${workspaceId}/update-workspace`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating workspace:", error);
  }
}

async function deleteWorkspace(workspaceId) {
  try {
    const res = await api.delete(`/workspaces/${workspaceId}/delete-workspace`);
    return res.data;
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
}
export { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace };