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

export { getWorkspaces, createWorkspace };