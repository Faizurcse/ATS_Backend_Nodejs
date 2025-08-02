# Timesheet API Documentation

## Overview
Professional timesheet management system with comprehensive tracking capabilities for recruiters, including name and company name fields as requested.

## Base URL
`/api/timesheet`

## Endpoints

### 1. GET /timesheet - Get All Timesheet Entries

**Description:** Retrieve timesheet entries with optional filtering

**Query Parameters:**
- `recruiterId` (string, optional): Filter by recruiter ID
- `date` (string, optional): Filter by specific date (YYYY-MM-DD)
- `entityType` (string, optional): Filter by entity type (CUSTOMER, JOB, CANDIDATE)
- `entityId` (string, optional): Filter by entity ID
- `weekStart` (string, optional): Start date for weekly range (YYYY-MM-DD)
- `weekEnd` (string, optional): End date for weekly range (YYYY-MM-DD)
- `status` (string, optional): Filter by status (DRAFT, PENDING, APPROVED, REJECTED, SUBMITTED)
- `taskCategory` (string, optional): Filter by task category
- `priority` (string, optional): Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `billable` (boolean, optional): Filter by billable status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "recruiterId": "rec123",
      "recruiterName": "John Doe",
      "recruiterEmail": "john@example.com",
      "date": "2024-01-15",
      "startTime": "09:00",
      "endTime": "17:00",
      "hours": 8.00,
      "breakTime": 1.00,
      "entityType": "CANDIDATE",
      "entityId": "cand456",
      "entityName": "Jane Smith",
      "companyName": "Tech Corp",
      "taskType": "Candidate Interview",
      "taskCategory": "RECRUITMENT",
      "priority": "HIGH",
      "status": "PENDING",
      "billable": true,
      "billableRate": 50.00,
      "comments": "Technical interview for senior developer position",
      "attachments": "file1.pdf,file2.docx",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "submittedAt": null,
      "approvedAt": null,
      "approvedBy": null
    }
  ],
  "count": 1
}
```

### 2. POST /timesheet - Create Timesheet Entry

**Description:** Create a new timesheet entry

**Required Fields:**
- `recruiterId` (string): Recruiter ID
- `recruiterName` (string): Recruiter name
- `date` (string): Date in YYYY-MM-DD format
- `hours` (number): Hours worked (0-24)
- `entityType` (string): Entity type (CUSTOMER, JOB, CANDIDATE)
- `entityId` (string): Entity ID
- `entityName` (string): Entity name (candidate name, job title, or company name)
- `taskType` (string): Type of task performed

**Optional Fields:**
- `recruiterEmail` (string): Recruiter email
- `startTime` (string): Start time in HH:MM format
- `endTime` (string): End time in HH:MM format
- `breakTime` (number): Break time in hours (0-9.99)
- `companyName` (string): Company name
- `taskCategory` (string): Task category (RECRUITMENT, CLIENT_MANAGEMENT, ADMINISTRATIVE, TRAINING, MEETING, RESEARCH, OTHER)
- `priority` (string): Priority level (LOW, MEDIUM, HIGH, URGENT)
- `status` (string): Status (DRAFT, PENDING, APPROVED, REJECTED, SUBMITTED)
- `billable` (boolean): Whether time is billable (default: true)
- `billableRate` (number): Hourly rate for billing
- `comments` (string): Additional comments
- `attachments` (string): Comma-separated file paths

**Request Body Example:**
```json
{
  "recruiterId": "rec123",
  "recruiterName": "John Doe",
  "recruiterEmail": "john@example.com",
  "date": "2024-01-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "hours": 8.00,
  "breakTime": 1.00,
  "entityType": "CANDIDATE",
  "entityId": "cand456",
  "entityName": "Jane Smith",
  "companyName": "Tech Corp",
  "taskType": "Candidate Interview",
  "taskCategory": "RECRUITMENT",
  "priority": "HIGH",
  "status": "PENDING",
  "billable": true,
  "billableRate": 50.00,
  "comments": "Technical interview for senior developer position",
  "attachments": "file1.pdf,file2.docx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Timesheet entry created successfully",
  "data": {
    "id": 1,
    "recruiterId": "rec123",
    "recruiterName": "John Doe",
    "recruiterEmail": "john@example.com",
    "date": "2024-01-15",
    "startTime": "09:00",
    "endTime": "17:00",
    "hours": 8.00,
    "breakTime": 1.00,
    "entityType": "CANDIDATE",
    "entityId": "cand456",
    "entityName": "Jane Smith",
    "companyName": "Tech Corp",
    "taskType": "Candidate Interview",
    "taskCategory": "RECRUITMENT",
    "priority": "HIGH",
    "status": "PENDING",
    "billable": true,
    "billableRate": 50.00,
    "comments": "Technical interview for senior developer position",
    "attachments": "file1.pdf,file2.docx",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "submittedAt": null,
    "approvedAt": null,
    "approvedBy": null
  }
}
```

### 3. PUT /timesheet/:id - Update Timesheet Entry

**Description:** Update an existing timesheet entry

**URL Parameters:**
- `id` (number): Timesheet entry ID

**Request Body:** Same fields as POST, but all are optional

**Response:**
```json
{
  "success": true,
  "message": "Timesheet entry updated successfully",
  "data": {
    // Updated timesheet entry object
  }
}
```

### 4. DELETE /timesheet/:id - Delete Timesheet Entry

**Description:** Delete a timesheet entry (cannot delete approved entries)

**URL Parameters:**
- `id` (number): Timesheet entry ID

**Response:**
```json
{
  "success": true,
  "message": "Timesheet entry deleted successfully"
}
```

## Data Models

### TimesheetEntry Model
```typescript
interface TimesheetEntry {
  id: number;
  
  // Recruiter Information
  recruiterId: string;
  recruiterName: string;
  recruiterEmail?: string;
  
  // Time Tracking
  date: string; // YYYY-MM-DD format
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  hours: number; // 0-24 hours
  breakTime?: number; // 0-9.99 hours
  
  // Entity Information
  entityType: 'CUSTOMER' | 'JOB' | 'CANDIDATE';
  entityId: string;
  entityName: string;
  companyName?: string;
  
  // Task Details
  taskType: string;
  taskCategory: 'RECRUITMENT' | 'CLIENT_MANAGEMENT' | 'ADMINISTRATIVE' | 'TRAINING' | 'MEETING' | 'RESEARCH' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED';
  
  // Additional Information
  billable: boolean;
  billableRate?: number;
  comments?: string;
  attachments?: string; // Comma-separated file paths
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
}
```

## Enums

### EntityType
- `CUSTOMER`: Customer-related work
- `JOB`: Job posting related work
- `CANDIDATE`: Candidate-related work

### TaskCategory
- `RECRUITMENT`: Recruitment activities
- `CLIENT_MANAGEMENT`: Client relationship management
- `ADMINISTRATIVE`: Administrative tasks
- `TRAINING`: Training and development
- `MEETING`: Meetings and calls
- `RESEARCH`: Research activities
- `OTHER`: Other activities

### Priority
- `LOW`: Low priority tasks
- `MEDIUM`: Medium priority tasks
- `HIGH`: High priority tasks
- `URGENT`: Urgent tasks

### TimesheetStatus
- `DRAFT`: Draft entries
- `PENDING`: Pending approval
- `SUBMITTED`: Submitted for approval
- `APPROVED`: Approved entries
- `REJECTED`: Rejected entries

## Validation Rules

1. **Hours**: Must be between 0 and 24
2. **Break Time**: Must be between 0 and 9.99 hours
3. **Entity Type**: Must be CUSTOMER, JOB, or CANDIDATE
4. **Task Category**: Must be one of the predefined categories
5. **Priority**: Must be LOW, MEDIUM, HIGH, or URGENT
6. **Status**: Must be DRAFT, PENDING, APPROVED, REJECTED, or SUBMITTED
7. **Date Format**: Must be in YYYY-MM-DD format
8. **Time Format**: Must be in HH:MM format

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields: recruiterId, recruiterName, date, hours, entityType, entityId, entityName, taskType"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Timesheet entry not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create timesheet entry",
  "error": "Error details"
}
```

## Usage Examples

### Create a timesheet entry for candidate interview
```javascript
const response = await fetch('/api/timesheet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recruiterId: 'rec123',
    recruiterName: 'John Doe',
    recruiterEmail: 'john@example.com',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '17:00',
    hours: 8.00,
    breakTime: 1.00,
    entityType: 'CANDIDATE',
    entityId: 'cand456',
    entityName: 'Jane Smith',
    companyName: 'Tech Corp',
    taskType: 'Candidate Interview',
    taskCategory: 'RECRUITMENT',
    priority: 'HIGH',
    status: 'PENDING',
    billable: true,
    billableRate: 50.00,
    comments: 'Technical interview for senior developer position'
  })
});
```

### Get timesheet entries for a specific recruiter
```javascript
const response = await fetch('/api/timesheet?recruiterId=rec123&status=PENDING');
```

### Update a timesheet entry
```javascript
const response = await fetch('/api/timesheet/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'SUBMITTED',
    comments: 'Updated comments'
  })
});
```

### Delete a timesheet entry
```javascript
const response = await fetch('/api/timesheet/1', {
  method: 'DELETE'
});
``` 