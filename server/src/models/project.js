import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);