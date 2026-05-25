import Task from '../models/task.js';

function createTask(req, res) {
    const { title, description, status, projectId } = req.body;
    if (!title || !projectId) {
        return res.status(400).json({ error: 'Title and projectId are required' });
    }
    Task.create({ title, description, status, project: projectId })
        .then(task => res.status(201).json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function assignTask(req, res) {
    const { taskId, userId } = req.body;
    if (!taskId || !userId) {
        return res.status(400).json({ error: 'taskId and userId are required' });
    }
    Task.findByIdAndUpdate(taskId, { $push: { assignedTo: userId } }, { new: true })
        .then(task => res.json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function updateTask(req, res) {
    const { taskId } = req.params;
    const { title, description, status } = req.body;
    Task.findByIdAndUpdate(taskId, { title, description, status }, { new: true })
        .then(task => res.json(task))
        .catch(error => res.status(500).json({ error: error.message }));
}

function deleteTask(req, res) {
    const { taskId } = req.params;
    Task.findByIdAndDelete(taskId)
        .then(() => res.json({ message: 'Task deleted successfully' }))
        .catch(error => res.status(500).json({ error: error.message }));
}

export { createTask, assignTask, updateTask, deleteTask };