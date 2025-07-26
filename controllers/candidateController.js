import prisma from '../prismaClient.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get candidate name from form data
    const firstName = req.body.firstName || 'candidate';
    const lastName = req.body.lastName || 'user';
    
    // Create uploads directory if it doesn't exist
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create candidate-specific folder
    const candidateFolder = `${uploadDir}/${firstName}_${lastName}`;
    if (!fs.existsSync(candidateFolder)) {
      fs.mkdirSync(candidateFolder, { recursive: true });
    }
    
    cb(null, candidateFolder);
  },
  filename: function (req, file, cb) {
    // Create filename with candidate name and timestamp
    const firstName = req.body.firstName || 'candidate';
    const lastName = req.body.lastName || 'user';
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

// Get application status
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