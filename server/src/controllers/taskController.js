import Task from '../models/task.js';

function getTasks(req, res) {
    const { projectId } = req.params;
    Task.find({ project: projectId })
        .sort({ order: 1 })
        .then(tasks => res.status(200).json(tasks))
        .catch(error => res.status(500).json({ error: error.message }));
}

function createTask(req, res) {
    const { title, description, statusId, order } = req.body;
    const { workspaceId, projectId } = req.params;
    if (!title || !projectId || !statusId || !order) {
        return res.status(400).json({ error: 'Title, projectId, statusId, and order are required' });
    }
    Task.create({ title, description, statusId, workspace: workspaceId, project: projectId, order })
        .then(task => res.status(201).json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function assignTask(req, res) {
    const { taskId, userId } = req.body;
    if (!taskId || !userId) {
        return res.status(400).json({ error: 'taskId and userId are required' });
    }
    Task.findByIdAndUpdate(taskId, { $push: { assignedTo: userId } }, { returnDocument: 'after' })
        .then(task => res.json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function updateTask(req, res) {
    const { taskId } = req.params;
    const { title, description, statusId, order } = req.body;
    Task.findByIdAndUpdate(taskId, { title, description, statusId, order }, { returnDocument: 'after' })
        .then(task => res.json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function deleteTask(req, res) {
    const { taskId } = req.params;
    Task.findByIdAndDelete(taskId)
        .then(() => res.json({ message: 'Task deleted successfully' }))
        .catch(error => res.status(500).json({ error: error.message }));
}

export { getTasks, createTask, assignTask, updateTask, deleteTask };