import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: {
        type: String,
        required: true
    },
    description: String,
    statusId: {type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true},
    dueDate: Date,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    order: { type: String, required: true }
});

taskSchema.index({ workspace: 1 });
taskSchema.index({ project: 1, order: 1 });

export default mongoose.model('Task', taskSchema);