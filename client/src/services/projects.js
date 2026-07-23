import api from "../services/api.js";
import { generateKeyBetween } from "fractional-indexing";

async function getProjects(workspaceId) {
  try {
    const res = await api.get(`/workspaces/${workspaceId}/get-projects`);
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

async function createProject({ workspaceId, data }) {
  // set default statuses
  const first = generateKeyBetween(null, null);
  const second = generateKeyBetween(first, null);
  const third = generateKeyBetween(second, null);
  data.statuses = [
    { name: "To Do", order: first },
    { name: "In Progress", order: second },
    { name: "Done", order: third}
  ]
  try {
    const res = await api.post(
      `/workspaces/${workspaceId}/create-project`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

export { getProjects, createProject };