import express from 'express';
import { getAllAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// GET /api/analytics - Get comprehensive analytics for the entire project
router.get('/', getAllAnalytics);

export default router; 