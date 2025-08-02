import express from 'express';
import {
  getJobForApplication,
  submitJobApplication,
  getApplicationStatus,
  getAllCandidates,
  getCandidateById,
  downloadResume,
  getAllCandidatesComplete,
  upload
} from '../controllers/candidateController.js';
import { getAllCandidatesPipelineStatus } from '../controllers/pipelineController.js';

const router = express.Router();

// Full descriptive URL routes (like Naukri.com)
router.get('/job-listings/:slug', getJobForApplication);
router.post('/job-listings/:slug/apply', upload.single('resume'), submitJobApplication);

// Application status
router.get('/application/:applicationId', getApplicationStatus);

// ========================================
// NEW CANDIDATE MANAGEMENT ENDPOINTS
// ========================================

/**
 * GET /api/candidates
 * 
 * Retrieves a paginated list of all candidates with their applied jobs and resume download URLs.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of candidates per page (default: 10)
 * - status: Filter by application status (pending, shortlisted, rejected, hired, all)
 * - search: Search in firstName, lastName, email, or keySkills
 * 
 * Returns:
 * - candidates: Array of candidate objects with applied jobs
 * - pagination: Pagination metadata
 * 
 * Example: GET /api/candidates?page=1&limit=5&status=pending&search=developer
 */
router.get('/candidates', getAllCandidates);

/**
 * GET /api/candidates/all
 * 
 * Retrieves ALL candidates data without pagination - returns everything in one request.
 * This endpoint gives you complete candidate information with all their applications.
 * 
 * Returns:
 * - All candidates with complete profiles
 * - All applied jobs for each candidate
 * - Resume download URLs
 * - Total counts and statistics
 * 
 * Example: GET /api/candidates/all
 */
router.get('/candidates/all', getAllCandidatesComplete);

/**
 * GET /api/candidates/pipeline
 * 
 * Retrieves ALL candidates data with their pipeline status information.
 * This endpoint provides complete candidate information including their current
 * pipeline status for each job application, interview schedules, and pipeline statistics.
 * 
 * Returns:
 * - All candidates with complete profiles
 * - Pipeline status for each application
 * - Interview schedules for each candidate
 * - Pipeline statistics and breakdown
 * - Resume download URLs
 * 
 * Example: GET /api/candidates/pipeline
 */
router.get('/candidates/pipeline', getAllCandidatesPipelineStatus);

/**
 * GET /api/candidates/:candidateId
 * 
 * Retrieves detailed information about a specific candidate including all their job applications.
 * 
 * Path Parameters:
 * - candidateId: The ID of the candidate
 * 
 * Returns:
 * - Complete candidate profile
 * - All applied jobs with application status
 * - Resume download URL
 * - Total number of applications
 * 
 * Example: GET /api/candidates/1
 */
router.get('/candidates/:candidateId', getCandidateById);

/**
 * GET /api/candidates/:candidateId/resume
 * 
 * Downloads the resume file for a specific candidate.
 * 
 * Path Parameters:
 * - candidateId: The ID of the candidate
 * 
 * Features:
 * - Supports multiple file types (PDF, DOC, DOCX, images)
 * - Sets proper content-type headers
 * - Streams file for efficient downloads
 * - Handles missing files gracefully
 * 
 * Example: GET /api/candidates/1/resume
 * 
 * Response:
 * - Success: File download with appropriate headers
 * - Error: JSON error message if file not found
 */
router.get('/candidates/:candidateId/resume', downloadResume);

export default router; 