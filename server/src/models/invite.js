import mongoose from 'mongoose';
const inviteSchema = new mongoose.Schema({
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        required: true
    },
    token: { type: String, required: true },
    expiry: { type: Date, required: true },
});

export default mongoose.model('Invite', inviteSchema);