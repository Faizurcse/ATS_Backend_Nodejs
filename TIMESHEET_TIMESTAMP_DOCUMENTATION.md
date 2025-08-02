# Timesheet Timestamp Functionality Documentation

## Overview

The timesheet system now includes comprehensive timestamp tracking for the submission and approval workflow. This document outlines the implementation details for the "Submitted At", "Approved At", and "Approved By" fields.

## Database Schema

### TimesheetEntry Model Fields

```prisma
model TimesheetEntry {
  // ... other fields ...
  
  // Timestamp fields
  submittedAt     DateTime? // When timesheet was submitted
  approvedAt      DateTime? // When timesheet was approved
  approvedBy      String?   // ID of the person who approved
  
  // ... other fields ...
}
```

## Backend Implementation

### API Endpoints

#### 1. Update Timesheet Entry (Submit)
- **Endpoint**: `PUT /api/timesheet/:id`
- **Purpose**: Update timesheet status and set submission timestamp
- **Body**: `{ status: "SUBMITTED" }`
- **Response**: Updated timesheet with `submittedAt` timestamp

#### 2. Approve/Reject Timesheet Entry
- **Endpoint**: `PUT /api/timesheet/:id/approve`
- **Purpose**: Approve or reject timesheet and set approval timestamp
- **Body**: 
  ```json
  {
    "status": "APPROVED" | "REJECTED",
    "approvedBy": "string",
    "comments": "string (optional)"
  }
  ```
- **Response**: Updated timesheet with `approvedAt` and `approvedBy` fields

### Controller Logic

#### Submission Logic
```javascript
// In updateTimesheetEntry function
if (status === 'SUBMITTED' && existingEntry.status !== 'SUBMITTED') {
  updateData.submittedAt = new Date();
}
```

#### Approval Logic
```javascript
// In approveTimesheetEntry function
const updateData = {
  status: status,
  approvedBy: approvedBy || null,
  approvedAt: status === 'APPROVED' ? new Date() : null
};
```

## Frontend Implementation

### Components

#### 1. Recruiter Timesheet Component (`recruiter-timesheet.tsx`)

**Features:**
- Individual "Submit" button for each pending timesheet
- "Submit All Pending" bulk action
- Display of timestamp fields in table
- Status-based action visibility

**Key Functions:**
```typescript
const handleSubmitTimesheet = async (id: number) => {
  await timesheetService.updateTimesheetEntry(id, {
    status: "SUBMITTED"
  });
};

const handleSubmitAllPending = async () => {
  const pendingTimesheets = timesheets.filter(t => t.status === 'PENDING');
  const promises = pendingTimesheets.map(timesheet => 
    timesheetService.updateTimesheetEntry(timesheet.id, {
      status: "SUBMITTED"
    })
  );
  await Promise.all(promises);
};
```

#### 2. Timesheet Approval Component (`timesheet-approval.tsx`)

**Features:**
- Bulk approval/rejection functionality
- Detailed timestamp display in approval dialog
- Bulk approval settings form
- Status-based filtering

**Key Functions:**
```typescript
const handleBulkApprove = async () => {
  const submittedTimesheets = timesheets.filter(t => t.status === 'SUBMITTED');
  const promises = submittedTimesheets.map(timesheet => 
    timesheetService.approveTimesheetEntry(timesheet.id, {
      status: "APPROVED",
      approvedBy: approvalData.approvedBy,
      comments: approvalData.comments || "Bulk approved"
    })
  );
  await Promise.all(promises);
};
```

### Table Display

Both components display timestamp information in their tables:

```typescript
<TableCell className="whitespace-nowrap">
  {timesheet.submittedAt ? format(new Date(timesheet.submittedAt), "MMM dd, yyyy HH:mm") : "N/A"}
</TableCell>
<TableCell className="whitespace-nowrap">
  {timesheet.approvedAt ? format(new Date(timesheet.approvedAt), "MMM dd, yyyy HH:mm") : "N/A"}
</TableCell>
<TableCell className="whitespace-nowrap">
  {timesheet.approvedBy || "N/A"}
</TableCell>
```

## Workflow States

### Timesheet Status Flow

1. **DRAFT** → **PENDING** (Initial creation)
2. **PENDING** → **SUBMITTED** (User submits timesheet)
   - Sets `submittedAt` timestamp
3. **SUBMITTED** → **APPROVED** (Manager approves)
   - Sets `approvedAt` timestamp
   - Sets `approvedBy` field
4. **SUBMITTED** → **REJECTED** (Manager rejects)
   - Sets `approvedAt` timestamp
   - Sets `approvedBy` field

### Status Transitions

| Current Status | Allowed Transitions | Timestamp Changes |
|----------------|-------------------|------------------|
| DRAFT | PENDING | None |
| PENDING | SUBMITTED | `submittedAt` set |
| SUBMITTED | APPROVED, REJECTED | `approvedAt` and `approvedBy` set |
| APPROVED | None (final state) | None |
| REJECTED | PENDING (resubmit) | Clear `approvedAt` and `approvedBy` |

## API Usage Examples

### Submit a Timesheet

```javascript
// Frontend
await timesheetService.updateTimesheetEntry(timesheetId, {
  status: "SUBMITTED"
});

// Backend API call
PUT /api/timesheet/123
{
  "status": "SUBMITTED"
}
```

### Approve a Timesheet

```javascript
// Frontend
await timesheetService.approveTimesheetEntry(timesheetId, {
  status: "APPROVED",
  approvedBy: "John Manager",
  comments: "Approved after review"
});

// Backend API call
PUT /api/timesheet/123/approve
{
  "status": "APPROVED",
  "approvedBy": "John Manager",
  "comments": "Approved after review"
}
```

### Bulk Operations

```javascript
// Submit all pending timesheets
const pendingTimesheets = timesheets.filter(t => t.status === 'PENDING');
const promises = pendingTimesheets.map(timesheet => 
  timesheetService.updateTimesheetEntry(timesheet.id, {
    status: "SUBMITTED"
  })
);
await Promise.all(promises);

// Approve all submitted timesheets
const submittedTimesheets = timesheets.filter(t => t.status === 'SUBMITTED');
const promises = submittedTimesheets.map(timesheet => 
  timesheetService.approveTimesheetEntry(timesheet.id, {
    status: "APPROVED",
    approvedBy: "Manager Name",
    comments: "Bulk approved"
  })
);
await Promise.all(promises);
```

## Testing

### Test Script

Run the test script to verify functionality:

```bash
cd ATS_Backend_Nodejs
node test-timesheet-timestamps.js
```

The test script will:
1. Create a new timesheet entry
2. Submit the timesheet (sets `submittedAt`)
3. Approve the timesheet (sets `approvedAt` and `approvedBy`)
4. Verify all timestamp fields are properly set
5. Validate the workflow logic

### Manual Testing

1. **Create Timesheet**: Use the recruiter timesheet form
2. **Submit Timesheet**: Click "Submit" button on pending timesheets
3. **Approve Timesheet**: Use the approval component to approve/reject
4. **Verify Timestamps**: Check that timestamps are set correctly

## Error Handling

### Validation Rules

1. **Status Transitions**: Only valid status transitions are allowed
2. **Required Fields**: `approvedBy` is required for approval/rejection
3. **Timestamp Logic**: 
   - `submittedAt` only set when transitioning to SUBMITTED
   - `approvedAt` only set when approving/rejecting
   - `approvedBy` required for approval/rejection

### Error Responses

```javascript
// Invalid status transition
{
  "success": false,
  "message": "Invalid status transition from APPROVED to PENDING"
}

// Missing required field
{
  "success": false,
  "message": "approvedBy is required for approval"
}
```

## Security Considerations

1. **Authorization**: Ensure only authorized users can approve timesheets
2. **Audit Trail**: All timestamp changes are logged
3. **Data Integrity**: Prevent manipulation of timestamp fields
4. **Validation**: Server-side validation of all timestamp operations

## Future Enhancements

1. **Email Notifications**: Send notifications when timesheets are submitted/approved
2. **Approval Chains**: Multi-level approval workflow
3. **Time Tracking**: Automatic time tracking integration
4. **Reporting**: Advanced reporting on submission/approval times
5. **Mobile Support**: Mobile-optimized approval interface

## Troubleshooting

### Common Issues

1. **Timestamps not updating**: Check if status transition is valid
2. **Approval failing**: Verify `approvedBy` field is provided
3. **Bulk operations failing**: Check network connectivity and API limits
4. **Display issues**: Verify date formatting in frontend

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check server logs for backend errors
4. Validate database records directly
5. Run test script to verify functionality 