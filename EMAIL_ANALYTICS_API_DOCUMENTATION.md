# Email Analytics API Documentation

## Overview
The Email Analytics API provides comprehensive email analytics data for the entire project in a single GET endpoint. This API analyzes email data across all major entities in the system including jobs, candidates, customers, interviews, and timesheets.

## Base URL
```
http://localhost:5000/api/email-analytics
```

## Endpoints

### GET /api/email-analytics
Get comprehensive email analytics for the entire project.

**URL:** `/api/email-analytics`

**Method:** `GET`

**Headers:**
```
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "message": "Email analytics data retrieved successfully",
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "period": {
      "current": {
        "month": "2024-01-01T00:00:00.000Z",
        "year": "2024-01-01T00:00:00.000Z"
      }
    },
    "jobEmails": {
      "totalEmails": 150,
      "totalJobs": 200,
      "emailCoverage": "75.00",
      "emailsThisMonth": 25,
      "emailsThisYear": 150,
      "topEmailDomains": [
        {
          "email": "hr@company.com",
          "count": 15
        }
      ],
      "topCompaniesByEmail": [
        {
          "company": "Tech Corp",
          "emailCount": 20
        }
      ]
    },
    "candidateEmails": {
      "totalEmails": 500,
      "totalCandidates": 600,
      "emailCoverage": "83.33",
      "emailsThisMonth": 80,
      "emailsThisYear": 500,
      "topEmailDomains": [
        {
          "email": "candidate@email.com",
          "count": 50
        }
      ],
      "emailByStatus": [
        {
          "status": "APPLIED",
          "count": 200
        }
      ]
    },
    "customerEmails": {
      "totalEmails": 100,
      "totalCustomers": 120,
      "emailCoverage": "83.33",
      "topEmailDomains": [
        {
          "email": "contact@customer.com",
          "count": 10
        }
      ],
      "emailByStatus": [
        {
          "status": "ACTIVE",
          "count": 80
        }
      ],
      "emailByPriority": [
        {
          "priority": "HIGH",
          "count": 30
        }
      ]
    },
    "interviewEmails": {
      "totalEmails": 80,
      "totalInterviews": 100,
      "emailCoverage": "80.00",
      "emailsThisMonth": 15,
      "emailByStatus": [
        {
          "status": "SCHEDULED",
          "count": 40
        }
      ]
    },
    "timesheetEmails": {
      "totalEmails": 200,
      "totalTimesheets": 250,
      "emailCoverage": "80.00",
      "emailsThisMonth": 30,
      "emailsThisYear": 200,
      "emailByStatus": [
        {
          "status": "APPROVED",
          "count": 120
        }
      ]
    },
    "trends": {
      "monthlyTrend": [
        {
          "date": "2024-01-15T00:00:00.000Z",
          "emailCount": 25
        }
      ],
      "topDomains": [
        {
          "domain": "gmail.com",
          "count": 100
        }
      ],
      "insights": {
        "totalUniqueDomains": 50,
        "averageEmailsPerDomain": 20.5
      }
    },
    "summary": {
      "totalEmailsSent": 1030,
      "totalEmailsThisMonth": 180,
      "totalEmailsThisYear": 1030
    }
  }
}
```

## Response Fields Explanation

### Top Level Fields
- **timestamp**: Current timestamp when the analytics were generated
- **period**: Time period information for the analytics
- **jobEmails**: Email analytics specific to job postings
- **candidateEmails**: Email analytics specific to candidate applications
- **customerEmails**: Email analytics specific to customers
- **interviewEmails**: Email analytics specific to interview schedules
- **timesheetEmails**: Email analytics specific to timesheet entries
- **trends**: Email trends and insights across the system
- **summary**: Overall summary of all email analytics

### Job Emails Analytics
- **totalEmails**: Total number of jobs with email addresses
- **totalJobs**: Total number of jobs in the system
- **emailCoverage**: Percentage of jobs that have email addresses
- **emailsThisMonth**: Number of jobs with emails created this month
- **emailsThisYear**: Number of jobs with emails created this year
- **topEmailDomains**: Top 10 most common email addresses used in jobs
- **topCompaniesByEmail**: Top 5 companies with the most email addresses

### Candidate Emails Analytics
- **totalEmails**: Total number of candidates with email addresses
- **totalCandidates**: Total number of candidates in the system
- **emailCoverage**: Percentage of candidates that have email addresses
- **emailsThisMonth**: Number of candidates with emails created this month
- **emailsThisYear**: Number of candidates with emails created this year
- **topEmailDomains**: Top 10 most common email addresses used by candidates
- **emailByStatus**: Distribution of emails by candidate application status

### Customer Emails Analytics
- **totalEmails**: Total number of customers with email addresses
- **totalCustomers**: Total number of customers in the system
- **emailCoverage**: Percentage of customers that have email addresses
- **topEmailDomains**: Top 10 most common email addresses used by customers
- **emailByStatus**: Distribution of emails by customer status
- **emailByPriority**: Distribution of emails by customer priority

### Interview Emails Analytics
- **totalEmails**: Total number of interviews with candidate email addresses
- **totalInterviews**: Total number of interviews in the system
- **emailCoverage**: Percentage of interviews that have candidate email addresses
- **emailsThisMonth**: Number of interviews with emails scheduled this month
- **emailByStatus**: Distribution of emails by interview status

### Timesheet Emails Analytics
- **totalEmails**: Total number of timesheets with email addresses (candidate or recruiter)
- **totalTimesheets**: Total number of timesheets in the system
- **emailCoverage**: Percentage of timesheets that have email addresses
- **emailsThisMonth**: Number of timesheets with emails created this month
- **emailsThisYear**: Number of timesheets with emails created this year
- **emailByStatus**: Distribution of emails by timesheet status

### Trends and Insights
- **monthlyTrend**: Monthly trend of email usage in job postings
- **topDomains**: Top 5 most common email domains across the system
- **insights**: 
  - **totalUniqueDomains**: Total number of unique email domains
  - **averageEmailsPerDomain**: Average number of emails per domain

### Summary
- **totalEmailsSent**: Total number of emails across all entities
- **totalEmailsThisMonth**: Total number of emails created this month
- **totalEmailsThisYear**: Total number of emails created this year

## Error Responses

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch email analytics data",
  "error": "Error message details"
}
```

## Usage Examples

### Using cURL
```bash
curl -X GET http://localhost:5000/api/email-analytics \
  -H "Content-Type: application/json"
```

### Using JavaScript/Fetch
```javascript
fetch('http://localhost:5000/api/email-analytics', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Email Analytics:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

### Using Axios
```javascript
import axios from 'axios';

const getEmailAnalytics = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/email-analytics');
    console.log('Email Analytics:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching email analytics:', error);
  }
};
```

## Notes
- The API provides real-time analytics based on the current database state
- All percentages are calculated and returned as strings with 2 decimal places
- Email coverage represents the percentage of records that have email addresses
- The API automatically handles database connection issues and provides appropriate error responses
- All timestamps are returned in ISO 8601 format
