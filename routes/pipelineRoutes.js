import express from 'express';
import { updateCandidateJobStatus } from '../controllers/pipelineController.js';

const router = express.Router();

// Update candidate status for a specific job
router.put('/update-status', updateCandidateJobStatus);

export default router; 