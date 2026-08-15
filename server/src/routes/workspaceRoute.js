import express from 'express';
import { getWorkspaces, createWorkspace, updateWorkspace, joinWorkspace, leaveWorkspace, deleteWorkspace } from '../controllers/workspaceController.js';
import { authenticate, checkWorkspaceAccess } from '../controllers/authController.js';
import { getProjects, createProject } from '../controllers/projectController.js';
import projectRoute from './projectRoute.js';
import taskRoute from './taskRoute.js'
import statusRoute from './statusRoute.js'
const router = express.Router();

router.use(authenticate); // Protect all workspace routes
router.get('/get-workspaces', getWorkspaces);
router.post('/create-workspace', createWorkspace);
router.post('/join-workspace', joinWorkspace);
router.use('/:workspaceId', checkWorkspaceAccess);
router.put('/:workspaceId/update-workspace', updateWorkspace);
router.delete('/:workspaceId/leave-workspace', leaveWorkspace);
router.delete('/:workspaceId/delete-workspace', deleteWorkspace);
router.post('/:workspaceId/create-project', createProject);
router.get('/:workspaceId/get-projects', getProjects);
router.use('/:workspaceId/projects', projectRoute);
router.use('/:workspaceId/tasks', taskRoute)
router.use('/:workspaceId/statuses', statusRoute);

export default router;