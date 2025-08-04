# Analytics API Documentation

## Overview
The Analytics API provides comprehensive insights and metrics for the entire ATS (Applicant Tracking System) project. This single endpoint aggregates data from all major entities including jobs, candidates, interviews, customers, timesheets, and performance metrics.

## Endpoint

### GET `/api/analytics`
Retrieves comprehensive analytics data for the entire project.

**URL:** `GET /api/analytics`

**Headers:**
```
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "message": "Analytics data retrieved successfully",
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "period": {
      "current": {
        "month": "2024-01-01T00:00:00.000Z",
        "year": "2024-01-01T00:00:00.000Z"
      }
    },
    "jobs": { /* Job Analytics */ },
    "candidates": { /* Candidate Analytics */ },
    "interviews": { /* Interview Analytics */ },
    "customers": { /* Customer Analytics */ },
    "timesheets": { /* Timesheet Analytics */ },
    "performance": { /* Performance Metrics */ },
    "recentActivity": { /* Recent Activity */ },
    "trends": { /* Trends and Insights */ }
  }
}
```

## Data Structure

### 1. Jobs Analytics
```json
{
  "jobs": {
    "overview": {
      "total": 150,
      "active": 45,
      "filled": 25,
      "paused": 10,
      "closed": 70,
      "fillRate": "16.67"
    },
    "byWorkType": {
      "onsite": 60,
      "remote": 45,
      "hybrid": 45
    },
    "trends": {
      "thisMonth": 12,
      "thisYear": 45
    },
    "topCompanies": [
      {
        "company": "Tech Corp",
        "jobCount": 15
      }
    ],
    "recentJobs": [
      {
        "id": 1,
        "title": "Senior Developer",
        "company": "Tech Corp",
        "jobStatus": "ACTIVE",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "workType": "REMOTE"
      }
    ]
  }
}
```

### 2. Candidate Analytics
```json
{
  "candidates": {
    "overview": {
      "total": 500,
      "pending": 200,
      "shortlisted": 150,
      "hired": 50,
      "rejected": 100
    },
    "conversionRates": {
      "shortlistRate": 30.0,
      "hireRate": 10.0
    },
    "trends": {
      "thisMonth": 45,
      "thisYear": 200
    },
    "experienceLevels": [
      {
        "experience": "2-5 years",
        "count": 150
      }
    ],
    "recentApplications": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "status": "pending",
        "appliedAt": "2024-01-15T10:30:00.000Z",
        "yearsOfExperience": "3-5 years",
        "job": {
          "title": "Senior Developer",
          "company": "Tech Corp"
        }
      }
    ]
  }
}
```

### 3. Interview Analytics
```json
{
  "interviews": {
    "overview": {
      "total": 200,
      "scheduled": 30,
      "completed": 150,
      "cancelled": 20
    },
    "current": {
      "today": 5,
      "thisMonth": 25
    },
    "byType": [
      {
        "type": "Technical",
        "count": 80
      }
    ],
    "byMode": [
      {
        "mode": "Online",
        "count": 120
      }
    ],
    "upcoming": [
      {
        "id": 1,
        "candidateName": "John Doe",
        "interviewDate": "2024-01-16T10:00:00.000Z",
        "interviewTime": "10:00 AM",
        "interviewType": "Technical",
        "interviewMode": "Online",
        "status": "SCHEDULED"
      }
    ]
  }
}
```

### 4. Customer Analytics
```json
{
  "customers": {
    "overview": {
      "total": 50,
      "active": 35,
      "inactive": 10,
      "prospects": 5
    },
    "byPriority": [
      {
        "priority": "HIGH",
        "count": 15
      }
    ],
    "byIndustry": [
      {
        "industry": "Technology",
        "count": 20
      }
    ],
    "topCustomers": [
      {
        "id": 1,
        "companyName": "Tech Corp",
        "industry": "Technology",
        "status": "ACTIVE",
        "jobCount": 15
      }
    ]
  }
}
```

### 5. Timesheet Analytics
```json
{
  "timesheets": {
    "overview": {
      "totalEntries": 1000,
      "pending": 50,
      "approved": 900,
      "rejected": 50
    },
    "hours": {
      "total": 5000.5,
      "thisMonth": 450.25,
      "thisYear": 2500.75
    },
    "byCategory": [
      {
        "category": "RECRUITMENT",
        "hours": 3000.5
      }
    ],
    "byEntity": [
      {
        "entity": "CANDIDATE",
        "hours": 2000.25
      }
    ],
    "topRecruiters": [
      {
        "name": "Jane Smith",
        "hours": 500.75
      }
    ]
  }
}
```

### 6. Performance Metrics
```json
{
  "performance": {
    "avgTimeToFill": 15.5,
    "interviewConversionRate": 25.0,
    "hireConversionRate": 8.5,
    "totalFilledJobs": 25
  }
}
```

### 7. Recent Activity
```json
{
  "recentActivity": {
    "recentJobs": [
      {
        "id": 1,
        "title": "Senior Developer",
        "company": "Tech Corp",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "recentApplications": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "status": "pending",
        "appliedAt": "2024-01-15T10:30:00.000Z",
        "job": {
          "title": "Senior Developer",
          "company": "Tech Corp"
        }
      }
    ],
    "recentInterviews": [
      {
        "id": 1,
        "candidateName": "John Doe",
        "interviewDate": "2024-01-16T10:00:00.000Z",
        "interviewType": "Technical",
        "status": "SCHEDULED"
      }
    ]
  }
}
```

### 8. Trends and Insights
```json
{
  "trends": {
    "monthlyJobTrend": [
      {
        "month": "Aug 2023",
        "count": 10
      }
    ],
    "monthlyApplicationTrend": [
      {
        "month": "Aug 2023",
        "count": 45
      }
    ],
    "topJobCategories": [
      {
        "department": "Engineering",
        "jobCount": 25
      }
    ]
  }
}
```

## Key Metrics Explained

### Job Metrics
- **Total Jobs**: Total number of job postings in the system
- **Active Jobs**: Jobs currently open for applications
- **Filled Jobs**: Jobs that have been successfully filled
- **Fill Rate**: Percentage of jobs that have been filled
- **Jobs by Work Type**: Distribution of onsite, remote, and hybrid jobs

### Candidate Metrics
- **Total Candidates**: Total number of applications received
- **Conversion Rates**: 
  - Shortlist Rate: Percentage of applications that reach shortlist stage
  - Hire Rate: Percentage of applications that result in hiring
- **Experience Levels**: Distribution of candidates by years of experience

### Interview Metrics
- **Total Interviews**: Total number of interviews scheduled
- **Today's Interviews**: Number of interviews scheduled for today
- **Interview Types**: Distribution by interview type (Technical, HR, etc.)
- **Interview Modes**: Distribution by mode (Online, Onsite, etc.)

### Customer Metrics
- **Total Customers**: Total number of customers in the system
- **Customer Status**: Distribution by status (Active, Inactive, Prospect)
- **Top Customers**: Customers with the most job postings

### Timesheet Metrics
- **Total Hours**: Total approved hours logged
- **Hours by Category**: Distribution of hours by task category
- **Top Recruiters**: Recruiters with the most hours logged

### Performance Metrics
- **Average Time to Fill**: Average days from job creation to hiring
- **Interview Conversion Rate**: Percentage of applications that get interviews
- **Hire Conversion Rate**: Percentage of interviews that result in hiring

## Usage Examples

### Frontend Dashboard Integration
```javascript
// Fetch analytics data
const fetchAnalytics = async () => {
  try {
    const response = await fetch('/api/analytics');
    const data = await response.json();
    
    if (data.success) {
      // Update dashboard components
      updateJobMetrics(data.data.jobs);
      updateCandidateMetrics(data.data.candidates);
      updateInterviewMetrics(data.data.interviews);
      updatePerformanceMetrics(data.data.performance);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};
```

### Chart Library Integration
```javascript
// For Chart.js or similar libraries
const createJobTrendChart = (trendData) => {
  const ctx = document.getElementById('jobTrendChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.monthlyJobTrend.map(item => item.month),
      datasets: [{
        label: 'Jobs Created',
        data: trendData.monthlyJobTrend.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });
};
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success - Analytics data retrieved successfully
- **500**: Internal Server Error - Database connection issues or processing errors

Error Response Format:
```json
{
  "success": false,
  "message": "Failed to fetch analytics data",
  "error": "Database connection error"
}
```

## Performance Considerations

- The API aggregates data from multiple database tables
- Consider implementing caching for better performance
- The response includes comprehensive data - consider pagination for large datasets
- Database indexes should be optimized for the queries used

## Security Notes

- Ensure proper authentication and authorization
- Validate user permissions before returning sensitive data
- Consider rate limiting for the analytics endpoint
- Sanitize any user inputs if query parameters are added in the future

## Future Enhancements

Potential additions to the analytics API:
- Date range filtering
- Department-specific analytics
- Export functionality (PDF, Excel)
- Real-time analytics with WebSocket
- Custom metric calculations
- Comparative analytics (month-over-month, year-over-year) 