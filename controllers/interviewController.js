import prisma from '../prismaClient.js';

/**
 * Get Candidates Selected for Interviews
 * 
 * Returns only candidates who are selected for first interview, second interview, or final interview.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCandidatesSelectedForInterviews = async (req, res) => {
  try {
    // Get only candidates who are in interview stages
    const interviewCandidates = await prisma.candidateApplication.findMany({
      where: {
        status: {
          in: ['First Interview', 'Second Interview', 'Final Interview']
        }
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            city: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    // Transform the data - only essential information
    const candidates = interviewCandidates.map(candidate => {
      return {
        id: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        phone: candidate.phone,
        skills: candidate.keySkills,
        experience: candidate.yearsOfExperience,
        expectedSalary: candidate.salaryExpectation,
        interviewStage: candidate.status,
        job: {
          title: candidate.job.title,
          company: candidate.job.company,
          location: candidate.job.city
        }
      };
    });

    // Get counts for each interview stage
    const stageCounts = {
      'First Interview': candidates.filter(c => c.interviewStage === 'First Interview').length,
      'Second Interview': candidates.filter(c => c.interviewStage === 'Second Interview').length,
      'Final Interview': candidates.filter(c => c.interviewStage === 'Final Interview').length
    };

    res.status(200).json({
      success: true,
      totalCandidates: candidates.length,
      candidates: candidates,
      stageCounts: stageCounts
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching interview candidates', 
      error: error.message 
    });
  }
};

/**
 * Schedule Interview
 * 
 * Creates a new interview schedule for a candidate
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const scheduleInterview = async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      interviewDate,
      interviewTime,
      interviewType,
      interviewMode,
      platform,
      meetingLink,
      interviewer,
      notes
    } = req.body;

    // Validate required fields
    if (!candidateId || !interviewDate || !interviewTime || !interviewType || !interviewMode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: candidateId, interviewDate, interviewTime, interviewType, interviewMode'
      });
    }

    // Validate candidate exists
    const candidate = await prisma.candidateApplication.findUnique({
      where: { id: parseInt(candidateId) }
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Create interview schedule
    const interviewSchedule = await prisma.interviewSchedule.create({
      data: {
        candidateId: parseInt(candidateId),
        candidateName: candidateName || `${candidate.firstName} ${candidate.lastName}`,
        interviewDate: new Date(interviewDate),
        interviewTime: interviewTime,
        interviewType: interviewType,
        interviewMode: interviewMode,
        platform: platform || 'Zoom',
        meetingLink: meetingLink || '',
        interviewer: interviewer || '',
        notes: notes || '',
        status: 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Update candidate status to indicate interview is scheduled
    await prisma.candidateApplication.update({
      where: { id: parseInt(candidateId) },
      data: {
        status: 'Interview Scheduled',
        updatedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: {
        id: interviewSchedule.id,
        candidateId: interviewSchedule.candidateId,
        candidateName: interviewSchedule.candidateName,
        interviewDate: interviewSchedule.interviewDate,
        interviewTime: interviewSchedule.interviewTime,
        interviewType: interviewSchedule.interviewType,
        interviewMode: interviewSchedule.interviewMode,
        platform: interviewSchedule.platform,
        meetingLink: interviewSchedule.meetingLink,
        interviewer: interviewSchedule.interviewer,
        notes: interviewSchedule.notes,
        status: interviewSchedule.status,
        createdAt: interviewSchedule.createdAt
      }
    });

  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    });
  }
};

/**
 * Bulk Schedule Interviews
 * 
 * Creates multiple interview schedules for multiple candidates
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const bulkScheduleInterviews = async (req, res) => {
  try {
    const {
      candidateIds,
      interviewDate,
      interviewTime,
      interviewType,
      interviewMode,
      platform,
      meetingLink,
      interviewer,
      notes
    } = req.body;

    // Validate required fields
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: candidateIds (array)'
      });
    }

    if (!interviewDate || !interviewTime || !interviewType || !interviewMode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: interviewDate, interviewTime, interviewType, interviewMode'
      });
    }

    // Validate all candidates exist
    const candidates = await prisma.candidateApplication.findMany({
      where: {
        id: {
          in: candidateIds.map(id => parseInt(id))
        }
      }
    });

    if (candidates.length !== candidateIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more candidates not found'
      });
    }

    // Create interview schedules for all candidates
    const interviewSchedules = [];
    const updatePromises = [];

    for (const candidateId of candidateIds) {
      const candidate = candidates.find(c => c.id === parseInt(candidateId));
      
      // Create interview schedule
      const interviewSchedule = await prisma.interviewSchedule.create({
        data: {
          candidateId: parseInt(candidateId),
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          interviewDate: new Date(interviewDate),
          interviewTime: interviewTime,
          interviewType: interviewType,
          interviewMode: interviewMode,
          platform: platform || 'Zoom',
          meetingLink: meetingLink || '',
          interviewer: interviewer || '',
          notes: notes || '',
          status: 'SCHEDULED',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      interviewSchedules.push(interviewSchedule);

      // Update candidate status
      updatePromises.push(
        prisma.candidateApplication.update({
          where: { id: parseInt(candidateId) },
          data: {
            status: 'Interview Scheduled',
            updatedAt: new Date()
          }
        })
      );
    }

    // Update all candidates
    await Promise.all(updatePromises);

    res.status(201).json({
      success: true,
      message: `Successfully scheduled ${interviewSchedules.length} interviews`,
      data: {
        totalScheduled: interviewSchedules.length,
        schedules: interviewSchedules.map(schedule => ({
          id: schedule.id,
          candidateId: schedule.candidateId,
          candidateName: schedule.candidateName,
          interviewDate: schedule.interviewDate,
          interviewTime: schedule.interviewTime,
          interviewType: schedule.interviewType,
          interviewMode: schedule.interviewMode,
          platform: schedule.platform,
          meetingLink: schedule.meetingLink,
          interviewer: schedule.interviewer,
          notes: schedule.notes,
          status: schedule.status,
          createdAt: schedule.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error bulk scheduling interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk scheduling interviews',
      error: error.message
    });
  }
};

/**
 * Get All Interview Scheduled Candidates
 * 
 * Returns all candidates who have interviews scheduled with their job details
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllInterviewScheduledCandidates = async (req, res) => {
  try {
    // Get all interview schedules with candidate and job details
    const interviewSchedules = await prisma.interviewSchedule.findMany({
      include: {
        candidate: {
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
          }
        }
      },
      orderBy: {
        interviewDate: 'asc'
      }
    });

    // Transform the data to include all necessary details
    const scheduledCandidates = interviewSchedules.map(schedule => {
      const candidate = schedule.candidate;
      return {
        // Interview Schedule Details
        interviewId: schedule.id,
        interviewDate: schedule.interviewDate,
        interviewTime: schedule.interviewTime,
        interviewType: schedule.interviewType,
        interviewMode: schedule.interviewMode,
        platform: schedule.platform,
        meetingLink: schedule.meetingLink,
        interviewer: schedule.interviewer,
        notes: schedule.notes,
        interviewStatus: schedule.status,
        interviewCreatedAt: schedule.createdAt,
        interviewUpdatedAt: schedule.updatedAt,

        // Candidate Details
        candidateId: candidate.id,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
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
        candidateStatus: candidate.status,
        appliedAt: candidate.appliedAt,
        updatedAt: candidate.updatedAt,
        resumeDownloadUrl: `http://localhost:5000/api/candidates/${candidate.id}/resume`,

        // Job Details
        job: {
          id: candidate.job.id,
          title: candidate.job.title,
          company: candidate.job.company,
          city: candidate.job.city,
          jobType: candidate.job.jobType,
          experienceLevel: candidate.job.experienceLevel,
          workType: candidate.job.workType,
          jobStatus: candidate.job.jobStatus,
          salaryMin: candidate.job.salaryMin,
          salaryMax: candidate.job.salaryMax,
          priority: candidate.job.priority,
          createdAt: candidate.job.createdAt
        }
      };
    });

    // Get statistics
    const totalScheduled = scheduledCandidates.length;
    const upcomingInterviews = scheduledCandidates.filter(candidate => 
      new Date(candidate.interviewDate) > new Date()
    ).length;
    const completedInterviews = scheduledCandidates.filter(candidate => 
      candidate.interviewStatus === 'COMPLETED'
    ).length;

    // Group by interview type
    const interviewTypeStats = scheduledCandidates.reduce((acc, candidate) => {
      const type = candidate.interviewType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Group by interview mode
    const interviewModeStats = scheduledCandidates.reduce((acc, candidate) => {
      const mode = candidate.interviewMode;
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: 'Interview scheduled candidates retrieved successfully',
      data: {
        totalScheduled,
        upcomingInterviews,
        completedInterviews,
        statistics: {
          interviewTypeStats,
          interviewModeStats
        },
        candidates: scheduledCandidates
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching interview scheduled candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview scheduled candidates',
      error: error.message
    });
  }
};