import express from 'express';
import { login, register, logout, refresh } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/refresh-token', refresh);

export default router;