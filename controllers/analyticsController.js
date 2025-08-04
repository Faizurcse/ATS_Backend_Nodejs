import prisma from '../prismaClient.js';

// Get comprehensive analytics for the entire project
export const getAllAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // 1. JOB ANALYTICS
    const jobAnalytics = await getJobAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear);

    // 2. CANDIDATE ANALYTICS
    const candidateAnalytics = await getCandidateAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear);

    // 3. INTERVIEW ANALYTICS
    const interviewAnalytics = await getInterviewAnalytics(now, startOfMonth, endOfMonth);

    // 4. CUSTOMER ANALYTICS
    const customerAnalytics = await getCustomerAnalytics();

    // 5. TIMESHEET ANALYTICS
    const timesheetAnalytics = await getTimesheetAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear);

    // 6. PERFORMANCE METRICS
    const performanceMetrics = await getPerformanceMetrics();

    // 7. RECENT ACTIVITY
    const recentActivity = await getRecentActivity();

    // 8. TRENDS AND INSIGHTS
    const trendsAndInsights = await getTrendsAndInsights(now, startOfMonth, endOfMonth);

    const analytics = {
      timestamp: now.toISOString(),
      period: {
        current: {
          month: startOfMonth.toISOString(),
          year: startOfYear.toISOString()
        }
      },
      jobs: jobAnalytics,
      candidates: candidateAnalytics,
      interviews: interviewAnalytics,
      customers: customerAnalytics,
      timesheets: timesheetAnalytics,
      performance: performanceMetrics,
      recentActivity: recentActivity,
      trends: trendsAndInsights
    };

    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};

// Job Analytics Helper Function
async function getJobAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear) {
  const totalJobs = await prisma.ats_JobPost.count();
  const activeJobs = await prisma.ats_JobPost.count({ where: { jobStatus: 'ACTIVE' } });
  const filledJobs = await prisma.ats_JobPost.count({ where: { jobStatus: 'FILLED' } });
  const pausedJobs = await prisma.ats_JobPost.count({ where: { jobStatus: 'PAUSED' } });
  const closedJobs = await prisma.ats_JobPost.count({ where: { jobStatus: 'CLOSED' } });

  // Jobs by work type
  const onsiteJobs = await prisma.ats_JobPost.count({ where: { workType: 'ONSITE' } });
  const remoteJobs = await prisma.ats_JobPost.count({ where: { workType: 'REMOTE' } });
  const hybridJobs = await prisma.ats_JobPost.count({ where: { workType: 'HYBRID' } });

  // Monthly and yearly trends
  const jobsThisMonth = await prisma.ats_JobPost.count({
    where: { createdAt: { gte: startOfMonth, lte: endOfMonth } }
  });

  const jobsThisYear = await prisma.ats_JobPost.count({
    where: { createdAt: { gte: startOfYear, lte: endOfYear } }
  });

  // Top companies by job count
  const topCompanies = await prisma.ats_JobPost.groupBy({
    by: ['company'],
    _count: { company: true },
    orderBy: { _count: { company: 'desc' } },
    take: 5
  });

  // Recent jobs
  const recentJobs = await prisma.ats_JobPost.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      company: true,
      jobStatus: true,
      createdAt: true,
      workType: true
    }
  });

  return {
    overview: {
      total: totalJobs,
      active: activeJobs,
      filled: filledJobs,
      paused: pausedJobs,
      closed: closedJobs,
      fillRate: totalJobs > 0 ? ((filledJobs / totalJobs) * 100).toFixed(2) : 0
    },
    byWorkType: {
      onsite: onsiteJobs,
      remote: remoteJobs,
      hybrid: hybridJobs
    },
    trends: {
      thisMonth: jobsThisMonth,
      thisYear: jobsThisYear
    },
    topCompanies: topCompanies.map(company => ({
      company: company.company,
      jobCount: company._count.company
    })),
    recentJobs: recentJobs
  };
}

// Candidate Analytics Helper Function
async function getCandidateAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear) {
  const totalCandidates = await prisma.candidateApplication.count();
  const pendingCandidates = await prisma.candidateApplication.count({ where: { status: 'pending' } });
  const shortlistedCandidates = await prisma.candidateApplication.count({ where: { status: 'shortlisted' } });
  const hiredCandidates = await prisma.candidateApplication.count({ where: { status: 'hired' } });
  const rejectedCandidates = await prisma.candidateApplication.count({ where: { status: 'rejected' } });

  // Monthly and yearly trends
  const candidatesThisMonth = await prisma.candidateApplication.count({
    where: { appliedAt: { gte: startOfMonth, lte: endOfMonth } }
  });

  const candidatesThisYear = await prisma.candidateApplication.count({
    where: { appliedAt: { gte: startOfYear, lte: endOfYear } }
  });

  // Conversion rates
  const shortlistRate = totalCandidates > 0 ? ((shortlistedCandidates / totalCandidates) * 100).toFixed(2) : 0;
  const hireRate = totalCandidates > 0 ? ((hiredCandidates / totalCandidates) * 100).toFixed(2) : 0;

  // Experience level distribution
  const experienceLevels = await prisma.candidateApplication.groupBy({
    by: ['yearsOfExperience'],
    _count: { yearsOfExperience: true },
    where: { yearsOfExperience: { not: null } }
  });

  // Recent applications
  const recentApplications = await prisma.candidateApplication.findMany({
    take: 5,
    orderBy: { appliedAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      appliedAt: true,
      yearsOfExperience: true,
      job: {
        select: {
          title: true,
          company: true
        }
      }
    }
  });

  return {
    overview: {
      total: totalCandidates,
      pending: pendingCandidates,
      shortlisted: shortlistedCandidates,
      hired: hiredCandidates,
      rejected: rejectedCandidates
    },
    conversionRates: {
      shortlistRate: parseFloat(shortlistRate),
      hireRate: parseFloat(hireRate)
    },
    trends: {
      thisMonth: candidatesThisMonth,
      thisYear: candidatesThisYear
    },
    experienceLevels: experienceLevels.map(level => ({
      experience: level.yearsOfExperience,
      count: level._count.yearsOfExperience
    })),
    recentApplications: recentApplications
  };
}

// Interview Analytics Helper Function
async function getInterviewAnalytics(now, startOfMonth, endOfMonth) {
  const totalInterviews = await prisma.interviewSchedule.count();
  const scheduledInterviews = await prisma.interviewSchedule.count({ where: { status: 'SCHEDULED' } });
  const completedInterviews = await prisma.interviewSchedule.count({ where: { status: 'COMPLETED' } });
  const cancelledInterviews = await prisma.interviewSchedule.count({ where: { status: 'CANCELLED' } });

  // Today's interviews
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const todaysInterviews = await prisma.interviewSchedule.count({
    where: { 
      status: 'SCHEDULED',
      interviewDate: { gte: startOfToday, lt: endOfToday }
    }
  });

  // This month's interviews
  const interviewsThisMonth = await prisma.interviewSchedule.count({
    where: { 
      interviewDate: { gte: startOfMonth, lte: endOfMonth }
    }
  });

  // Interview types distribution
  const interviewTypes = await prisma.interviewSchedule.groupBy({
    by: ['interviewType'],
    _count: { interviewType: true }
  });

  // Interview modes distribution
  const interviewModes = await prisma.interviewSchedule.groupBy({
    by: ['interviewMode'],
    _count: { interviewMode: true }
  });

  // Upcoming interviews (next 7 days)
  const upcomingInterviews = await prisma.interviewSchedule.findMany({
    where: {
      interviewDate: {
        gte: now,
        lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      status: 'SCHEDULED'
    },
    take: 5,
    orderBy: { interviewDate: 'asc' },
    select: {
      id: true,
      candidateName: true,
      interviewDate: true,
      interviewTime: true,
      interviewType: true,
      interviewMode: true,
      status: true
    }
  });

  return {
    overview: {
      total: totalInterviews,
      scheduled: scheduledInterviews,
      completed: completedInterviews,
      cancelled: cancelledInterviews
    },
    current: {
      today: todaysInterviews,
      thisMonth: interviewsThisMonth
    },
    byType: interviewTypes.map(type => ({
      type: type.interviewType,
      count: type._count.interviewType
    })),
    byMode: interviewModes.map(mode => ({
      mode: mode.interviewMode,
      count: mode._count.interviewMode
    })),
    upcoming: upcomingInterviews
  };
}

// Customer Analytics Helper Function
async function getCustomerAnalytics() {
  const totalCustomers = await prisma.customer.count();
  const activeCustomers = await prisma.customer.count({ where: { status: 'ACTIVE' } });
  const inactiveCustomers = await prisma.customer.count({ where: { status: 'INACTIVE' } });
  const prospectCustomers = await prisma.customer.count({ where: { status: 'PROSPECT' } });

  // Customers by priority
  const customersByPriority = await prisma.customer.groupBy({
    by: ['priority'],
    _count: { priority: true }
  });

  // Customers by industry
  const customersByIndustry = await prisma.customer.groupBy({
    by: ['industry'],
    _count: { industry: true },
    orderBy: { _count: { industry: 'desc' } },
    take: 5
  });

  // Top customers by job count
  const topCustomersByJobs = await prisma.customer.findMany({
    select: {
      id: true,
      companyName: true,
      industry: true,
      status: true,
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: {
      jobs: { _count: 'desc' }
    },
    take: 5
  });

  return {
    overview: {
      total: totalCustomers,
      active: activeCustomers,
      inactive: inactiveCustomers,
      prospects: prospectCustomers
    },
    byPriority: customersByPriority.map(priority => ({
      priority: priority.priority,
      count: priority._count.priority
    })),
    byIndustry: customersByIndustry.map(industry => ({
      industry: industry.industry,
      count: industry._count.industry
    })),
    topCustomers: topCustomersByJobs.map(customer => ({
      id: customer.id,
      companyName: customer.companyName,
      industry: customer.industry,
      status: customer.status,
      jobCount: customer._count.jobs
    }))
  };
}

// Timesheet Analytics Helper Function
async function getTimesheetAnalytics(now, startOfMonth, endOfMonth, startOfYear, endOfYear) {
  const totalEntries = await prisma.timesheetEntry.count();
  const pendingEntries = await prisma.timesheetEntry.count({ where: { status: 'PENDING' } });
  const approvedEntries = await prisma.timesheetEntry.count({ where: { status: 'APPROVED' } });
  const rejectedEntries = await prisma.timesheetEntry.count({ where: { status: 'REJECTED' } });

  // Total hours
  const totalHoursResult = await prisma.timesheetEntry.aggregate({
    _sum: { hours: true },
    where: { status: 'APPROVED' }
  });
  const totalHours = totalHoursResult._sum.hours || 0;

  // This month's hours
  const monthHoursResult = await prisma.timesheetEntry.aggregate({
    _sum: { hours: true },
    where: {
      status: 'APPROVED',
      date: {
        gte: startOfMonth.toISOString().split('T')[0],
        lte: endOfMonth.toISOString().split('T')[0]
      }
    }
  });
  const monthHours = monthHoursResult._sum.hours || 0;

  // This year's hours
  const yearHoursResult = await prisma.timesheetEntry.aggregate({
    _sum: { hours: true },
    where: {
      status: 'APPROVED',
      date: {
        gte: startOfYear.toISOString().split('T')[0],
        lte: endOfYear.toISOString().split('T')[0]
      }
    }
  });
  const yearHours = yearHoursResult._sum.hours || 0;

  // Hours by task category
  const hoursByCategory = await prisma.timesheetEntry.groupBy({
    by: ['taskCategory'],
    _sum: { hours: true },
    where: { status: 'APPROVED' }
  });

  // Hours by entity type
  const hoursByEntity = await prisma.timesheetEntry.groupBy({
    by: ['entityType'],
    _sum: { hours: true },
    where: { status: 'APPROVED' }
  });

  // Top recruiters by hours
  const topRecruiters = await prisma.timesheetEntry.groupBy({
    by: ['recruiterName'],
    _sum: { hours: true },
    where: { status: 'APPROVED' },
    orderBy: { _sum: { hours: 'desc' } },
    take: 5
  });

  return {
    overview: {
      totalEntries: totalEntries,
      pending: pendingEntries,
      approved: approvedEntries,
      rejected: rejectedEntries
    },
    hours: {
      total: parseFloat(totalHours),
      thisMonth: parseFloat(monthHours),
      thisYear: parseFloat(yearHours)
    },
    byCategory: hoursByCategory.map(category => ({
      category: category.taskCategory,
      hours: parseFloat(category._sum.hours || 0)
    })),
    byEntity: hoursByEntity.map(entity => ({
      entity: entity.entityType,
      hours: parseFloat(entity._sum.hours || 0)
    })),
    topRecruiters: topRecruiters.map(recruiter => ({
      name: recruiter.recruiterName,
      hours: parseFloat(recruiter._sum.hours || 0)
    }))
  };
}

// Performance Metrics Helper Function
async function getPerformanceMetrics() {
  // Time to fill jobs (average days from job creation to hiring)
  const filledJobs = await prisma.ats_JobPost.findMany({
    where: { jobStatus: 'FILLED' },
    select: {
      id: true,
      createdAt: true,
      applications: {
        where: { status: 'hired' },
        select: { appliedAt: true }
      }
    }
  });

  let totalDaysToFill = 0;
  let filledJobsCount = 0;

  filledJobs.forEach(job => {
    if (job.applications.length > 0) {
      const hireDate = job.applications[0].appliedAt;
      const daysToFill = Math.ceil((hireDate - job.createdAt) / (1000 * 60 * 60 * 24));
      totalDaysToFill += daysToFill;
      filledJobsCount++;
    }
  });

  const avgTimeToFill = filledJobsCount > 0 ? (totalDaysToFill / filledJobsCount).toFixed(1) : 0;

  // Application to interview conversion rate
  const totalApplications = await prisma.candidateApplication.count();
  const applicationsWithInterviews = await prisma.candidateApplication.count({
    where: {
      interviewSchedules: { some: {} }
    }
  });

  const interviewConversionRate = totalApplications > 0 ? 
    ((applicationsWithInterviews / totalApplications) * 100).toFixed(2) : 0;

  // Interview to hire conversion rate
  const totalInterviews = await prisma.interviewSchedule.count();
  const interviewsResultingInHire = await prisma.interviewSchedule.count({
    where: {
      candidate: { status: 'hired' }
    }
  });

  const hireConversionRate = totalInterviews > 0 ? 
    ((interviewsResultingInHire / totalInterviews) * 100).toFixed(2) : 0;

  return {
    avgTimeToFill: parseFloat(avgTimeToFill),
    interviewConversionRate: parseFloat(interviewConversionRate),
    hireConversionRate: parseFloat(hireConversionRate),
    totalFilledJobs: filledJobsCount
  };
}

// Recent Activity Helper Function
async function getRecentActivity() {
  const recentJobs = await prisma.ats_JobPost.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      company: true,
      createdAt: true
    }
  });

  const recentApplications = await prisma.candidateApplication.findMany({
    take: 3,
    orderBy: { appliedAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      status: true,
      appliedAt: true,
      job: {
        select: { title: true, company: true }
      }
    }
  });

  const recentInterviews = await prisma.interviewSchedule.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      candidateName: true,
      interviewDate: true,
      interviewType: true,
      status: true
    }
  });

  return {
    recentJobs,
    recentApplications,
    recentInterviews
  };
}

// Trends and Insights Helper Function
async function getTrendsAndInsights(now, startOfMonth, endOfMonth) {
  // Monthly job creation trend (last 6 months)
  const monthlyJobTrend = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const jobCount = await prisma.ats_JobPost.count({
      where: {
        createdAt: { gte: monthStart, lte: monthEnd }
      }
    });

    monthlyJobTrend.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: jobCount
    });
  }

  // Monthly application trend (last 6 months)
  const monthlyApplicationTrend = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const applicationCount = await prisma.candidateApplication.count({
      where: {
        appliedAt: { gte: monthStart, lte: monthEnd }
      }
    });

    monthlyApplicationTrend.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: applicationCount
    });
  }

  // Top performing job categories (by application count)
  const topJobCategories = await prisma.ats_JobPost.groupBy({
    by: ['department'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  });

  return {
    monthlyJobTrend,
    monthlyApplicationTrend,
    topJobCategories: topJobCategories.map(category => ({
      department: category.department || 'Uncategorized',
      jobCount: category._count.id
    }))
  };
} 