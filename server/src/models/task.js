import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: String,
    dueDate: Date,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);