import Status from '../models/status.js';
import Task from '../models/task.js'
import mongoose from 'mongoose';

function getStatuses(req, res) {
    const { projectId } = req.params;
    Status.find({ project: projectId })
        .sort({ order: 1 })
        .then(statuses => res.status(200).json(statuses))
        .catch(error => res.status(500).json({ error: error.message }));
}

function createStatus(req, res) {
    const { projectId } = req.params;
    const { name, order } = req.body;
    Status.create({ project: projectId, name, order})
        .then(status => res.json(status))
        .catch(error => res.status(500).json({ error: error.message }));
}

async function updateStatus(req, res) {
    const { statusId } = req.params;
    const { name, order } = req.body;
    Status.findByIdAndUpdate(statusId, { name, order }, { returnDocument: 'after' })
        .then(status => res.json(status))
        .catch(error => res.status(500).json({ error: error.message }));
}

async function deleteStatus(req, res) {
    const { statusId } = req.params;
    const { deleteItemsOnly } = req.body;
    const session = await mongoose.startSession();
    try {
        await Task.deleteMany({ statusId }, { session });
        if (!deleteItemsOnly) await Status.findByIdAndDelete(statusId, { session });
        return res.json({ message: "status deleted" })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    } finally {
        await session.endSession();
    }
}

export { getStatuses, createStatus, updateStatus, deleteStatus }