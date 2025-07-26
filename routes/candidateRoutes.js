import express from 'express';
import {
  getJobForApplication,
  submitJobApplication,
  getApplicationStatus,
  upload
} from '../controllers/candidateController.js';

const router = express.Router();

// Full descriptive URL routes (like Naukri.com)
router.get('/job-listings/:slug', getJobForApplication);
router.post('/job-listings/:slug/apply', upload.single('resume'), submitJobApplication);

// Application status
router.get('/application/:applicationId', getApplicationStatus);

export default router; 