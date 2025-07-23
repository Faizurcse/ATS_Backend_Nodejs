import express from 'express';
import { createJobPost, getJobPosts, updateJobPost, deleteJobPost } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post-job', createJobPost);
router.get('/get-jobs', getJobPosts);
router.put('/update-job/:id', updateJobPost);
router.delete('/delete-job/:id', deleteJobPost);

export default router;
