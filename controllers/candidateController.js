import prisma from '../prismaClient.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendJobApplicationEmail, sendNewApplicationNotification } from '../utils/mailer.js';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Use consistent candidate_user folder for all resumes
    const candidateFolder = `${uploadDir}/candidate_user`;
    if (!fs.existsSync(candidateFolder)) {
      fs.mkdirSync(candidateFolder, { recursive: true });
    }
    
    cb(null, candidateFolder);
  },
  filename: function (req, file, cb) {
    // Create filename with timestamp only for consistency
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const fileName = `resume_${timestamp}${fileExtension}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow PDF, DOC, DOCX, and image files
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and images are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to create SEO-friendly slug (same as in jobController)
const createJobSlug = (job) => {
  const title = job.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const company = job.company.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const location = job.city.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const experience = job.experienceLevel ? 
    job.experienceLevel.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() : 
    'freshers';
  
  const jobType = job.jobType ? 
    job.jobType.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() : 
    'full-time';
  
  // Create full descriptive URL like Naukri.com
  return `job-listings-${title}-${experience}-${jobType}-${company}-${location}-${job.id}`;
};

// Get job details for application form (full descriptive URL)
export const getJobForApplication = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Extract job ID from the end of the slug
    const jobId = parseInt(slug.split('-').pop());
    
    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid job URL' });
    }

    const job = await prisma.ats_JobPost.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify the slug matches the job
    const expectedSlug = createJobSlug(job);
    if (slug !== expectedSlug) {
      // Redirect to correct URL for SEO
      return res.redirect(`/api/job-listings/${expectedSlug}`);
    }

    res.status(200).json({
      job,
      applicationUrl: `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/api/job-listings/${slug}/apply`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job details', error: error.message });
  }
};

// Submit job application with file upload
export const submitJobApplication = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Extract job ID from slug
    const jobId = parseInt(slug.split('-').pop());
    
    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid job URL' });
    }

    // Verify job exists
    const job = await prisma.ats_JobPost.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get form data
    const {
      firstName,
      lastName,
      email,
      phone,
      currentLocation,
      coverLetter,
      keySkills,
      salaryExpectation,
      noticePeriod,
      yearsOfExperience,
      remoteWork,
      startDate,
      portfolioUrl
    } = req.body;

    // Validate required fields
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      currentLocation: 'Current Location',
      coverLetter: 'Cover Letter',
      keySkills: 'Key Skills',
      salaryExpectation: 'Salary Expectation',
      noticePeriod: 'Notice Period',
      yearsOfExperience: 'Years of Experience',
      startDate: 'Start Date'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field] || req.body[field].trim() === '') {
        missingFields.push(label);
      }
    }

    // Check if resume file is uploaded
    if (!req.file) {
      missingFields.push('Resume');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Please fill all required fields',
        missingFields: missingFields,
        error: 'VALIDATION_ERROR'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
        error: 'INVALID_EMAIL'
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({
        message: 'Please enter a valid phone number',
        error: 'INVALID_PHONE'
      });
    }

    // Validate salary expectation
    if (isNaN(salaryExpectation) || parseInt(salaryExpectation) <= 0) {
      return res.status(400).json({
        message: 'Please enter a valid salary expectation',
        error: 'INVALID_SALARY'
      });
    }

    // Get resume file path
    const resumeFilePath = `${req.file.destination}/${req.file.filename}`;

    // Check for duplicate application
    const existingApplication = await prisma.candidateApplication.findFirst({
      where: {
        jobId: jobId,
        email: email.trim().toLowerCase()
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this job with this email address.',
        error: 'DUPLICATE_APPLICATION'
      });
    }

    // Create application
    const application = await prisma.candidateApplication.create({
      data: {
        jobId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        currentLocation: currentLocation.trim(),
        resumeFilePath,
        coverLetter: coverLetter.trim(),
        keySkills: keySkills.trim(),
        salaryExpectation: parseInt(salaryExpectation),
        noticePeriod: noticePeriod.trim(),
        yearsOfExperience: yearsOfExperience.trim(),
        remoteWork: remoteWork === 'true' || remoteWork === true,
        startDate: startDate.trim(),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        status: 'pending',
        appliedAt: new Date()
      }
    });

    // Send confirmation email to candidate
    try {
      await sendJobApplicationEmail(email, application, job);
    } catch (emailError) {
      console.error('Error sending application confirmation email:', emailError);
      // Don't fail the application submission if email fails
    }

    // Send notification email to recruiters/HR
    try {
      // Send to job email if available
      if (job.email) {
        await sendNewApplicationNotification(job.email, application, job);
      }
      
      // Send to internal SPOC if different from job email
      if (job.internalSPOC && job.internalSPOC !== job.email) {
        await sendNewApplicationNotification(job.internalSPOC, application, job);
      }
    } catch (notificationError) {
      console.error('Error sending application notification email:', notificationError);
      // Don't fail the application submission if notification email fails
    }

    res.status(201).json({
      message: 'Application submitted successfully!',
      applicationId: application.id,
      jobTitle: job.title,
      company: job.company,
      resumeFile: resumeFilePath
    });

  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
};

/**
 * Get Application Status
 * 
 * Retrieves the detailed status of a specific job application.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Path parameters
 * @param {string} req.params.applicationId - The application ID
 * @param {Object} res - Express response object
 */
export const getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await prisma.candidateApplication.findUnique({
      where: { id: parseInt(applicationId) },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      application,
      job: application.job
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching application status', error: error.message });
  }
};

/**
 * Get All Candidates with Applied Jobs
 * 
 * Retrieves a paginated list of all candidates with their applied jobs and resume download URLs.
 * Supports filtering by status and searching by name, email, or skills.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Number per page (default: 10)
 * @param {string} req.query.status - Filter by status (pending, shortlisted, rejected, hired, all)
 * @param {string} req.query.search - Search term for name, email, or skills
 * @param {Object} res - Express response object
 */
export const getAllCandidates = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause for filtering
    let whereClause = {};
    
    // Filter by application status if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Add search functionality across multiple fields
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { keySkills: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch candidates with pagination and job details
    const candidates = await prisma.candidateApplication.findMany({
      where: whereClause,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            city: true,
            jobType: true,
            experienceLevel: true,
            workType: true,
            jobStatus: true,
            salaryMin: true,
            salaryMax: true,
            priority: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc' // Most recent applications first
      },
      skip: skip,
      take: parseInt(limit)
    });

    // Get total count for pagination metadata
    const totalCandidates = await prisma.candidateApplication.count({
      where: whereClause
    });

    // Transform data to include computed fields and download URLs
    const transformedCandidates = candidates.map(candidate => ({
      id: candidate.id,
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      currentLocation: candidate.currentLocation,
      keySkills: candidate.keySkills,
      salaryExpectation: candidate.salaryExpectation,
      noticePeriod: candidate.noticePeriod,
      yearsOfExperience: candidate.yearsOfExperience,
      remoteWork: candidate.remoteWork,
      startDate: candidate.startDate,
      portfolioUrl: candidate.portfolioUrl,
      status: candidate.status,
      appliedAt: candidate.appliedAt,
      updatedAt: candidate.updatedAt,
      // Generate resume download URL if resume exists
      resumeDownloadUrl: candidate.resumeFilePath ? 
        `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/api/candidates/${candidate.id}/resume` : null,
      appliedJobs: [candidate.job]
    }));

    // Return paginated response with metadata
    res.status(200).json({
      candidates: transformedCandidates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCandidates / parseInt(limit)),
        totalCandidates,
        hasNextPage: skip + parseInt(limit) < totalCandidates,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

/**
 * Get Candidate by ID with All Applied Jobs
 * 
 * Retrieves detailed information about a specific candidate including all their job applications.
 * Groups all applications by the candidate's email address to show complete application history.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Path parameters
 * @param {string} req.params.candidateId - The candidate ID
 * @param {Object} res - Express response object
 */
export const getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // First, get the candidate's basic information
    const candidate = await prisma.candidateApplication.findFirst({
      where: { id: parseInt(candidateId) }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Get all applications for this candidate (by email address)
    // This shows the complete application history for the candidate
    const allApplications = await prisma.candidateApplication.findMany({
      where: { email: candidate.email },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            city: true,
            jobType: true,
            experienceLevel: true,
            workType: true,
            jobStatus: true,
            salaryMin: true,
            salaryMax: true,
            priority: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc' // Most recent applications first
      }
    });

    // Transform and structure the response data
    const candidateData = {
      id: candidate.id,
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      currentLocation: candidate.currentLocation,
      keySkills: candidate.keySkills,
      salaryExpectation: candidate.salaryExpectation,
      noticePeriod: candidate.noticePeriod,
      yearsOfExperience: candidate.yearsOfExperience,
      remoteWork: candidate.remoteWork,
      startDate: candidate.startDate,
      portfolioUrl: candidate.portfolioUrl,
      status: candidate.status,
      appliedAt: candidate.appliedAt,
      updatedAt: candidate.updatedAt,
      // Generate resume download URL if resume exists
      resumeDownloadUrl: candidate.resumeFilePath ? 
        `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/api/candidates/${candidate.id}/resume` : null,
      totalApplications: allApplications.length,
      // Map all applications with their status and job details
      appliedJobs: allApplications.map(app => ({
        applicationId: app.id,
        applicationStatus: app.status,
        appliedAt: app.appliedAt,
        job: app.job
      }))
    };

    res.status(200).json(candidateData);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate details', error: error.message });
  }
};

/**
 * Download Candidate Resume
 * 
 * Downloads the resume file for a specific candidate with proper content-type headers.
 * Supports multiple file formats and handles missing files gracefully.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Path parameters
 * @param {string} req.params.candidateId - The candidate ID
 * @param {Object} res - Express response object
 */
export const downloadResume = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find the candidate by ID
    const candidate = await prisma.candidateApplication.findUnique({
      where: { id: parseInt(candidateId) }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if candidate has a resume file
    if (!candidate.resumeFilePath) {
      return res.status(404).json({ message: 'Resume not found for this candidate' });
    }

    // Normalize the file path to handle both relative and absolute paths
    let filePath = candidate.resumeFilePath;
    
    // If the path doesn't start with ./uploads, assume it's relative to uploads/candidate_user
    if (!filePath.startsWith('./uploads/')) {
      filePath = `./uploads/candidate_user/${path.basename(filePath)}`;
    }

    // Verify the file exists on the filesystem
    if (!fs.existsSync(filePath)) {
      console.error(`Resume file not found: ${filePath}`);
      console.error(`Original path from DB: ${candidate.resumeFilePath}`);
      return res.status(404).json({ 
        message: 'Resume file not found on server',
        originalPath: candidate.resumeFilePath,
        resolvedPath: filePath
      });
    }

    // Determine content type based on file extension
    const fileExtension = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    // Set appropriate content type for different file formats
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }

    // Set headers for file download
    const fileName = `${candidate.firstName}_${candidate.lastName}_resume${fileExtension}`;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fs.statSync(filePath).size);

    // Stream the file for efficient memory usage
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Error downloading resume', error: error.message });
  }
};

/**
 * Get All Candidates Data (Complete)
 * 
 * Retrieves ALL candidates data without pagination - returns everything in one request.
 * This endpoint gives you complete candidate information with all their applications.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllCandidatesComplete = async (req, res) => {
  try {
    // Get ALL candidates without any pagination or limits
    const allCandidates = await prisma.candidateApplication.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            city: true,
            jobType: true,
            experienceLevel: true,
            workType: true,
            jobStatus: true,
            salaryMin: true,
            salaryMax: true,
            priority: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc' // Most recent applications first
      }
    });

    // Group candidates by email to get all applications for each candidate
    const candidatesByEmail = {};
    
    allCandidates.forEach(application => {
      const email = application.email;
      
      if (!candidatesByEmail[email]) {
        // First time seeing this candidate, create their profile
        candidatesByEmail[email] = {
          id: application.id,
          fullName: `${application.firstName} ${application.lastName}`,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          phone: application.phone,
          currentLocation: application.currentLocation,
          keySkills: application.keySkills,
          salaryExpectation: application.salaryExpectation,
          noticePeriod: application.noticePeriod,
          yearsOfExperience: application.yearsOfExperience,
          remoteWork: application.remoteWork,
          startDate: application.startDate,
          portfolioUrl: application.portfolioUrl,
          status: application.status,
          appliedAt: application.appliedAt,
          updatedAt: application.updatedAt,
          resumeDownloadUrl: application.resumeFilePath ? 
            `${process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`}/api/candidates/${application.id}/resume` : null,
          totalApplications: 0,
          appliedJobs: []
        };
      }
      
      // Add this application to the candidate's job list
      candidatesByEmail[email].appliedJobs.push({
        applicationId: application.id,
        applicationStatus: application.status,
        appliedAt: application.appliedAt,
        job: application.job
      });
      
      // Update total applications count
      candidatesByEmail[email].totalApplications++;
    });

    // Convert to array and sort by most recent application
    const candidatesArray = Object.values(candidatesByEmail).sort((a, b) => {
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    });

    // Return complete data
    res.status(200).json({
      success: true,
      totalCandidates: candidatesArray.length,
      totalApplications: allCandidates.length,
      candidates: candidatesArray,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching all candidates data', 
      error: error.message 
    });
  }
}; 

// Utility function to normalize resume file paths
export const normalizeResumePath = (filePath) => {
  if (!filePath) return null;
  
  // If the path doesn't start with ./uploads, assume it's relative to uploads/candidate_user
  if (!filePath.startsWith('./uploads/')) {
    return `./uploads/candidate_user/${path.basename(filePath)}`;
  }
  
  return filePath;
};

// Utility function to check if resume file exists
export const checkResumeExists = (filePath) => {
  if (!filePath) return false;
  
  const normalizedPath = normalizeResumePath(filePath);
  return fs.existsSync(normalizedPath);
}; 