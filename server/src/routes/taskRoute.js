import express from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
const router = express.Router({ mergeParams: true });

router.use(authenticate); // Protect all task routes

// Editor routes
// router.use(requireRole(ROLES.editor));
router.put('/:taskId/update-task', updateTask);
router.delete('/:taskId/delete-task', deleteTask);

export default router;