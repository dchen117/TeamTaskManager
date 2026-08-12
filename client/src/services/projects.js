import api from "../services/api.js";

async function getProjects(workspaceId) {
  try {
    const res = await api.get(`/workspaces/${workspaceId}/get-projects`);
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

async function createProject({ workspaceId, data }) {
  try {
    const res = await api.post(
      `/workspaces/${workspaceId}/create-project`,
      data,
    );
    return res.data;
  } catch (error) {
    console.error("Error creating project: ", error);
  }
}

async function deleteProject(projectId) {
  try {
    const res = await api.delete(
      `/projects/${projectId}/delete-project`
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting project: ", error);
  }
}

async function updateProject({ projectId, data}) {
  try {
    const res = await api.put(
      `/projects/${projectId}/update-project`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error updating project: ", error);
  }
}

export { getProjects, createProject, deleteProject, updateProject };