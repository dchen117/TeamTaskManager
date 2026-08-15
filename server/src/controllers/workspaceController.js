import Workspace from '../models/workspace.js';
import WorkspaceMember from '../models/workspaceMember.js';
import Task from '../models/task.js';
import Status from '../models/status.js';
import Project from '../models/project.js';
import Invite from '../models/invite.js';
import mongoose from 'mongoose';

async function getWorkspaces(req, res) {
    const userId = req.userId;
    try {
        const memberships = await WorkspaceMember.find({ user: userId }).populate('workspace');
        const workspaces = memberships.map(membership => membership.workspace);
        res.json(workspaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createWorkspace(req, res) {
    const { name } = req.body;
    const userId = req.userId;
    try {
        const workspace = await Workspace.create({ name, createdBy: userId });
        await WorkspaceMember.create({ workspace: workspace._id, user: userId, role: 'owner' });
        res.status(201).json({ message: 'Workspace created successfully', workspace });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// async function deleteWorkspace(req, res) {
//     const { workspaceId } = req.params;
//     const userId = req.userId;
//     const session = await mongoose.startSession();
//     try {
//         await Project.find({ workspace: workspaceId }).then(async projects => {
//             for (const project of projects) {
//                 await Task.deleteMany({ project: project._id }, { session });
//                 await Status.deleteMany({ project: project._id }, { session });
//                 await Project.deleteOne({ _id: project._id }, { session });
//             }
//         });
//         await WorkspaceMember.deleteMany({ workspace: workspaceId }, { session });
//         await Workspace.deleteOne({ _id: workspaceId, createdBy: userId }, { session });
//         res.status(200).json({ message: 'Workspace deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     } finally {
//         await session.endSession();
//     }
// }

async function deleteWorkspace(req, res) {
    const { workspaceId } = req.params;
    const userId = req.userId;
    const session = await mongoose.startSession();
    try {
        await Task.deleteMany({ workspace: workspaceId }, { session });
        await Status.deleteMany({ workspace: workspaceId }, { session });
        await Project.deleteMany({ workspace: workspaceId }, { session });
        await WorkspaceMember.deleteMany({ workspace: workspaceId }, { session });
        await Workspace.deleteOne({ _id: workspaceId, createdBy: userId }, { session });
        res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.endSession();
    }
}

async function updateWorkspace(req, res) {
    const { workspaceId } = req.params;
    const { name } = req.body;
    try {
        const workspace = await Workspace.findByIdAndUpdate(workspaceId, { name }, { returnDocument: 'after'});
        res.json(workspace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function leaveWorkspace(req, res) {
    const { workspaceId } = req.params;
    const userId = req.userId;
    try {
        await WorkspaceMember.deleteOne({ workspace: workspaceId, user: userId });
        res.status(200).json({ message: 'Left workspace successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function sendInvite(req, res) {
    const { workspaceId, email, username, role } = req.body;
    if (!workspaceId || (!email && !username) || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const findUserBy = email ? { email } : { username };
    userId = (await User.findOne({ findUserBy }))._id;
    const token = crypto.randomBytes(32).toString('hex');
    await Invite.create({ 
        workspace: workspaceId, 
        user: userId,
        role, 
        token, 
        expiresAt: Date.now() + 7*24*60*60*1000
    });
    res.status(201).json({ token });
}

async function joinWorkspace(req, res) {
    const token = req.query.token;
    const invite = await Invite.findOne({ token });
    if (!invite || invite.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired invite' });
    } else if (invite.user.toString() !== req.userId) {
        return res.status(403).json({ error: 'You are not authorized to accept this invite' });
    }

    // update workspace memberships
    WorkspaceMember.create({ workspace: invite.workspace, user: invite.user, role: invite.role });
    await Invite.deleteOne({ token });
    res.json({ message: 'Invite accepted successfully' });
}

export { getWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace, leaveWorkspace, sendInvite, joinWorkspace };