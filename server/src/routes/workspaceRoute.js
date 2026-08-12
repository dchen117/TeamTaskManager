import express from 'express';
import { getWorkspaces, createWorkspace, updateWorkspace, joinWorkspace, leaveWorkspace, deleteWorkspace } from '../controllers/workspaceController.js';
import { authenticate, checkWorkspaceAccess } from '../controllers/authController.js';
import { getProjects, createProject } from '../controllers/projectController.js';
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

export default router;