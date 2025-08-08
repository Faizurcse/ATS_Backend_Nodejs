# Timesheet Email Notifications

This document describes the email notification system for timesheet operations in the ATS backend.

## Overview

The timesheet email notification system automatically sends emails when timesheet entries are created, updated, deleted, or approved. This helps keep all stakeholders informed about timesheet activities.

## Email Templates

### 1. Timesheet Creation Email
- **Trigger**: When a new timesheet entry is created
- **Recipients**: Recruiter (if email provided) and admin/manager
- **Subject**: `New Timesheet Entry Created: [Recruiter Name] - [Task Type]`
- **Content**: Includes creation details, timesheet information, and all relevant fields

### 2. Timesheet Update Email
- **Trigger**: When an existing timesheet entry is updated
- **Recipients**: Recruiter (if email provided) and admin/manager
- **Subject**: `Timesheet Entry Updated: [Recruiter Name] - [Task Type] - Updated: [Fields]`
- **Content**: Shows which fields were updated, update information, and current timesheet details

### 3. Timesheet Deletion Email
- **Trigger**: When a timesheet entry is deleted
- **Recipients**: Recruiter (if email provided) and admin/manager
- **Subject**: `Timesheet Entry Deleted: [Recruiter Name] - [Task Type]`
- **Content**: Includes deletion details and the deleted timesheet information

### 4. Timesheet Approval Email
- **Trigger**: When a timesheet entry is approved
- **Recipients**: Recruiter (if email provided) and admin/manager
- **Subject**: `Timesheet Entry Approved: [Recruiter Name] - [Task Type]`
- **Content**: Shows approval information and updated timesheet details

## Configuration

### Environment Variables

Add these environment variables to your `.env` file:

```env
# Email Configuration (existing)
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_FROM_NAME=ATS System
MAIL_FROM_ADDRESS=your-email@domain.com

# Admin email for timesheet notifications (optional)
ADMIN_EMAIL=admin@yourcompany.com
```

### Email Recipients

The system sends emails to:
1. **Recruiter**: If `recruiterEmail` is provided in the timesheet entry
2. **Admin/Manager**: Uses `ADMIN_EMAIL` environment variable or falls back to `MAIL_FROM_ADDRESS`

## API Endpoints with Email Notifications

### 1. Create Timesheet Entry
```http
POST /api/timesheet
```

**Optional Body Parameters for Email:**
- `createdBy`: Name of the person who created the entry
- `creationReason`: Reason for creating the entry

### 2. Update Timesheet Entry
```http
PUT /api/timesheet/:id
```

**Optional Body Parameters for Email:**
- `updatedBy`: Name of the person who updated the entry
- `updateReason`: Reason for updating the entry

### 3. Delete Timesheet Entry
```http
DELETE /api/timesheet/:id
```

**Optional Body Parameters for Email:**
- `deletedBy`: Name of the person who deleted the entry
- `deletionReason`: Reason for deleting the entry

### 4. Approve Timesheet Entry
```http
POST /api/timesheet/:id/approve
```

**Required Body Parameters:**
- `approvedBy`: Name of the person who approved the entry

## Email Template Features

### Professional Design
- Clean, modern HTML email templates
- Responsive design for mobile devices
- Professional color scheme and typography

### Detailed Information
- Complete timesheet details
- Operation metadata (who, when, why)
- Clear status indicators

### Error Handling
- Email failures don't affect API responses
- Comprehensive error logging
- Graceful fallbacks

## Implementation Details

### Files Modified/Created

1. **`utils/timesheetEmailTemplates.js`** (New)
   - Contains all timesheet email templates
   - Professional HTML formatting
   - Dynamic content insertion

2. **`utils/mailer.js`** (Modified)
   - Added timesheet email functions
   - Integrated with existing email system

3. **`controllers/timesheetController.js`** (Modified)
   - Added email notifications to CRUD operations
   - Error handling for email failures
   - Field change detection for updates

### Email Functions

```javascript
// Send timesheet creation email
sendTimesheetCreateEmail(email, timesheetData, createInfo)

// Send timesheet update email
sendTimesheetUpdateEmail(email, timesheetData, updatedFields, updateInfo)

// Send timesheet deletion email
sendTimesheetDeleteEmail(email, timesheetData, deleteInfo)

// Send timesheet approval email
sendTimesheetApprovalEmail(email, timesheetData, approvalInfo)
```

## Testing

### Test Email Sending

1. Create a timesheet entry with a valid email address
2. Check that both recruiter and admin receive emails
3. Update the timesheet entry and verify update emails
4. Delete the timesheet entry and verify deletion emails
5. Approve a timesheet entry and verify approval emails

### Email Content Verification

- Verify all timesheet fields are displayed correctly
- Check that updated fields are highlighted
- Ensure proper formatting and styling
- Test with different data types and edge cases

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP configuration
   - Verify environment variables
   - Check email server logs

2. **Email content issues**
   - Verify template syntax
   - Check data formatting
   - Test with sample data

3. **Performance issues**
   - Email sending is asynchronous
   - API responses are not delayed
   - Check email server performance

### Logging

All email operations are logged:
- Success: `Timesheet [operation] email sent successfully to [email]`
- Error: `Error sending timesheet [operation] email: [error]`

## Security Considerations

- Email addresses are validated before sending
- No sensitive data is exposed in emails
- Email failures don't expose system information
- Proper error handling prevents information leakage

## Future Enhancements

1. **Email Preferences**: Allow users to configure email preferences
2. **Bulk Operations**: Support for bulk timesheet operations
3. **Email Templates**: Customizable email templates
4. **Notification Settings**: Granular control over notification types
5. **Email Scheduling**: Delayed email sending for batch operations
