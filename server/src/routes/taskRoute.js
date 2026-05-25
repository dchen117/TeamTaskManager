import express from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
const router = express.Router();

router.use(authenticate); // Protect all task routes

// Editor routes
router.use(requireRole(ROLES.editor));
router.put('/update-task/:taskId', updateTask);
router.post('/create-task', createTask);
router.delete('/delete-task/:taskId', deleteTask);

export default router;