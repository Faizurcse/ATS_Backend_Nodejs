# Job Details API Endpoints

This document describes the new job details API endpoints that provide comprehensive information about jobs including status, application counts, and other metrics.

## Base URL
```
/api/job-details
```

## Endpoints

### 1. Get My Jobs (Complete Details)
**GET** `/api/job-details/my-jobs`

Returns all jobs with complete details including applications, statistics, and candidate information in a single comprehensive API call.

**Response:**
```json
{
  "success": true,
  "message": "My jobs retrieved successfully",
  "data": {
    "jobs": [
      {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "department": "Engineering",
        "internalSPOC": "John Doe",
        "recruiter": "Jane Smith",
        "jobType": "Full-time",
        "experienceLevel": "Mid-level",
        "country": "USA",
        "city": "New York",
        "fullLocation": "New York, NY, USA",
        "workType": "HYBRID",
        "jobStatus": "ACTIVE",
        "salaryMin": 80000,
        "salaryMax": 120000,
        "priority": "High",
        "description": "Job description...",
        "requirements": "Job requirements...",
        "requiredSkills": "JavaScript, React, Node.js",
        "benefits": "Health insurance, 401k...",
        "createdAt": "2024-01-15T10:00:00Z",
        
        // Application statistics
        "totalApplications": 25,
        "pendingApplications": 15,
        "shortlistedApplications": 5,
        "rejectedApplications": 3,
        "hiredApplications": 2,
        
        // Position information
        "openPositions": 1,
        "filledPositions": 2,
        "availablePositions": -1,
        
        // Performance metrics
        "applicationRate": 2.5,
        "daysSincePosted": 10,
        
        // Status indicators
        "isActive": true,
        "isPaused": false,
        "isClosed": false,
        "isFilled": false,
        
        // Quick stats
        "hasApplications": true,
        "hasShortlisted": true,
        "hasHired": true,
        
        // Recent applications (last 5)
        "recentApplications": [
          {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "location": "New York",
            "status": "pending",
            "appliedAt": "2024-01-20T10:00:00Z",
            "keySkills": "JavaScript, React",
            "salaryExpectation": 90000,
            "yearsOfExperience": "3-5 years",
            "remoteWork": true,
            "startDate": "Immediate",
            "portfolioUrl": "https://github.com/johndoe"
          }
        ],
        
        // All applications
        "allApplications": [
          // ... all applications for this job
        ]
      }
    ],
    "summary": {
      "totalJobs": 10,
      "activeJobs": 5,
      "pausedJobs": 2,
      "closedJobs": 2,
      "filledJobs": 1,
      "totalApplications": 150,
      "totalOpenPositions": 5,
      "totalFilledPositions": 3,
      "totalAvailablePositions": 2
    },
    "statusBreakdown": {
      "active": {
        "count": 5,
        "applications": 75,
        "openPositions": 5
      },
      "paused": {
        "count": 2,
        "applications": 25
      },
      "closed": {
        "count": 2,
        "applications": 30
      },
      "filled": {
        "count": 1,
        "applications": 20,
        "filledPositions": 3
      }
    }
  }
}
```

### 2. Get All Job Details
**GET** `/api/job-details/all`

Returns all jobs with detailed information including application counts, status, and performance metrics.

**Response:**
```json
{
  "success": true,
  "message": "Job details retrieved successfully",
  "data": {
    "jobs": [
      {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "department": "Engineering",
        "internalSPOC": "John Doe",
        "recruiter": "Jane Smith",
        "jobType": "Full-time",
        "experienceLevel": "Mid-level",
        "country": "USA",
        "city": "New York",
        "fullLocation": "New York, NY, USA",
        "workType": "HYBRID",
        "jobStatus": "ACTIVE",
        "salaryMin": 80000,
        "salaryMax": 120000,
        "priority": "High",
        "description": "Job description...",
        "requirements": "Job requirements...",
        "requiredSkills": "JavaScript, React, Node.js",
        "benefits": "Health insurance, 401k...",
        "createdAt": "2024-01-15T10:00:00Z",
        
        // Application statistics
        "totalApplications": 25,
        "pendingApplications": 15,
        "shortlistedApplications": 5,
        "rejectedApplications": 3,
        "hiredApplications": 2,
        
        // Position and status information
        "openPositions": 1,
        "filledPositions": 2,
        "availablePositions": -1,
        
        // Performance metrics
        "applicationRate": 2.5,
        "daysSincePosted": 10,
        
        // Status indicators
        "isActive": true,
        "isPaused": false,
        "isClosed": false,
        "isFilled": false,
        
        // Quick stats
        "hasApplications": true,
        "hasShortlisted": true,
        "hasHired": true
      }
    ],
    "summary": {
      "totalJobs": 10,
      "activeJobs": 5,
      "pausedJobs": 2,
      "closedJobs": 2,
      "filledJobs": 1,
      "totalApplications": 150,
      "totalOpenPositions": 5,
      "totalFilledPositions": 3,
      "totalAvailablePositions": 2
    }
  }
}
```

### 2. Get Job Details by ID
**GET** `/api/job-details/job/:id`

Returns detailed information for a specific job including all applications and statistics.

**Parameters:**
- `id` (number): Job ID

**Response:**
```json
{
  "success": true,
  "message": "Job details retrieved successfully",
  "data": {
    "job": {
      "id": 1,
      "title": "Software Engineer",
      "company": "Tech Corp",
      // ... all job fields
    },
    "statistics": {
      "totalApplications": 25,
      "pendingApplications": 15,
      "shortlistedApplications": 5,
      "rejectedApplications": 3,
      "hiredApplications": 2,
      "applicationRate": 2.5,
      "daysSincePosted": 10,
      "openPositions": 1,
      "filledPositions": 2,
      "availablePositions": -1
    },
    "recentApplications": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "currentLocation": "New York",
        "status": "pending",
        "appliedAt": "2024-01-20T10:00:00Z",
        "keySkills": "JavaScript, React",
        "salaryExpectation": 90000,
        "yearsOfExperience": "3-5 years",
        "remoteWork": true,
        "startDate": "Immediate",
        "portfolioUrl": "https://github.com/johndoe"
      }
    ],
    "allApplications": [
      // ... all applications for this job
    ]
  }
}
```

### 3. Get Job Details by Status
**GET** `/api/job-details/status/:status`

Returns jobs filtered by status with detailed information.

**Parameters:**
- `status` (string): Job status (ACTIVE, PAUSED, CLOSED, FILLED)

**Response:**
```json
{
  "success": true,
  "message": "Jobs with status ACTIVE retrieved successfully",
  "data": {
    "status": "ACTIVE",
    "jobs": [
      {
        "id": 1,
        "title": "Software Engineer",
        "company": "Tech Corp",
        "department": "Engineering",
        "recruiter": "Jane Smith",
        "jobType": "Full-time",
        "experienceLevel": "Mid-level",
        "city": "New York",
        "workType": "HYBRID",
        "jobStatus": "ACTIVE",
        "salaryMin": 80000,
        "salaryMax": 120000,
        "createdAt": "2024-01-15T10:00:00Z",
        "totalApplications": 25,
        "pendingApplications": 15,
        "shortlistedApplications": 5,
        "rejectedApplications": 3,
        "hiredApplications": 2,
        "applicationRate": 2.5,
        "daysSincePosted": 10
      }
    ],
    "summary": {
      "totalJobs": 5,
      "totalApplications": 150,
      "averageApplicationsPerJob": 30.0
    }
  }
}
```

## Error Responses

### 404 - Job Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 400 - Invalid Status
```json
{
  "success": false,
  "message": "Invalid status. Must be one of: ACTIVE, PAUSED, CLOSED, FILLED"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error fetching job details",
  "error": "Error message details"
}
```

## Features

### Application Statistics
- **totalApplications**: Total number of applications received
- **pendingApplications**: Applications under review
- **shortlistedApplications**: Applications that passed initial screening
- **rejectedApplications**: Applications that were rejected
- **hiredApplications**: Applications that resulted in hiring

### Position Information
- **openPositions**: Number of open positions (1 for active jobs)
- **filledPositions**: Number of positions filled
- **availablePositions**: Remaining open positions

### Performance Metrics
- **applicationRate**: Applications received per day since posting
- **daysSincePosted**: Number of days since the job was posted

### Status Indicators
- **isActive**: Whether the job is currently active
- **isPaused**: Whether the job posting is paused
- **isClosed**: Whether the job posting is closed
- **isFilled**: Whether all positions are filled

### Quick Stats
- **hasApplications**: Whether the job has received any applications
- **hasShortlisted**: Whether any candidates have been shortlisted
- **hasHired**: Whether any candidates have been hired 