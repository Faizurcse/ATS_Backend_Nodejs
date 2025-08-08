# Pipeline Email Notifications

This document describes the email notification system for pipeline status changes in the ATS system.

## Overview

When a candidate's pipeline status is updated, the system automatically sends professional email notifications to both:
1. **Job Poster/Recruiter** - Notified about the status change with candidate details and recommended next steps
2. **Candidate/Applicant** - Notified about their application status update with clear explanations

## Email Templates

### For Recruiters/Job Posters
- **Template**: `getPipelineStatusChangeRecruiterTemplate`
- **Subject**: `Pipeline Update: [Candidate Name] - [Old Status] → [New Status]`
- **Content Includes**:
  - Status change summary with visual indicators
  - Candidate information (name, email, phone, experience, salary expectations)
  - Job details (title, company, location, work type)
  - Recommended next steps based on the new status
  - Contact information for follow-up

### For Candidates/Applicants
- **Template**: `getPipelineStatusChangeCandidateTemplate`
- **Subject**: `Application Status Update: [Job Title] at [Company]`
- **Content Includes**:
  - Status update with clear visual progression
  - Job position details
  - Detailed explanation of what the new status means
  - Contact information for questions
  - Professional and encouraging tone

## API Endpoints

### 1. Pipeline Status Update
**PUT** `/api/pipeline/update-status`

### Request Body
```json
{
  "candidateId": 123,
  "jobId": 456,
  "status": "Phone Screening",
  "reason": "Candidate passed initial screening"
}
```

### Response
```json
{
  "success": true,
  "message": "Candidate status updated to Phone Screening successfully",
  "data": {
    "candidateId": 123,
    "jobId": 456,
    "oldStatus": "Initial Screening",
    "newStatus": "Phone Screening",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "emailsSent": {
      "recruiter": true,
      "candidate": true
    }
  }
}
```

### 2. Interview Scheduling
**POST** `/api/interviews/schedule`

### Request Body
```json
{
  "candidateId": 123,
  "interviewDate": "2024-01-20",
  "interviewTime": "14:00",
  "interviewType": "First Interview",
  "interviewMode": "Video Call",
  "platform": "Zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "interviewer": "John Doe",
  "notes": "Technical interview focusing on React and Node.js"
}
```

### Response
```json
{
  "success": true,
  "message": "Interview scheduled successfully",
  "data": {
    "id": 789,
    "candidateId": 123,
    "candidateName": "Jane Smith",
    "interviewDate": "2024-01-20",
    "interviewTime": "14:00",
    "interviewType": "First Interview",
    "interviewMode": "Video Call",
    "platform": "Zoom",
    "meetingLink": "https://zoom.us/j/123456789",
    "interviewer": "John Doe",
    "notes": "Technical interview focusing on React and Node.js",
    "status": "SCHEDULED",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Bulk Interview Scheduling
**POST** `/api/interviews/bulk-schedule`

### Request Body
```json
{
  "candidateIds": [123, 124, 125],
  "interviewDate": "2024-01-20",
  "interviewTime": "14:00",
  "interviewType": "First Interview",
  "interviewMode": "Video Call",
  "platform": "Zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "interviewer": "John Doe",
  "notes": "Technical interview focusing on React and Node.js"
}
```

## Supported Pipeline Statuses

The system supports the following pipeline statuses:
- New Application
- Initial Screening
- Phone Screening
- Skills Assessment
- First Interview
- Second Interview
- Final Interview
- Reference Check
- Offer Preparation
- Offer Sent
- Offer Negotiation
- Offer Accepted
- Background Check
- Hired
- Rejected
- Withdrawn
- On Hold
- Interview Scheduled (special status for interview scheduling)

## Email Features

### Professional Design
- Clean, modern HTML email templates
- Responsive design for mobile devices
- Professional color scheme and typography
- Clear visual hierarchy

### Status-Specific Content
- **For Recruiters**: Contextual next steps based on the new status
- **For Candidates**: Detailed explanations of what each status means
- Encouraging tone for positive progressions
- Professional handling of rejections

### Error Handling
- Email failures don't prevent status updates
- Comprehensive error logging
- Graceful degradation if email service is unavailable
- Parallel email sending for bulk operations

## Configuration

The email system uses the following environment variables:
- `MAIL_HOST` - SMTP server host
- `MAIL_PORT` - SMTP server port
- `MAIL_USERNAME` - SMTP username
- `MAIL_PASSWORD` - SMTP password
- `MAIL_FROM_NAME` - Sender name
- `MAIL_FROM_ADDRESS` - Sender email address

## Implementation Details

### Files Modified
1. **`utils/jobEmailTemplates.js`** - Added two new email templates
2. **`utils/mailer.js`** - Added email sending functions
3. **`controllers/pipelineController.js`** - Updated to send emails on status change
4. **`controllers/interviewController.js`** - Updated to send emails on interview scheduling

### Email Sending Logic
1. Update candidate status in database
2. Prepare email data (candidate info, job info, status change)
3. Send email to recruiter (if email exists)
4. Send email to candidate
5. Log success/failure without affecting the main operation

### Interview Scheduling Integration
- When interviews are scheduled, candidate status automatically changes to "Interview Scheduled"
- Both single and bulk interview scheduling trigger email notifications
- Interview details are included in the status change context

## Testing

To test the email notifications:

1. Update a candidate's pipeline status via the API
2. Schedule an interview for a candidate
3. Bulk schedule interviews for multiple candidates
4. Check that emails are sent to both parties
5. Verify email content and formatting
6. Test with different status transitions

## Future Enhancements

Potential improvements:
- Email templates in multiple languages
- Customizable email content per company
- Email scheduling for specific statuses
- Integration with calendar systems for interviews
- SMS notifications for urgent updates
- Interview confirmation emails with calendar invites
- Automated follow-up emails for pending actions
