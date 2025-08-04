# Dashboard API Endpoints

This document describes the dashboard API endpoints that provide aggregated data for the ATS dashboard.

## Base URL
```
http://localhost:5000/api/dashboard
```

## Endpoints

### 1. Get Comprehensive Dashboard Data
**GET** `/`

Returns comprehensive dashboard data including statistics, charts, recent items, and trends.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "summary": {
      "totalJobs": 25,
      "activeJobs": 15,
      "filledJobs": 5,
      "totalCandidates": 150,
      "pendingCandidates": 45,
      "shortlistedCandidates": 30,
      "hiredCandidates": 20,
      "totalInterviews": 80,
      "scheduledInterviews": 25,
      "completedInterviews": 50,
      "totalCustomers": 12,
      "activeCustomers": 10,
      "totalTimesheets": 200,
      "pendingTimesheets": 15,
      "approvedTimesheets": 180,
      "monthlyHours": 120.5
    },
    "charts": {
      "jobStatusDistribution": [
        { "status": "ACTIVE", "count": 15 },
        { "status": "FILLED", "count": 5 },
        { "status": "CLOSED", "count": 3 },
        { "status": "PAUSED", "count": 2 }
      ],
      "candidateStatusDistribution": [
        { "status": "pending", "count": 45 },
        { "status": "shortlisted", "count": 30 },
        { "status": "hired", "count": 20 },
        { "status": "rejected", "count": 55 }
      ],
      "interviewStatusDistribution": [
        { "status": "SCHEDULED", "count": 25 },
        { "status": "COMPLETED", "count": 50 },
        { "status": "CANCELLED", "count": 5 }
      ],
      "customerStatusDistribution": [
        { "status": "ACTIVE", "count": 10 },
        { "status": "INACTIVE", "count": 2 }
      ],
      "timesheetStatusDistribution": [
        { "status": "APPROVED", "count": 180 },
        { "status": "PENDING", "count": 15 },
        { "status": "DRAFT", "count": 5 }
      ],
      "workTypeDistribution": [
        { "workType": "ONSITE", "count": 10 },
        { "workType": "REMOTE", "count": 8 },
        { "workType": "HYBRID", "count": 7 }
      ],
      "industryDistribution": [
        { "industry": "Technology", "count": 5 },
        { "industry": "Healthcare", "count": 3 },
        { "industry": "Finance", "count": 4 }
      ],
      "taskCategoryDistribution": [
        { "category": "RECRUITMENT", "count": 120 },
        { "category": "CLIENT_MANAGEMENT", "count": 40 },
        { "category": "ADMINISTRATIVE", "count": 40 }
      ]
    },
    "recent": {
      "jobs": [
        {
          "id": 1,
          "title": "Senior Developer",
          "company": "Tech Corp",
          "jobStatus": "ACTIVE",
          "createdAt": "2024-01-15T10:00:00Z",
          "applications": { "_count": 12 }
        }
      ],
      "applications": [
        {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "status": "pending",
          "appliedAt": "2024-01-15T10:00:00Z",
          "job": {
            "title": "Senior Developer",
            "company": "Tech Corp"
          }
        }
      ],
      "upcomingInterviews": [
        {
          "id": 1,
          "candidateName": "John Doe",
          "interviewDate": "2024-01-20T10:00:00Z",
          "interviewTime": "10:00 AM",
          "interviewType": "Technical",
          "interviewMode": "Online",
          "platform": "Zoom",
          "interviewer": "Jane Smith"
        }
      ],
      "customers": [
        {
          "id": 1,
          "companyName": "Tech Corp",
          "industry": "Technology",
          "status": "ACTIVE",
          "createdAt": "2024-01-10T10:00:00Z",
          "jobs": { "_count": 5 }
        }
      ],
      "timesheets": [
        {
          "id": 1,
          "recruiterName": "Jane Smith",
          "date": "2024-01-15",
          "hours": 8.5,
          "taskType": "Candidate Sourcing",
          "status": "APPROVED",
          "createdAt": "2024-01-15T10:00:00Z"
        }
      ]
    },
    "trends": {
      "monthlyJobTrend": [
        { "date": "2024-01-01T00:00:00Z", "count": 5 },
        { "date": "2024-01-02T00:00:00Z", "count": 3 }
      ],
      "monthlyCandidateTrend": [
        { "date": "2024-01-01T00:00:00Z", "count": 12 },
        { "date": "2024-01-02T00:00:00Z", "count": 8 }
      ]
    }
  }
}
```

### 2. Get Quick Stats
**GET** `/quick-stats`

Returns quick statistics for dashboard widgets.

**Response:**
```json
{
  "success": true,
  "message": "Quick stats retrieved successfully",
  "data": {
    "activeJobs": 15,
    "pendingCandidates": 45,
    "scheduledInterviews": 25,
    "pendingTimesheets": 15,
    "newApplicationsThisMonth": 120,
    "newJobsThisMonth": 8
  }
}
```

## Data Structure

### Summary Data
- **totalJobs**: Total number of job postings
- **activeJobs**: Number of active job postings
- **filledJobs**: Number of filled job postings
- **totalCandidates**: Total number of candidate applications
- **pendingCandidates**: Number of pending applications
- **shortlistedCandidates**: Number of shortlisted candidates
- **hiredCandidates**: Number of hired candidates
- **totalInterviews**: Total number of interviews
- **scheduledInterviews**: Number of scheduled interviews
- **completedInterviews**: Number of completed interviews
- **totalCustomers**: Total number of customers
- **activeCustomers**: Number of active customers
- **totalTimesheets**: Total number of timesheet entries
- **pendingTimesheets**: Number of pending timesheets
- **approvedTimesheets**: Number of approved timesheets
- **monthlyHours**: Total hours logged this month

### Charts Data
- **jobStatusDistribution**: Distribution of jobs by status
- **candidateStatusDistribution**: Distribution of candidates by status
- **interviewStatusDistribution**: Distribution of interviews by status
- **customerStatusDistribution**: Distribution of customers by status
- **timesheetStatusDistribution**: Distribution of timesheets by status
- **workTypeDistribution**: Distribution of jobs by work type
- **industryDistribution**: Distribution of customers by industry
- **taskCategoryDistribution**: Distribution of timesheet tasks by category

### Recent Data
- **jobs**: Recent job postings (last 10)
- **applications**: Recent candidate applications (last 10)
- **upcomingInterviews**: Upcoming interviews (next 7 days)
- **customers**: Recent customers (last 10)
- **timesheets**: Recent timesheet entries (last 10)

### Trends Data
- **monthlyJobTrend**: Job creation trend for current month
- **monthlyCandidateTrend**: Candidate application trend for current month

## Error Responses

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch dashboard data",
  "error": "Database connection error"
}
```

## Usage Examples

### Frontend Integration
```javascript
// Fetch comprehensive dashboard data
const response = await fetch('/api/dashboard/dashboard');
const data = await response.json();

// Fetch quick stats
const quickStatsResponse = await fetch('/api/dashboard/quick-stats');
const quickStats = await quickStatsResponse.json();
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/dashboard');
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, loading, error };
};
``` 