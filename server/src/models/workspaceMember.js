import mongoose from "mongoose";
const workspaceMemberSchema = new mongoose.Schema({
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        required: true
    },
    joinedAt: { type: Date, default: Date.now }
});
export default mongoose.model('WorkspaceMember', workspaceMemberSchema);