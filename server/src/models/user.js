import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    displayName: { 
        type: String,
        default: function() {
            return this.username;
        } 
    },
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
    refreshTokenHash: String
});

export default mongoose.model('User', userSchema);