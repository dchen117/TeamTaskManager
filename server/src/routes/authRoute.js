import express from 'express';
import { login, register, logout, deleteUser, refresh, userInfo } from '../controllers/authController.js';
import { authenticate } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refresh);
router.post('/logout', authenticate, logout);
router.get('/userInfo', authenticate, userInfo);
router.delete('/delete-user', authenticate, deleteUser);

export default router;