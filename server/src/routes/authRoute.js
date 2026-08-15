import express from 'express';
import { login, register, logout, updateUser, deleteUser, refresh, userInfo } from '../controllers/authController.js';
import { authenticate } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refresh);
router.use(authenticate)
router.post('/logout', logout);
router.get('/userInfo', userInfo);
router.put('/update-user', updateUser);
router.delete('/delete-user', deleteUser);

export default router;