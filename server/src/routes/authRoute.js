import express from 'express';
import { login, register, logout, refresh, userInfo } from '../controllers/authController.js';
import { authenticate } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refresh);
router.post('/logout', authenticate, logout);
router.get('/userInfo', authenticate, userInfo);

export default router;