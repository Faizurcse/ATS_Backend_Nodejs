import prisma from '../prismaClient.js';

// Get comprehensive dashboard data
export const getDashboardData = async (req, res) => {
  try {
    // Get current date and date ranges
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Job Statistics
    const totalJobs = await prisma.ats_JobPost.count();
    const activeJobs = await prisma.ats_JobPost.count({
      where: { jobStatus: 'ACTIVE' }
    });
    const filledJobs = await prisma.ats_JobPost.count({
      where: { jobStatus: 'FILLED' }
    });

    // Recent Jobs (last 10)
    const recentJobs = await prisma.ats_JobPost.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        jobStatus: true,
        createdAt: true
      }
    });

    // Candidate Statistics
    const totalCandidates = await prisma.candidateApplication.count();
    const pendingCandidates = await prisma.candidateApplication.count({
      where: { status: 'pending' }
    });
    const shortlistedCandidates = await prisma.candidateApplication.count({
      where: { status: 'shortlisted' }
    });
    const hiredCandidates = await prisma.candidateApplication.count({
      where: { status: 'hired' }
    });

    // Recent Applications (last 10)
    const recentApplications = await prisma.candidateApplication.findMany({
      take: 10,
      orderBy: { appliedAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        appliedAt: true,
        job: {
          select: {
            title: true,
            company: true
          }
        }
      }
    });

    // Interview Statistics
    const totalInterviews = await prisma.interviewSchedule.count();
    
    // Get today's date for filtering
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const scheduledInterviews = await prisma.interviewSchedule.count({
      where: { 
        status: 'SCHEDULED',
        interviewDate: {
          gte: startOfToday,
          lt: endOfToday
        }
      }
    });
    
    const completedInterviews = await prisma.interviewSchedule.count({
      where: { status: 'COMPLETED' }
    });

    // Upcoming Interviews (next 7 days)
    const upcomingInterviews = await prisma.interviewSchedule.findMany({
      where: {
        interviewDate: {
          gte: now,
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        status: 'SCHEDULED'
      },
      take: 10,
      orderBy: { interviewDate: 'asc' },
      select: {
        id: true,
        candidateName: true,
        interviewDate: true,
        interviewTime: true,
        interviewType: true,
        interviewMode: true,
        platform: true,
        interviewer: true
      }
    });

    // Customer Statistics
    const totalCustomers = await prisma.customer.count();
    const activeCustomers = await prisma.customer.count({
      where: { status: 'ACTIVE' }
    });

    // Recent Customers (last 10)
    const recentCustomers = await prisma.customer.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        industry: true,
        status: true,
        createdAt: true
      }
    });

    // Timesheet Statistics
    const totalTimesheets = await prisma.timesheetEntry.count();
    const pendingTimesheets = await prisma.timesheetEntry.count({
      where: { status: 'PENDING' }
    });
    const approvedTimesheets = await prisma.timesheetEntry.count({
      where: { status: 'APPROVED' }
    });

    // Monthly timesheet hours
    const monthlyHours = await prisma.timesheetEntry.aggregate({
      where: {
        date: {
          gte: startOfMonth.toISOString().split('T')[0],
          lte: endOfMonth.toISOString().split('T')[0]
        },
        status: 'APPROVED'
      },
      _sum: {
        hours: true
      }
    });

    // Recent Timesheets (last 10)
    const recentTimesheets = await prisma.timesheetEntry.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        recruiterName: true,
        date: true,
        hours: true,
        taskType: true,
        status: true,
        createdAt: true
      }
    });

    // Work Type Distribution
    const workTypeDistribution = await prisma.ats_JobPost.groupBy({
      by: ['workType'],
      _count: {
        id: true
      }
    });

    // Industry Distribution
    const industryDistribution = await prisma.customer.groupBy({
      by: ['industry'],
      _count: {
        id: true
      }
    });

    // Task Category Distribution
    const taskCategoryDistribution = await prisma.timesheetEntry.groupBy({
      by: ['taskCategory'],
      _count: {
        id: true
      }
    });

    // Compile dashboard data
    const dashboardData = {
      summary: {
        totalJobs,
        activeJobs,
        filledJobs,
        totalCandidates,
        pendingCandidates,
        shortlistedCandidates,
        hiredCandidates,
        totalInterviews,
        scheduledInterviews,
        completedInterviews,
        totalCustomers,
        activeCustomers,
        totalTimesheets,
        pendingTimesheets,
        approvedTimesheets,
        monthlyHours: monthlyHours._sum.hours || 0
      },
      charts: {
        workTypeDistribution: workTypeDistribution.map(stat => ({
          workType: stat.workType,
          count: stat._count.id
        })),
        industryDistribution: industryDistribution.map(stat => ({
          industry: stat.industry,
          count: stat._count.id
        })),
        taskCategoryDistribution: taskCategoryDistribution.map(stat => ({
          category: stat.taskCategory,
          count: stat._count.id
        }))
      },
      recent: {
        jobs: recentJobs,
        applications: recentApplications,
        upcomingInterviews,
        customers: recentCustomers,
        timesheets: recentTimesheets
      }
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Get quick stats for dashboard widgets
export const getQuickStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    // Quick counts
    const activeJobs = await prisma.ats_JobPost.count({
      where: { jobStatus: 'ACTIVE' }
    });

    const pendingCandidates = await prisma.candidateApplication.count({
      where: { status: 'pending' }
    });

    const scheduledInterviews = await prisma.interviewSchedule.count({
      where: { status: 'SCHEDULED' }
    });

    const pendingTimesheets = await prisma.timesheetEntry.count({
      where: { status: 'PENDING' }
    });

    // This month's new applications
    const newApplicationsThisMonth = await prisma.candidateApplication.count({
      where: {
        appliedAt: {
          gte: startOfMonth
        }
      }
    });

    // This month's new jobs
    const newJobsThisMonth = await prisma.ats_JobPost.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    });

    const quickStats = {
      activeJobs,
      pendingCandidates,
      scheduledInterviews,
      pendingTimesheets,
      newApplicationsThisMonth,
      newJobsThisMonth
    };

    res.status(200).json({
      success: true,
      message: 'Quick stats retrieved successfully',
      data: quickStats
    });

  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quick stats',
      error: error.message
    });
  }
}; 