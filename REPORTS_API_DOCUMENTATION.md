# Reports API Documentation

## Overview

The Reports API provides a single comprehensive endpoint that returns all project data for the ATS (Applicant Tracking System) backend. This production-level API offers detailed insights into jobs, candidates, interviews, customers, and timesheets with advanced features like caching and performance monitoring.

## Base URL

```
http://localhost:5000/api/reports-all
```

## Endpoint

### GET /api/reports-all

**Description:** Get comprehensive project reports with all data from the entire system.

**URL:** `GET /api/reports-all`

**No Query Parameters Required**

**Example Request:**

```bash
GET /api/reports-all
```

**Response Structure:**

```json
{
  "success": true,
  "message": "All project reports generated successfully",
  "data": {
    "metadata": {
      "generatedAt": "2024-01-15T10:30:00.000Z",
      "totalRecords": 532
    },
    "summary": {
      "overall": {
        "totalJobs": 25,
        "totalCandidates": 150,
        "totalInterviews": 45,
        "totalCustomers": 12,
        "totalTimesheets": 300,
        "totalActivities": 532
      },
      "jobs": {
        "total": 25,
        "active": 15,
        "filled": 8,
        "paused": 2,
        "closed": 0,
        "fillRate": "32.00"
      },
      "candidates": {
        "total": 150,
        "pending": 45,
        "shortlisted": 30,
        "rejected": 60,
        "hired": 15,
        "conversionRate": "10.00"
      },
      "interviews": {
        "total": 45,
        "scheduled": 10,
        "completed": 30,
        "cancelled": 3,
        "rescheduled": 2,
        "completionRate": "66.67"
      },
      "customers": {
        "total": 12,
        "active": 8,
        "inactive": 2,
        "prospect": 1,
        "suspended": 1,
        "activeRate": "66.67"
      },
      "timesheets": {
        "total": 300,
        "totalHours": 2400.50,
        "billableHours": 2000.25,
        "approved": 280,
        "pending": 20,
        "approvalRate": "93.33"
      }
    },
    "details": {
      "jobs": {
        "data": [...],
        "total": 25,
        "statusBreakdown": [...],
        "workTypeBreakdown": [...],
        "topCompanies": [...]
      },
      "candidates": {
        "data": [...],
        "total": 150,
        "statusBreakdown": [...],
        "topSkills": [...],
        "experienceBreakdown": [...]
      },
      "interviews": {
        "data": [...],
        "total": 45,
        "statusBreakdown": [...],
        "typeBreakdown": [...],
        "modeBreakdown": [...]
      },
      "customers": {
        "data": [...],
        "total": 12,
        "statusBreakdown": [...],
        "priorityBreakdown": [...],
        "industryBreakdown": [...]
      },
      "timesheets": {
        "data": [...],
        "total": 300,
        "taskCategoryBreakdown": [...],
        "entityTypeBreakdown": [...],
        "priorityBreakdown": [...]
      }
    },
    "insights": [
      {
        "type": "warning",
        "category": "jobs",
        "message": "Job fill rate is below 30%. Consider reviewing job requirements or recruitment strategies.",
        "metric": "32.0% fill rate"
      }
    ],
    "trends": [
      {
        "category": "jobs",
        "trend": "increasing",
        "change": 5,
        "period": "monthly"
      }
    ]
  },
  "cached": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Features

### 1. Production-Level Error Handling

- **Database Connection Errors:** Automatic retry and graceful degradation
- **Validation Errors:** Detailed error messages for invalid parameters
- **Caching:** 5-minute cache for improved performance

### 2. Comprehensive Analytics

#### Job Analytics
- Total, active, filled, paused, and closed jobs
- Fill rate calculations
- Work type breakdown (onsite, remote, hybrid)
- Top companies by job count
- Status distribution

#### Candidate Analytics
- Application status tracking
- Conversion rates
- Top skills analysis
- Experience level breakdown
- Interview scheduling statistics

#### Interview Analytics
- Completion rates
- Interview type and mode breakdown
- Scheduling efficiency metrics
- Cancellation and rescheduling tracking

#### Customer Analytics
- Customer status and priority breakdown
- Industry distribution
- Revenue and contract value tracking
- Geographic distribution

#### Timesheet Analytics
- Total and billable hours
- Task category breakdown
- Approval rates
- Entity type distribution
- Priority level analysis

### 3. Performance Insights

The API automatically analyzes data and provides actionable insights:

- **Low Fill Rate Warning:** Alerts when job fill rate is below 30%
- **Low Conversion Rate Warning:** Alerts when candidate conversion rate is below 10%
- **Interview Completion Warning:** Alerts when completion rate is below 80%

### 4. Trend Analysis

- Monthly job posting trends
- Candidate application trends
- Performance metrics over time
- Comparative analysis

### 5. Advanced Features

#### Caching
- 5-minute cache duration for improved performance
- Cache invalidation on data updates
- Memory-efficient caching strategy

#### Request Logging
- Request/response logging with timing
- Performance metrics collection

## Error Responses

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to complete getAllProjectReports",
  "error": "Internal server error",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "message": "Database connection temporarily unavailable",
  "error": "Please try again in a few moments",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Usage Examples

### JavaScript/Node.js
```javascript
const fetchAllReports = async () => {
  const response = await fetch('/api/reports-all');
  return await response.json();
};

// Usage
const reports = await fetchAllReports();
console.log('Total jobs:', reports.data.summary.jobs.total);
console.log('Total candidates:', reports.data.summary.candidates.total);
```

### Python
```python
import requests

def get_all_reports():
    url = 'http://localhost:5000/api/reports-all'
    response = requests.get(url)
    return response.json()

# Usage
reports = get_all_reports()
print(f"Total jobs: {reports['data']['summary']['jobs']['total']}")
```

### cURL
```bash
# Get all project reports
curl "http://localhost:5000/api/reports-all"
```

## Performance Considerations

1. **Caching:** Reports are cached for 5 minutes to reduce database load
2. **Parallel Processing:** All data queries run in parallel for better performance
3. **Comprehensive Data:** Returns all project data in a single request

## Monitoring and Logging

- Request/response logging with timing
- Error tracking and reporting
- Performance metrics collection

## Security Features

- Input validation and sanitization
- Error message sanitization in production
- Database connection security

## Best Practices

1. **Leverage Caching:** Take advantage of the 5-minute cache
2. **Handle Errors Gracefully:** Implement proper error handling
3. **Monitor Performance:** Track response times and cache hit rates

## Troubleshooting

### Common Issues

1. **Database Connection Issues:** Check database connectivity
2. **Large Response Times:** The API returns comprehensive data, so expect larger response sizes
3. **Memory Usage:** Monitor memory usage for large datasets

### Debug Information

- Review server logs for detailed error information
- Monitor response times and cache hit rates
- Verify database connection status

## Future Enhancements

- Export functionality (PDF, Excel, CSV)
- Real-time notifications
- Advanced filtering options
- Custom report templates
- Scheduled report generation
- Email delivery of reports
- Advanced analytics and ML insights 