# Candidate Management Endpoints

This document describes the new endpoints for managing candidates and their applications.

## Base URL
All endpoints are prefixed with `/api`

## Endpoints

### 1. Get All Candidates
**GET** `/candidates`

Returns a paginated list of all candidates with their applied jobs and resume download URLs.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of candidates per page (default: 10)
- `status` (optional): Filter by application status (pending, shortlisted, rejected, hired, all)
- `search` (optional): Search in firstName, lastName, email, or keySkills

#### Example Request
```
GET /api/candidates?page=1&limit=5&status=pending&search=john
```

#### Example Response
```json
{
  "candidates": [
    {
      "id": 1,
      "fullName": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "currentLocation": "New York, NY",
      "keySkills": "JavaScript, React, Node.js",
      "salaryExpectation": 80000,
      "noticePeriod": "2 weeks",
      "yearsOfExperience": "3 years",
      "remoteWork": true,
      "startDate": "Immediately",
      "portfolioUrl": "https://github.com/johndoe",
      "status": "pending",
      "appliedAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "resumeDownloadUrl": "http://localhost:5000/api/candidates/1/resume",
      "appliedJobs": [
        {
          "id": 1,
          "title": "Senior Frontend Developer",
          "company": "Tech Corp",
          "city": "New York",
          "jobType": "Full-time",
          "experienceLevel": "Mid-level",
          "workType": "HYBRID",
          "jobStatus": "ACTIVE",
          "salaryMin": 70000,
          "salaryMax": 90000,
          "createdAt": "2024-01-10T09:00:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCandidates": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get Candidate by ID
**GET** `/candidates/:candidateId`

Returns detailed information about a specific candidate including all their job applications.

#### Path Parameters
- `candidateId`: The ID of the candidate

#### Example Request
```
GET /api/candidates/1
```

#### Example Response
```json
{
  "id": 1,
  "fullName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "currentLocation": "New York, NY",
  "keySkills": "JavaScript, React, Node.js",
  "salaryExpectation": 80000,
  "noticePeriod": "2 weeks",
  "yearsOfExperience": "3 years",
  "remoteWork": true,
  "startDate": "Immediately",
  "portfolioUrl": "https://github.com/johndoe",
  "status": "pending",
  "appliedAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "resumeDownloadUrl": "http://localhost:5000/api/candidates/1/resume",
  "totalApplications": 3,
  "appliedJobs": [
    {
      "applicationId": 1,
      "applicationStatus": "pending",
      "appliedAt": "2024-01-15T10:30:00Z",
      "job": {
        "id": 1,
        "title": "Senior Frontend Developer",
        "company": "Tech Corp",
        "city": "New York",
        "jobType": "Full-time",
        "experienceLevel": "Mid-level",
        "workType": "HYBRID",
        "jobStatus": "ACTIVE",
        "salaryMin": 70000,
        "salaryMax": 90000,
        "createdAt": "2024-01-10T09:00:00Z"
      }
    },
    {
      "applicationId": 2,
      "applicationStatus": "shortlisted",
      "appliedAt": "2024-01-12T14:20:00Z",
      "job": {
        "id": 2,
        "title": "React Developer",
        "company": "Startup Inc",
        "city": "San Francisco",
        "jobType": "Full-time",
        "experienceLevel": "Entry-level",
        "workType": "REMOTE",
        "jobStatus": "ACTIVE",
        "salaryMin": 60000,
        "salaryMax": 80000,
        "createdAt": "2024-01-08T11:00:00Z"
      }
    }
  ]
}
```

### 3. Download Candidate Resume
**GET** `/candidates/:candidateId/resume`

Downloads the resume file for a specific candidate.

#### Path Parameters
- `candidateId`: The ID of the candidate

#### Example Request
```
GET /api/candidates/1/resume
```

#### Response
- **Success**: File download with appropriate headers
- **Error**: JSON error message

#### Supported File Types
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Images (.jpg, .jpeg, .png)

#### Example Error Response
```json
{
  "message": "Resume not found for this candidate"
}
```

## Error Responses

All endpoints may return the following error responses:

### 404 Not Found
```json
{
  "message": "Candidate not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error fetching candidates",
  "error": "Database connection error"
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get all candidates with pagination
const getCandidates = async (page = 1, limit = 10, status = 'all', search = '') => {
  const response = await fetch(`/api/candidates?page=${page}&limit=${limit}&status=${status}&search=${search}`);
  return await response.json();
};

// Get specific candidate details
const getCandidateDetails = async (candidateId) => {
  const response = await fetch(`/api/candidates/${candidateId}`);
  return await response.json();
};

// Download resume
const downloadResume = async (candidateId) => {
  const response = await fetch(`/api/candidates/${candidateId}/resume`);
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate_${candidateId}_resume.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
```

### cURL Examples

```bash
# Get all candidates
curl -X GET "http://localhost:5000/api/candidates?page=1&limit=5"

# Get candidates with filters
curl -X GET "http://localhost:5000/api/candidates?status=pending&search=developer"

# Get specific candidate
curl -X GET "http://localhost:5000/api/candidates/1"

# Download resume
curl -X GET "http://localhost:5000/api/candidates/1/resume" -o resume.pdf
``` 