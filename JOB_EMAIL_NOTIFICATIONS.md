# Job Posting Email Notifications

This feature automatically sends beautiful email notifications when job postings are updated or deleted.

## Features

### 1. Job Update Notifications
- Sends email when any field in a job posting is updated
- Includes a detailed list of which fields were changed
- Beautiful responsive HTML email template
- Shows job details including salary, location, work type, etc.

### 2. Job Deletion Notifications
- Sends email when a job posting is permanently deleted
- Includes complete job details for reference
- Warning about data recovery options
- Beautiful responsive HTML email template

### 3. Job Status Change Notifications
- Sends email when job status is changed (ACTIVE, PAUSED, CLOSED, FILLED)
- Tracks status changes specifically

## Email Templates

### Update Email Features:
- 📝 Professional header with gradient background
- 👤 **Who updated** - Shows the user/recruiter who made changes
- ⏰ **When updated** - Exact timestamp of the update
- 🎯 **Why updated** - Reason/purpose for the update
- 📋 Detailed job information card with enhanced styling
- 🔄 List of updated fields with count
- 📊 Analytics section with dashboard link
- 📱 Responsive design for mobile devices
- 🎨 Beautiful color-coded status badges
- 🏢 Work type icons (Remote, Hybrid, Onsite)
- 💎 Enhanced professional styling with shadows and gradients

### Delete Email Features:
- 🗑️ Clear deletion notification with enhanced styling
- 👤 **Who deleted** - Shows the user who performed deletion
- ⏰ **When deleted** - Exact timestamp of deletion
- 🎯 **Why deleted** - Reason for deletion
- ⚠️ Important warning about data loss
- 📊 Detailed data recovery options
- 📱 Responsive design for mobile devices
- 🎨 Professional styling with red theme and gradients
- 💎 Enhanced visual design with better spacing and typography

## Required Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-email@gmail.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Email Configuration Examples

### Gmail Setup:
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-email@gmail.com
```

### Outlook Setup:
```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-email@outlook.com
```

### Custom SMTP Setup:
```env
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-email@yourdomain.com
```

## API Endpoints

### Update Job Posting
```
PUT /api/jobs/:id
```
- Sends email notification to the job's email address
- Includes list of updated fields
- Returns updated job data and updated fields list

### Delete Job Posting
```
DELETE /api/jobs/:id
```
- Sends email notification to the job's email address
- Includes complete job details for reference
- Returns deletion confirmation with job details

### Update Job Status
```
PUT /api/jobs/:id/status
```
- Sends email notification when status changes
- Tracks previous and new status
- Returns status change confirmation

## Error Handling

- Email failures don't affect the main API response
- Email errors are logged to console
- Graceful degradation if email service is unavailable
- Detailed error messages for debugging

## Email Content

### Update Email Includes:
- Job title and company
- Location and work type
- Salary range and experience level
- Job status with color coding
- List of updated fields
- Link to job postings dashboard
- Analytics section

### Delete Email Includes:
- Job title and company
- Complete job details
- Warning about permanent deletion
- Data recovery information
- Link to remaining job postings

## Testing

To test the email functionality:

1. Ensure all environment variables are set
2. Create a job posting with a valid email address
3. Update the job posting - check for email notification
4. Delete the job posting - check for email notification
5. Update job status - check for email notification

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check SMTP configuration and credentials
2. **Authentication failed**: Verify email username and password
3. **Connection timeout**: Check network and firewall settings
4. **Template errors**: Verify all environment variables are set

### Debug Steps:

1. Check console logs for email errors
2. Verify email configuration in .env file
3. Test SMTP connection manually
4. Check email provider settings (Gmail app passwords, etc.)

## Security Notes

- Email passwords should be app-specific passwords
- Use environment variables for all sensitive data
- Consider rate limiting for email sending
- Monitor email sending for abuse prevention
