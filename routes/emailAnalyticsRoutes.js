import express from 'express';
import { getEmailAnalytics } from '../controllers/emailAnalyticsController.js';

const router = express.Router();

// GET /api/email-analytics - Get comprehensive email analytics for the entire project
router.get('/', getEmailAnalytics);

export default router;
