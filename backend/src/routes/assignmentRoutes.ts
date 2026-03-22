import { Router } from 'express';
import { createAssignment } from '../controllers/assignmentController';

const router = Router();

// Route: POST /api/assignments/create
// Description: Receives frontend form data and puts it into the AI Queue
router.post('/create', createAssignment);

export default router;
