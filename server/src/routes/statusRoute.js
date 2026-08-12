import express from 'express';
import { updateStatus, deleteStatus } from '../controllers/statusController.js';
import { authenticate, ROLES, requireRole } from '../controllers/authController.js';
const router = express.Router({ mergeParams: true });

router.use(authenticate); // Protect all task routes

// Editor routes
// router.use(requireRole(ROLES.editor));
router.put('/:statusId/update-status', updateStatus);
router.delete('/:statusId/delete-status', deleteStatus);

export default router;