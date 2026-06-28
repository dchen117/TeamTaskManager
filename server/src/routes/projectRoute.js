import express from 'express';
import { createProject, deleteProject } from '../controllers/projectController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
import { createTask } from '../controllers/taskController.js';
const router = express.Router();

router.use(authenticate); // Protect all project routes
router.delete('/:projectId/delete-project', authenticate, requireRole(ROLES.ADMIN), deleteProject);
router.post('/:projectId/create-task', createTask);

export default router;