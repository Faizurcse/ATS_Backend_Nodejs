# Job Application Email Notifications

This document describes the email notification system for job applications in the ATS system.

## Overview

When candidates apply for jobs, the system automatically sends two types of emails:

1. **Confirmation Email to Candidate** - Acknowledges receipt of their application
2. **Notification Email to Recruiters/HR** - Notifies the hiring team about new applications

## Email Templates

### 1. Candidate Confirmation Email

**Template**: `getJobApplicationEmailTemplate()`
**Recipients**: Candidate's email address
**Subject**: "Application Received: [Job Title] at [Company]"

**Features**:
- Professional and attractive design
- Complete application details
- Job information
- Candidate's submitted information
- Key skills and cover letter
- Next steps information
- Contact details for follow-up

**Sections**:
- Application confirmation with ID and timestamp
- Job details (title, company, location, salary, etc.)
- Candidate information (name, contact, experience, etc.)
- Key skills
- Cover letter
- Next steps guide
- Contact information

### 2. Recruiter/HR Notification Email

**Template**: `getNewApplicationNotificationTemplate()`
**Recipients**: Job email and internal SPOC (if different)
**Subject**: "New Application: [Candidate Name] for [Job Title]"

**Features**:
- Professional notification design
- Complete candidate and job information
- Action items for recruiters
- Cover letter preview
- Direct contact links

**Sections**:
- Application summary
- Job details
- Candidate information with clickable contact links
- Key skills
- Cover letter preview (truncated if long)
- Action required checklist
- Contact information

## Email Configuration

### Required Environment Variables

```env
# SMTP Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_NAME=ATS System
MAIL_FROM_ADDRESS=your-email@gmail.com
```

### Gmail Setup (Recommended)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use the 16-character password in `MAIL_PASSWORD`

### Outlook Setup

```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS System
MAIL_FROM_ADDRESS=your-email@outlook.com
```

### Custom SMTP Server

```env
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS System
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

## Implementation Details

### Email Sending Functions

1. **`sendJobApplicationEmail(email, applicationData, jobData)`**
   - Sends confirmation email to candidate
   - Uses `getJobApplicationEmailTemplate()`

2. **`sendNewApplicationNotification(email, applicationData, jobData)`**
   - Sends notification email to recruiters/HR
   - Uses `getNewApplicationNotificationTemplate()`

### Integration Points

The email functionality is integrated into the `submitJobApplication` function in `candidateController.js`:

```javascript
// Send confirmation email to candidate
try {
  await sendJobApplicationEmail(email, application, job);
} catch (emailError) {
  console.error('Error sending application confirmation email:', emailError);
  // Don't fail the application submission if email fails
}

// Send notification email to recruiters/HR
try {
  // Send to job email if available
  if (job.email) {
    await sendNewApplicationNotification(job.email, application, job);
  }
  
  // Send to internal SPOC if different from job email
  if (job.internalSPOC && job.internalSPOC !== job.email) {
    await sendNewApplicationNotification(job.internalSPOC, application, job);
  }
} catch (notificationError) {
  console.error('Error sending application notification email:', notificationError);
  // Don't fail the application submission if notification email fails
}
```

## Email Features

### Professional Design
- Clean, modern HTML email templates
- Responsive design for mobile devices
- Professional color scheme and typography
- Card-based layout for easy reading

### Complete Information
- All application details included
- Job information for context
- Candidate contact information
- Skills and experience details
- Cover letter content

### User Experience
- Clear next steps for candidates
- Action items for recruiters
- Contact information prominently displayed
- Application tracking IDs included

### Error Handling
- Email failures don't prevent application submission
- Detailed error logging
- Graceful degradation

## Testing

### Test Email Configuration

1. Set up environment variables
2. Submit a test job application
3. Check both candidate and recruiter emails
4. Verify email content and formatting

### Troubleshooting

**Common Issues**:
- SMTP authentication errors
- Incorrect email credentials
- Network connectivity issues
- Email provider restrictions

**Debug Steps**:
1. Check environment variables
2. Verify SMTP settings
3. Test with simple email first
4. Check server logs for errors

## Customization

### Template Modifications

To customize email templates:

1. Edit functions in `jobEmailTemplates.js`
2. Modify HTML structure and styling
3. Add or remove sections as needed
4. Update content and messaging

### Adding New Email Types

1. Create new template function
2. Add email sending function to `mailer.js`
3. Import and use in controller
4. Update documentation

## Security Considerations

- Email credentials stored in environment variables
- No sensitive data in email templates
- Error handling prevents data exposure
- Secure SMTP connections used

## Performance

- Emails sent asynchronously
- Application submission not blocked by email failures
- Efficient HTML templates
- Minimal external dependencies

## Future Enhancements

- Email templates in database for easy customization
- Email scheduling and queuing
- Template versioning
- Email analytics and tracking
- Multi-language support
- Email preferences management
