import prisma from '../prismaClient.js';

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

export const createJobPost = async (req, res) => {
  const {
    title,
    company,
    department,
    internalSPOC,
    recruiter,
    jobType,
    experienceLevel,
    country,
    city,
    fullLocation,
    workType,
    salaryMin,
    salaryMax,
    priority,
    description,
    requirements,
    requiredSkills,
    benefits
  } = req.body;

  try {
    // Create a new job post in the database
    const newJob = await prisma.ats_JobPost.create({
      data: {
        title,
        company,
        department,
        internalSPOC,
        recruiter,
        jobType,
        experienceLevel,
        country,
        city,
        fullLocation,
        workType,
        salaryMin,
        salaryMax,
        priority,
        description,
        requirements,
        requiredSkills,
        benefits,
      }
    });

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
    jobType,
    experienceLevel,
    country,
    city,
    fullLocation,
    workType,
    salaryMin,
    salaryMax,
    priority,
    description,
    requirements,
    requiredSkills,
    benefits
  } = req.body;

  try {
    const updatedJob = await prisma.ats_JobPost.update({
      where: { id: jobId },
      data: {
        title,
        company,
        department,
        internalSPOC,
        recruiter,
        jobType,
        experienceLevel,
        country,
        city,
        fullLocation,
        workType,
        salaryMin,
        salaryMax,
        priority,
        description,
        requirements,
        requiredSkills,
        benefits,
      }
    });

    res.status(200).json({
      message: 'Job post updated successfully!',
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job post', error: error.message });
  }
};

export const deleteJobPost = async (req, res) => {
  const jobId = parseInt(req.params.id);

  try {
    await prisma.ats_JobPost.delete({
      where: { id: jobId }
    });

    res.status(200).json({
      message: 'Job post deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job post', error: error.message });
  }
};
