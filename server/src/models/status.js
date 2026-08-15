import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    order: { type: String, required: true }
});

statusSchema.index({ workspace: 1 });
statusSchema.index({ project: 1, order: 1 });

export default mongoose.model('Status', statusSchema);