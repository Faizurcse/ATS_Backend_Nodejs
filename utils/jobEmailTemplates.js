// Simple and clean email templates for job notifications

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Job Creation Email Template
export const getJobCreateEmailTemplate = (jobData, createInfo) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Posting Created</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      
      <!-- Header -->
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #27ae60; margin: 0 0 10px 0; font-size: 24px;">New Job Posting Created</h1>
        <p style="color: #7f8c8d; margin: 0; font-size: 16px;">A new job posting has been successfully created</p>
      </div>

      <!-- Creation Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Creation Information</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Created By:</strong> ${createInfo.createdBy}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Created At:</strong> ${formatDateTime(createInfo.createdAt)}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Creation Reason:</strong> ${createInfo.reason}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Job ID:</strong> ${createInfo.jobId}
        </div>
      </div>

      <!-- Job Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Job Details</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Title:</strong> ${jobData.title}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Company:</strong> ${jobData.company}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Department:</strong> ${jobData.department || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Location:</strong> ${jobData.city}, ${jobData.country}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Work Type:</strong> ${jobData.workType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Type:</strong> ${jobData.jobType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Experience Level:</strong> ${jobData.experienceLevel}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Salary Range:</strong> $${jobData.salaryMin?.toLocaleString()} - $${jobData.salaryMax?.toLocaleString()}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Status:</strong> ${jobData.jobStatus}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Internal SPOC:</strong> ${jobData.internalSPOC || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Recruiter:</strong> ${jobData.recruiter || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Email:</strong> ${jobData.email || 'Not specified'}
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
          This is an automated notification from your ATS system.<br>
          Job ID: ${jobData.id} | Created: ${formatDateTime(createInfo.createdAt)}
        </p>
      </div>
      
    </body>
    </html>
  `;
};

// Job Update Email Template
export const getJobUpdateEmailTemplate = (jobData, updatedFields, updateInfo) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Posting Updated</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      
      <!-- Header -->
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">Job Posting Updated</h1>
        <p style="color: #7f8c8d; margin: 0; font-size: 16px;">Your job posting has been successfully updated</p>
      </div>

      <!-- Update Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Update Information</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Updated By:</strong> ${updateInfo.updatedBy}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Updated At:</strong> ${formatDateTime(updateInfo.updatedAt)}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Update Reason:</strong> ${updateInfo.reason}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Job ID:</strong> ${updateInfo.jobId}
        </div>
      </div>

      <!-- Updated Fields -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Fields Updated (${updatedFields.length})</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${updatedFields.map(field => `<li style="margin-bottom: 5px; color: #2c3e50;">${field}</li>`).join('')}
        </ul>
      </div>

      <!-- Job Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Job Details</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Title:</strong> ${jobData.title}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Company:</strong> ${jobData.company}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Department:</strong> ${jobData.department || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Location:</strong> ${jobData.city}, ${jobData.country}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Work Type:</strong> ${jobData.workType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Type:</strong> ${jobData.jobType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Experience Level:</strong> ${jobData.experienceLevel}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Salary Range:</strong> $${jobData.salaryMin?.toLocaleString()} - $${jobData.salaryMax?.toLocaleString()}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Status:</strong> ${jobData.jobStatus}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Internal SPOC:</strong> ${jobData.internalSPOC || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Recruiter:</strong> ${jobData.recruiter || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Email:</strong> ${jobData.email || 'Not specified'}
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
          This is an automated notification from your ATS system.<br>
          Job ID: ${jobData.id} | Updated: ${formatDateTime(updateInfo.updatedAt)}
        </p>
      </div>
      
    </body>
    </html>
  `;
};

// Job Delete Email Template
export const getJobDeleteEmailTemplate = (jobData, deleteInfo) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Posting Deleted</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      
      <!-- Header -->
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #e74c3c; margin: 0 0 10px 0; font-size: 24px;">Job Posting Deleted</h1>
        <p style="color: #7f8c8d; margin: 0; font-size: 16px;">A job posting has been permanently removed from the system</p>
      </div>

      <!-- Deletion Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Deletion Information</h2>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Deleted By:</strong> ${deleteInfo.deletedBy}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Deleted At:</strong> ${formatDateTime(deleteInfo.deletedAt)}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Deletion Reason:</strong> ${deleteInfo.reason}
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong style="color: #34495e;">Job ID:</strong> ${deleteInfo.jobId}
        </div>
      </div>

      <!-- Deleted Job Details -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Deleted Job Details</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Title:</strong> ${jobData.title}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Company:</strong> ${jobData.company}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Department:</strong> ${jobData.department || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Location:</strong> ${jobData.city}, ${jobData.country}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Work Type:</strong> ${jobData.workType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Type:</strong> ${jobData.jobType}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Experience Level:</strong> ${jobData.experienceLevel}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Salary Range:</strong> $${jobData.salaryMin?.toLocaleString()} - $${jobData.salaryMax?.toLocaleString()}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Job Status:</strong> ${jobData.jobStatus}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h2>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Internal SPOC:</strong> ${jobData.internalSPOC || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Recruiter:</strong> ${jobData.recruiter || 'Not specified'}
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong style="color: #34495e;">Email:</strong> ${jobData.email || 'Not specified'}
        </div>
      </div>

      <!-- Warning -->
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Notice</h3>
        <p style="color: #856404; margin: 0; font-size: 14px;">
          This job posting has been permanently deleted from the system. 
          All associated data including applications, candidates, and job details have been removed.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
          This is an automated notification from your ATS system.<br>
          Job ID: ${jobData.id} | Deleted: ${formatDateTime(deleteInfo.deletedAt)}
        </p>
      </div>
      
    </body>
    </html>
  `;
};
