import { Router } from 'express';
import { createAssignment, getAssignmentStatus } from '../controllers/assignmentController';

const router = Router();

// Route: POST /api/assignments/create
router.post('/create', createAssignment);

// Route: GET /api/assignments/:id/status
router.get('/:id/status', getAssignmentStatus);

export default router;
