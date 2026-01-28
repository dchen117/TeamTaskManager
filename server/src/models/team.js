import mongoose from 'mongoose';
const teamSchema = new mongoose.Schema({
    name: String,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Team', teamSchema);