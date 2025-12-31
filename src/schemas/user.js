const mongoose = import('mongoose');
const membershipSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    passwordHash: String,
    teams: { // key: teamId, value: membership details
        type: Map,
        of: membershipSchema
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);