import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    displayName: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    refreshToken: String
});

export default mongoose.model('User', userSchema);