import mongoose from 'mongoose';
const membershipSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    role: { // 'admin', 'member', 'viewer'
        type: String,
        required: true
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    teams: { // key: teamId, value: membership details
        type: Map,
        of: membershipSchema,
    },
    createdAt: { type: Date, default: Date.now },
    refreshToken: String
});

export default mongoose.model('User', userSchema);