import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: {
        type: String,
        required: true
    },
    description: String,
    statusId: {type: mongoose.Schema.Types.String, ref: 'Project.statuses', required: true},
    dueDate: Date,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    order: { type: String, required: true }
});

export default mongoose.model('Task', taskSchema);