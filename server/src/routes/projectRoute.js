import express from 'express';
import { createProject, deleteProject, updateProject } from '../controllers/projectController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
import { createTask, getTasks } from '../controllers/taskController.js';
import { getStatuses, createStatus } from '../controllers/statusController.js'
const router = express.Router({mergeParams: true});

router.use(authenticate); // Protect all project routes
// router.delete('/:projectId/delete-project', authenticate, requireRole(ROLES.ADMIN), deleteProject);
router.delete('/:projectId/delete-project', deleteProject);
router.put('/:projectId/update-project', updateProject)
router.get('/:projectId/get-tasks', getTasks);
router.post('/:projectId/create-task', createTask);
router.get('/:projectId/get-statuses', getStatuses)
router.post('/:projectId/create-status', createStatus);

export default router;