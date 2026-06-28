import express from 'express';
import { getWorkspaces, createWorkspace, joinWorkspace, leaveWorkspace } from '../controllers/workspaceController.js';
import { authenticate } from '../controllers/authController.js';
import { getProjects, createProject } from '../controllers/projectController.js';
const router = express.Router();

router.use(authenticate); // Protect all workspace routes
router.get('/get-workspaces', getWorkspaces);
router.post('/create-workspace', createWorkspace);
router.post('/join-workspace', joinWorkspace);
router.get('/:workspaceId/leave-workspace', leaveWorkspace);
router.post('/:workspaceId/create-project', createProject);
router.get('/:workspaceId/get-projects', getProjects);

export default router;