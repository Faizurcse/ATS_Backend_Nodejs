import prisma from '../prismaClient.js';
import { sendJobUpdateEmail, sendJobDeleteEmail, sendJobCreateEmail } from '../utils/mailer.js';

// Helper function to create SEO-friendly slug
const createJobSlug = (job) => {
  const title = job.title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
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

// Validation function for enum values
const validateEnumValues = (workType, jobStatus) => {
  const validWorkTypes = ['ONSITE', 'REMOTE', 'HYBRID'];
  const validJobStatuses = ['ACTIVE', 'PAUSED', 'CLOSED', 'FILLED'];
  
  if (workType && !validWorkTypes.includes(workType.toUpperCase())) {
    throw new Error(`Invalid workType. Must be one of: ${validWorkTypes.join(', ')}`);
  }
  
  if (jobStatus && !validJobStatuses.includes(jobStatus.toUpperCase())) {
    throw new Error(`Invalid jobStatus. Must be one of: ${validJobStatuses.join(', ')}`);
  }
};

export const createJobPost = async (req, res) => {
  const {
    title,
    company,
    department,
    internalSPOC,
    recruiter,
    email,
    jobType,
    experienceLevel,
    country,
    city,
    fullLocation,
    workType,
    jobStatus,
    salaryMin,
    salaryMax,
    priority,
    description,
    requirements,
    requiredSkills,
    benefits
  } = req.body;

  try {
    // Validate required fields
    if (!email || !email.trim()) {
      return res.status(400).json({ 
        message: 'Email is required for job posting',
        error: 'Please provide a valid email address'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Invalid email format',
        error: 'Please provide a valid email address'
      });
    }

    // Validate enum values
    validateEnumValues(workType, jobStatus);

    // Create a new job post in the database
    const newJob = await prisma.ats_JobPost.create({
      data: {
        title,
        company,
        department,
        internalSPOC,
        recruiter,
        email,
        jobType,
        experienceLevel,
        country,
        city,
        fullLocation,
        workType: workType ? workType.toUpperCase() : 'ONSITE',
        jobStatus: jobStatus ? jobStatus.toUpperCase() : 'ACTIVE',
        salaryMin,
        salaryMax,
        priority,
        description,
        requirements,
        requiredSkills,
        benefits,
      }
    });

    // Send email notification for job creation
    if (newJob.email) {
      try {
        const createInfo = {
          createdBy: req.user?.name || req.user?.email || 'System Administrator',
          createdAt: new Date(),
          reason: req.body.createReason || 'New job posting created',
          jobId: newJob.id
        };
        await sendJobCreateEmail(newJob.email, newJob, createInfo);
      } catch (emailError) {
        console.error('Failed to send creation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      message: 'Job post created successfully!',
      job: newJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job post', error: error.message });
  }
};

export const getJobPosts = async (req, res) => {
  try {
    const jobs = await prisma.ats_JobPost.findMany();
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const jobsWithUrl = jobs.map(job => ({
      ...job,
      applyUrl: `${baseUrl}/api/job-listings/${createJobSlug(job)}`
    }));
    res.status(200).json({ jobs: jobsWithUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job posts', error: error.message });
  }
};

export const updateJobPost = async (req, res) => {
  const jobId = parseInt(req.params.id);
  const {
    title,
    company,
    department,
    internalSPOC,
    recruiter,
    email,
    jobType,
    experienceLevel,
    country,
    city,
    fullLocation,
    workType,
    jobStatus,
    salaryMin,
    salaryMax,
    priority,
    description,
    requirements,
    requiredSkills,
    benefits
  } = req.body;

  try {
    // Get the original job data before update
    const originalJob = await prisma.ats_JobPost.findUnique({
      where: { id: jobId }
    });

    if (!originalJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Validate enum values
    validateEnumValues(workType, jobStatus);

    const updatedJob = await prisma.ats_JobPost.update({
      where: { id: jobId },
      data: {
        title,
        company,
        department,
        internalSPOC,
        recruiter,
        email,
        jobType,
        experienceLevel,
        country,
        city,
        fullLocation,
        workType: workType ? workType.toUpperCase() : undefined,
        jobStatus: jobStatus ? jobStatus.toUpperCase() : undefined,
        salaryMin,
        salaryMax,
        priority,
        description,
        requirements,
        requiredSkills,
        benefits,
      }
    });

    // Determine which fields were updated
    const updatedFields = [];
    const fieldsToCheck = [
      { name: 'Title', original: originalJob.title, updated: title },
      { name: 'Company', original: originalJob.company, updated: company },
      { name: 'Department', original: originalJob.department, updated: department },
      { name: 'Internal SPOC', original: originalJob.internalSPOC, updated: internalSPOC },
      { name: 'Recruiter', original: originalJob.recruiter, updated: recruiter },
      { name: 'Job Type', original: originalJob.jobType, updated: jobType },
      { name: 'Experience Level', original: originalJob.experienceLevel, updated: experienceLevel },
      { name: 'Country', original: originalJob.country, updated: country },
      { name: 'City', original: originalJob.city, updated: city },
      { name: 'Full Location', original: originalJob.fullLocation, updated: fullLocation },
      { name: 'Work Type', original: originalJob.workType, updated: workType },
      { name: 'Job Status', original: originalJob.jobStatus, updated: jobStatus },
      { name: 'Salary Min', original: originalJob.salaryMin, updated: salaryMin },
      { name: 'Salary Max', original: originalJob.salaryMax, updated: salaryMax },
      { name: 'Priority', original: originalJob.priority, updated: priority },
      { name: 'Description', original: originalJob.description, updated: description },
      { name: 'Requirements', original: originalJob.requirements, updated: requirements },
      { name: 'Required Skills', original: originalJob.requiredSkills, updated: requiredSkills },
      { name: 'Benefits', original: originalJob.benefits, updated: benefits }
    ];

    fieldsToCheck.forEach(field => {
      if (field.original !== field.updated && field.updated !== undefined) {
        updatedFields.push(field.name);
      }
    });

    // Send email notification if there are updates and email is provided
    if (updatedFields.length > 0 && updatedJob.email) {
      try {
        const updateInfo = {
          updatedBy: req.user?.name || req.user?.email || 'System Administrator',
          updatedAt: new Date(),
          reason: req.body.updateReason || 'Job posting information updated',
          jobId: updatedJob.id
        };
        await sendJobUpdateEmail(updatedJob.email, updatedJob, updatedFields, updateInfo);
      } catch (emailError) {
        console.error('Failed to send update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      message: 'Job post updated successfully!',
      job: updatedJob,
      updatedFields: updatedFields
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job post', error: error.message });
  }
};

export const deleteJobPost = async (req, res) => {
  const jobId = parseInt(req.params.id);

  console.log('🚀 DELETE JOB REQUEST RECEIVED');
  console.log('Job ID:', jobId);
  console.log('Request User:', req.user);
  console.log('Request Body:', req.body);

  try {
    // Get the job data before deletion
    const jobToDelete = await prisma.ats_JobPost.findUnique({
      where: { id: jobId }
    });

    if (!jobToDelete) {
      console.log('❌ Job not found in database');
      return res.status(404).json({ message: 'Job post not found' });
    }

    console.log('✅ Job found in database:', jobToDelete.title);

    // Delete the job post
    await prisma.ats_JobPost.delete({
      where: { id: jobId }
    });

    console.log('✅ Job deleted from database');

    // Send email notification if email is provided
    console.log('🔍 Delete Email Debug:');
    console.log('Job Email from DB:', jobToDelete.email);
    console.log('Job Email from Request:', req.body.email);
    console.log('Job Data:', jobToDelete);
    
    // Use email from request body as fallback if not in database
    const emailToUse = jobToDelete.email || req.body.email;
    
    if (emailToUse) {
      try {
        const deleteInfo = {
          deletedBy: req.user?.name || req.user?.email || 'System Administrator',
          deletedAt: new Date(),
          reason: req.body.deleteReason || 'Job posting removed from system',
          jobId: jobToDelete.id
        };
        console.log('Delete Info:', deleteInfo);
        console.log('Using email:', emailToUse);
        await sendJobDeleteEmail(emailToUse, jobToDelete, deleteInfo);
        console.log('✅ Delete email sent successfully!');
      } catch (emailError) {
        console.error('❌ Failed to send deletion email:', emailError);
        console.error('Full error:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('⚠️  No email found for job, skipping email notification');
    }

    res.status(200).json({
      message: 'Job post deleted successfully!',
      deletedJob: {
        id: jobToDelete.id,
        title: jobToDelete.title,
        company: jobToDelete.company
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job post', error: error.message });
  }
};

// New function to update job status
export const updateJobStatus = async (req, res) => {
  const jobId = parseInt(req.params.id);
  const { jobStatus } = req.body;

  try {
    // Get the original job data before update
    const originalJob = await prisma.ats_JobPost.findUnique({
      where: { id: jobId }
    });

    if (!originalJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    // Validate job status
    validateEnumValues(null, jobStatus);

    const updatedJob = await prisma.ats_JobPost.update({
      where: { id: jobId },
      data: {
        jobStatus: jobStatus.toUpperCase()
      }
    });

    // Send email notification if status changed and email is provided
    if (originalJob.jobStatus !== jobStatus.toUpperCase() && updatedJob.email) {
      try {
        const updatedFields = ['Job Status'];
        const updateInfo = {
          updatedBy: req.user?.name || req.user?.email || 'System Administrator',
          updatedAt: new Date(),
          reason: req.body.statusUpdateReason || `Job status changed from ${originalJob.jobStatus} to ${jobStatus.toUpperCase()}`,
          jobId: updatedJob.id
        };
        await sendJobUpdateEmail(updatedJob.email, updatedJob, updatedFields, updateInfo);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      message: 'Job status updated successfully!',
      job: updatedJob,
      previousStatus: originalJob.jobStatus,
      newStatus: jobStatus.toUpperCase()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job status', error: error.message });
  }
};

// New function to get jobs by status
export const getJobsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    // Validate status
    validateEnumValues(null, status);

    const jobs = await prisma.ats_JobPost.findMany({
      where: {
        jobStatus: status.toUpperCase()
      }
    });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const jobsWithUrl = jobs.map(job => ({
      ...job,
      applyUrl: `${baseUrl}/api/job-listings/${createJobSlug(job)}`
    }));

    res.status(200).json({ 
      jobs: jobsWithUrl,
      count: jobs.length,
      status: status.toUpperCase()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs by status', error: error.message });
  }
};
