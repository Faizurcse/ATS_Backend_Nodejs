import express from 'express';
import { 
  createJobPost, 
  getJobPosts, 
  updateJobPost, 
  deleteJobPost,
  updateJobStatus,
  getJobsByStatus
} from '../controllers/jobController.js';

const router = express.Router();

router.post('/post-job', createJobPost);
router.get('/get-jobs', getJobPosts);
router.get('/get-jobs/status/:status', getJobsByStatus);
router.put('/update-job/:id', updateJobPost);
router.patch('/update-job-status/:id', updateJobStatus);
router.delete('/delete-job/:id', deleteJobPost);

export default router;
