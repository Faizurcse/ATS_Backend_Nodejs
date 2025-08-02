# Simplified Timesheet APIs

This document outlines the simplified timesheet APIs that have been implemented to match the frontend requirements.

## API Endpoints

### 1. GET /timesheet
**Get all timesheet entries**
- **Method**: GET
- **URL**: `/timesheet`
- **Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "recruiterName": "John Doe",
        "date": "2024-01-15",
        "hours": 8,
        "taskType": "Candidate Sourcing",
        "comments": "Sourced 5 new candidates",
        "status": "PENDING",
        "attachments": "",
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-15T09:00:00Z"
      }
    ],
    "count": 1
  }
  ```

### 2. POST /timesheet
**Create a new timesheet entry**
- **Method**: POST
- **URL**: `/timesheet`
- **Body**:
  ```json
  {
    "recruiterName": "John Doe",
    "date": "2024-01-15",
    "hours": 8,
    "taskType": "Candidate Sourcing",
    "comments": "Sourced 5 new candidates"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Timesheet entry created successfully",
    "data": {
      "id": 1,
      "recruiterName": "John Doe",
      "date": "2024-01-15",
      "hours": 8,
      "taskType": "Candidate Sourcing",
      "comments": "Sourced 5 new candidates",
      "status": "PENDING",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  }
  ```

### 3. PUT /timesheet/:id
**Update an existing timesheet entry**
- **Method**: PUT
- **URL**: `/timesheet/:id`
- **Body**:
  ```json
  {
    "recruiterName": "John Doe",
    "date": "2024-01-15",
    "hours": 8,
    "taskType": "Candidate Sourcing",
    "comments": "Updated comments"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Timesheet entry updated successfully",
    "data": {
      "id": 1,
      "recruiterName": "John Doe",
      "date": "2024-01-15",
      "hours": 8,
      "taskType": "Candidate Sourcing",
      "comments": "Updated comments",
      "status": "PENDING",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  }
  ```

### 4. DELETE /timesheet/:id
**Delete a timesheet entry**
- **Method**: DELETE
- **URL**: `/timesheet/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Timesheet entry deleted successfully"
  }
  ```

### 5. POST /timesheet/:id/approve
**Approve a timesheet entry**
- **Method**: POST
- **URL**: `/timesheet/:id/approve`
- **Body**:
  ```json
  {
    "approvedBy": "Manager John"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Timesheet entry approved successfully",
    "data": {
      "id": 1,
      "status": "APPROVED",
      "approvedBy": "Manager John",
      "approvedAt": "2024-01-16T10:00:00Z"
    }
  }
  ```

### 6. PUT /timesheet/:id/approval
**Update approval data**
- **Method**: PUT
- **URL**: `/timesheet/:id/approval`
- **Body**:
  ```json
  {
    "approvedBy": "New Manager",
    "approvedAt": "2024-01-17T10:00:00Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Approval data updated successfully",
    "data": {
      "id": 1,
      "approvedBy": "New Manager",
      "approvedAt": "2024-01-17T10:00:00Z"
    }
  }
  ```

### 7. DELETE /timesheet/:id/approval
**Delete approval data**
- **Method**: DELETE
- **URL**: `/timesheet/:id/approval`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Approval data deleted successfully",
    "data": {
      "id": 1,
      "status": "PENDING",
      "approvedBy": null,
      "approvedAt": null
    }
  }
  ```

### 8. POST /timesheet/:id/attachment
**Upload attachment for timesheet entry**
- **Method**: POST
- **URL**: `/timesheet/:id/attachment`
- **Body**: FormData with file or JSON
  ```json
  {
    "attachmentPath": "/path/to/file.pdf",
    "attachmentName": "document.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Attachment uploaded successfully",
    "data": {
      "id": 1,
      "attachments": "document.pdf:/path/to/file.pdf"
    }
  }
  ```

### 9. PUT /timesheet/:id/attachment
**Update attachment for timesheet entry**
- **Method**: PUT
- **URL**: `/timesheet/:id/attachment`
- **Body**:
  ```json
  {
    "oldAttachmentName": "document.pdf",
    "newAttachmentPath": "/path/to/new/file.pdf",
    "newAttachmentName": "updated_document.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Attachment updated successfully",
    "data": {
      "id": 1,
      "attachments": "updated_document.pdf:/path/to/new/file.pdf"
    }
  }
  ```

### 10. DELETE /timesheet/:id/attachment
**Delete attachment for timesheet entry**
- **Method**: DELETE
- **URL**: `/timesheet/:id/attachment`
- **Body**:
  ```json
  {
    "attachmentName": "document.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Attachment deleted successfully",
    "data": {
      "id": 1,
      "attachments": ""
    }
  }
  ```

## Data Model

### TimesheetEntry
```typescript
interface TimesheetEntry {
  id: number
  recruiterName: string
  date: string
  hours: number
  taskType: string
  comments?: string
  status: "PENDING" | "APPROVED"
  attachments?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
}
```

## Frontend Integration

The frontend service (`timesheet-service.ts`) has been updated to match these simplified APIs and includes:

1. **getTimesheetEntries()** - Get all timesheets
2. **createTimesheetEntry()** - Create new timesheet
3. **updateTimesheetEntry()** - Update existing timesheet
4. **deleteTimesheetEntry()** - Delete timesheet
5. **approveTimesheetEntry()** - Approve timesheet
6. **updateApprovalData()** - Update approval data
7. **deleteApprovalData()** - Delete approval data
8. **uploadAttachment()** - Upload attachment
9. **updateAttachment()** - Update attachment
10. **deleteAttachment()** - Delete attachment

## Notes

- All APIs return consistent response format with `success`, `message`, and `data` fields
- Error handling is implemented for all endpoints
- File uploads support PDF, DOC, DOCX, TXT, and image files
- Mock data is provided for development when API server is not available
- Simplified data model focuses on essential fields only 