import express from 'express';
import { 
  getDashboardData,
  getQuickStats
} from '../controllers/dashboardController.js';

const router = express.Router();

// Get comprehensive dashboard data
router.get('/', getDashboardData);

// Get quick stats for dashboard widgets
router.get('/quick-stats', getQuickStats);

export default router; 