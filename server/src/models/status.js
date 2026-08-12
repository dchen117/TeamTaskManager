import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    order: { type: String, required: true }
});

export default mongoose.model('Status', statusSchema);