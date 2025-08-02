# New Timesheet APIs Documentation

## Overview
This document describes the new APIs added to the timesheet system for handling attachments and approval data.

## 1. Attachment Upload API

### Endpoint
```
PUT /api/timesheet/:id/attachment
```

### Description
Uploads an attachment to a specific timesheet entry. The attachment information is stored as a comma-separated string in the `attachments` field.

### Parameters
- `id` (path parameter): Timesheet entry ID

### Request Body
```json
{
  "attachmentPath": "string",  // File path or URL
  "attachmentName": "string"   // Display name for the attachment
}
```

### Response
```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {
    "id": 1,
    "attachments": "Test Document:/uploads/test-document.pdf",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Example Usage
```javascript
const response = await fetch('/api/timesheet/1/attachment', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attachmentPath: "/uploads/report.pdf",
    attachmentName: "Monthly Report"
  })
});
```

## 2. Approval Data API

### Endpoint
```
GET /api/timesheet/approval
```

### Description
Retrieves timesheet entries that need approval along with summary statistics. This API is specifically designed for managers and administrators to review pending timesheets.

### Query Parameters
- `status` (optional): Filter by status (default: "SUBMITTED")
- `recruiterId` (optional): Filter by recruiter ID
- `recruiterName` (optional): Filter by recruiter name (partial match)
- `date` (optional): Filter by specific date
- `weekStart` (optional): Start date for weekly range
- `weekEnd` (optional): End date for weekly range

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "recruiterId": "rec001",
      "recruiterName": "John Doe",
      "recruiterEmail": "john@example.com",
      "date": "2024-01-15",
      "hours": 8,
      "entityType": "CANDIDATE",
      "taskType": "Candidate Sourcing",
      "status": "SUBMITTED",
      "submittedAt": "2024-01-15T17:00:00Z",
      "attachments": "Test Document:/uploads/test-document.pdf"
    }
  ],
  "summary": {
    "totalEntries": 5,
    "totalHours": 40.5,
    "totalBillableAmount": 2025.00,
    "averageHoursPerEntry": 8.1
  },
  "count": 5
}
```

### Example Usage
```javascript
// Get all submitted timesheets
const response = await fetch('/api/timesheet/approval?status=SUBMITTED');

// Get timesheets for a specific recruiter
const response = await fetch('/api/timesheet/approval?recruiterName=John');

// Get timesheets for a specific week
const response = await fetch('/api/timesheet/approval?weekStart=2024-01-15&weekEnd=2024-01-21');
```

## Frontend Integration

### 1. Attachment Upload Component
The recruiter timesheet component now includes:
- Attachment upload button (📎) in the actions column
- Attachment upload dialog with name and path inputs
- Integration with the attachment upload API

### 2. Approval Data Component
The timesheet approval component now includes:
- Summary statistics card showing total entries, hours, billable amount, and average hours
- Enhanced approval workflow with bulk operations
- Real-time data updates after approval actions

## Database Schema

### TimesheetEntry Model
The existing `TimesheetEntry` model already includes all necessary fields:
- `attachments`: String field for storing attachment information
- `submittedAt`: DateTime field for submission timestamp
- `approvedAt`: DateTime field for approval timestamp
- `approvedBy`: String field for approver identification

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (timesheet entry not found)
- `500`: Internal Server Error

## Testing

### Test Script
Use the provided test script to verify API functionality:
```bash
node test-new-apis.js
```

The test script covers:
1. Timesheet creation
2. Timesheet submission
3. Attachment upload
4. Approval data retrieval
5. Timesheet approval

## Security Considerations

1. **File Upload Security**: The current implementation stores file paths. In production, implement proper file upload with:
   - File type validation
   - File size limits
   - Secure file storage
   - Virus scanning

2. **Access Control**: Ensure proper authentication and authorization for:
   - Attachment uploads
   - Approval data access
   - Timesheet modifications

3. **Data Validation**: All inputs are validated on both frontend and backend

## Future Enhancements

1. **File Upload**: Implement actual file upload functionality with cloud storage
2. **Attachment Preview**: Add preview capabilities for uploaded files
3. **Bulk Attachment**: Allow multiple file uploads at once
4. **Attachment Categories**: Categorize attachments (receipts, reports, etc.)
5. **Approval Workflow**: Implement multi-level approval workflows
6. **Notifications**: Add email/SMS notifications for approval events

## API Versioning

These APIs are part of the v1 API. Future versions will maintain backward compatibility while adding new features.

## Support

For questions or issues with these APIs, refer to:
- Backend logs for detailed error information
- Frontend console for client-side errors
- Database logs for data-related issues 