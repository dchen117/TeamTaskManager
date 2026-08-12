import Project from '../models/project.js';
import Status from '../models/status.js';
import Task from '../models/task.js'
import mongoose from 'mongoose';

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
    const session = await mongoose.startSession();
    try {
        let project;
        await session.withTransaction(async () => { // Project is created with default statuses atomically
            [project] = await Project.create([{ name, description, workspace: workspaceId, createdBy: userId }], { session });
            const statuses = [
                { project: project._id, name: "To Do", order: 'a0' },
                { project: project._id, name: "In Progress", order: 'a1' },
                { project: project._id, name: "Done", order: 'a2' }
            ]
            await Status.insertMany(statuses, { session })
        })
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.endSession();
    }
}

async function deleteProject(req, res) {
    const { projectId } = req.params;
    const userId = req.userId;
    const session = await mongoose.startSession();
    try {
        await Task.deleteMany({ project: projectId }, { session });
        await Status.deleteMany({ project: projectId }, { session });
        await Project.deleteOne({ _id: projectId, createdBy: userId }, { session });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.endSession();
    }
}

function updateProject(req, res) {
    const { projectId } = req.params;
    const { name } = req.body;
    Project.findByIdAndUpdate(projectId, { name }, { returnDocument: 'after' })
        .then(project => res.json(project))
        .catch(error => res.status(500).json({ error: error.message }));
}

export { getProjects, updateProject, createProject, deleteProject }