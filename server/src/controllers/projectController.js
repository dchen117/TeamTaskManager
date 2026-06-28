import Project from '../models/project.js'

async function getProjects(req, res) {
    const { workspaceId } = req.params;
    try {
        const projects = await Project.find({ workspace: workspaceId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createProject(req, res) {
    const { name, description } = req.body;
    const { workspaceId } = req.params;
    const userId = req.userId;
    try {
        const project = await Project.create({ name, description, workspace: workspaceId, createdBy: userId });
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteProject(req, res) {
    const { projectId } = req.params;
    const userId = req.userId;
    try {
        await Project.deleteOne({ _id: projectId, createdBy: userId });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getProjects, createProject, deleteProject }