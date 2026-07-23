import express from 'express';
import { createProject, deleteProject, updateStatus } from '../controllers/projectController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
import { createTask, getTasks } from '../controllers/taskController.js';
const router = express.Router();

router.use(authenticate); // Protect all project routes
router.delete('/:projectId/delete-project', authenticate, requireRole(ROLES.ADMIN), deleteProject);
router.post('/:projectId/create-task', createTask);
router.get('/:projectId/get-tasks', getTasks);
router.put('/:projectId/:statusId/update-status', updateStatus);

export default router;