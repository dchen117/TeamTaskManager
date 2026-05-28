import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';

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
        const user = await User.findById(decoded.id);
        if (user && bcrypt.compareSync(refreshToken, user.refreshTokenHash)) {
          const accessToken = generateAccessToken(user);
          return res.json({ accessToken });
        }
      }
      res.status(403).json({ error: 'Invalid refresh token' });
    });
}

function authenticate(req, res, next) { // Middleware to authenticate access tokens
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.userId = payload.userId;
    next();
  });
}

async function assignTokens(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
  await user.save();
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
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
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  User.create({ displayname: displayname || username, username, email, passwordHash })
    .then(user => {
      assignTokens(user, res);
    })
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username or email already in use' });
      }
      res.status(500).json({ error: error.message });
    });
}

async function logout(req, res) {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.sendStatus(204);
  }
  const user = await User.findOne({ refreshToken });
  user.refreshToken = null;
  user.save();
  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None' });
  res.json({ message: 'Logged out successfully' });
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

export { login, register, logout, refresh, authenticate, requireRole, ROLES };