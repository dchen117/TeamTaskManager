import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import WorkspaceMember from '../models/workspaceMember.js';
import Workspace from '../models/workspace.js';
import Project from '../models/project.js'
import Status from '../models/status.js';
import Task from '../models/task.js'
import mongoose from 'mongoose'

/* TODO: Remove after deployment */
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(import.meta.dirname, "../config/.env") });
/* ----------------------------- */

function generateRefreshToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function refresh(req, res) {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (!err) {
        const user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(401).json({ error: 'User not found' });
        } else if (bcrypt.compareSync(refreshToken, user.refreshTokenHash)) {
          const accessToken = generateAccessToken(user);
          return res.json({ accessToken });
        }
      }
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  );
}

function authenticate(req, res, next) { // Middleware to authenticate access tokens
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
    if (err) return res.sendStatus(401);
    req.userId = payload.userId;
    next();
  });
}

async function checkWorkspaceAccess(req, res, next) {
  const userId = req.userId;
  const { workspaceId } = req.params;
  const membership = await WorkspaceMember.findOne({ user: userId, workspace: workspaceId });
  if (!membership) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}

async function assignTokens(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
  await user.save();
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ accessToken });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  await assignTokens(user, res);
}

function register(req, res) {
  const { displayname, username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  } else if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long', errorCode: 'PASSWORD_TOO_SHORT' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  User.create({ displayname: displayname || username, username, email, passwordHash })
    .then(user => {
      assignTokens(user, res);
    })
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username or email already in use', errorCode: 'USER_EXISTS' });
      }
      res.status(500).json({ error: error.message });
    });
}

async function logout(req, res) { // requires authenticate middleware
  const user = await User.findById(req.userId);
  user.refreshTokenHash = null;
  user.save();
  res.clearCookie('jwt', {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  });
  res.json({ message: 'Logged out successfully' });
}

// Currently deleteUser also deletes all workspaces owned by the user.
// TODO: Only delete workspaces with no members left, otherwise transfer ownership
async function deleteUser(req, res) {
  const userId = req.userId;
  const session = await mongoose.startSession();
  try {
    await Workspace.find({ createdBy: userId }).then(async workspaces => {
      for (const workspace of workspaces) {
        await Task.deleteMany({ workspace: workspace._id }, { session });
        await Status.deleteMany({ workspace: workspace._id }, { session });
        await Project.deleteMany({ workspace: workspace._id }, { session });
        await WorkspaceMember.deleteMany({ workspace: workspace._id }, { session });
      }
      await Workspace.deleteMany({ createdBy: userId }, { session });
      await User.deleteOne({ _id: userId }, { session });
    })
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  } finally {
      await session.endSession();
  }
}

async function userInfo(req, res) { // requires authenticate middleware
  const user = await User.findById(req.userId);
  res.json(user);
}

async function updateUser(req, res) {
  const { displayName } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { displayName }, { returnDocument: 'after' });
  res.json(user);
}

function requireRole(Role) {
  return (req, res, next) => {
    const userRoleLevel = ROLES[req.user.role]
    const requiredLevel = ROLES[Role]

    if (userRoleLevel < requiredLevel) {
      return res.status(403).json({ message: "Forbidden" })
    }

    next()
  }
}

const ROLES = {
  viewer: 1, // can only view content
  editor: 2, // can view and edit content
  admin: 3, // can view, edit, and manage users (except owners)
  owner: 4 // has full control, including managing admins and deleting workspace
}

export { login, register, logout, refresh, deleteUser, updateUser, userInfo, authenticate, checkWorkspaceAccess, requireRole, ROLES };