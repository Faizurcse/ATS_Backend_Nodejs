# Email Troubleshooting Guide

If emails are not being sent from your ATS system, follow this step-by-step troubleshooting guide.

## 🔍 Step 1: Check Environment Variables

First, verify your `.env` file has all required variables:

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

## 🧪 Step 2: Run Email Tests

Use the provided test script to diagnose email issues:

```bash
# Navigate to your backend directory
cd ATS_Backend_Nodejs

# Run email test with your email address
node testEmail.js your-email@gmail.com
```

This will test:
- ✅ Environment variables
- ✅ SMTP connection
- ✅ Simple email sending
- ✅ Job email templates

## 🚨 Common Issues & Solutions

### Issue 1: "Authentication failed"

**Solution:**
- For Gmail: Use App Password instead of regular password
- Enable 2-factor authentication on your Gmail account
- Generate an App Password: Google Account → Security → App Passwords
- Use the 16-character app password in `MAIL_PASSWORD`

### Issue 2: "Connection timeout"

**Solution:**
- Check firewall settings
- Verify internet connection
- Try different SMTP ports (587, 465, 25)
- Check if your email provider blocks automated emails

### Issue 3: "Invalid credentials"

**Solution:**
- Double-check email and password
- Ensure no extra spaces in `.env` file
- For Gmail: Make sure you're using app password, not regular password

### Issue 4: "Email sent but not received"

**Solution:**
- Check spam/junk folder
- Add your email to contacts
- Check email provider's sending limits
- Verify email address is correct

## 📧 Gmail Setup Guide

1. **Enable 2-Factor Authentication:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Google Account → Security → App Passwords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update .env file:**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-gmail@gmail.com
```

## 📧 Outlook Setup Guide

1. **Enable SMTP:**
   - Outlook Settings → Mail → Sync email
   - Enable "Let devices and apps use my account"

2. **Update .env file:**
```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-outlook@outlook.com
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=your-outlook@outlook.com
```

## 🔧 Debug Steps

### 1. Check Console Logs
Look for email-related errors in your server console:
```
❌ Error sending job update email: Authentication failed
❌ Failed to send update email: Connection timeout
```

### 2. Test SMTP Connection
```bash
# Test SMTP connection only
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false }
});

transporter.verify()
  .then(() => console.log('✅ SMTP connection successful!'))
  .catch(err => console.error('❌ SMTP connection failed:', err.message));
"
```

### 3. Check Environment Variables
```bash
# Check if environment variables are loaded
node -e "
require('dotenv').config();
console.log('MAIL_HOST:', process.env.MAIL_HOST);
console.log('MAIL_USERNAME:', process.env.MAIL_USERNAME);
console.log('MAIL_PASSWORD:', process.env.MAIL_PASSWORD ? 'SET' : 'NOT SET');
"
```

## 🛠️ Alternative Solutions

### Option 1: Use Different Email Provider
Try a different email service like:
- **SendGrid** (recommended for production)
- **Mailgun**
- **Amazon SES**

### Option 2: Use Gmail with Less Secure Apps
⚠️ **Not recommended for production**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-regular-password
```

### Option 3: Use Custom SMTP
```env
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_NAME=ATS
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

## 📋 Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Email provider credentials are valid
- [ ] SMTP connection test passes
- [ ] Simple email test works
- [ ] Job email template test works
- [ ] Emails are received (check spam folder)
- [ ] Job posting has a valid email address
- [ ] Job posting is being updated/deleted
- [ ] Console shows email success messages

## 🆘 Still Having Issues?

1. **Check the test results** from `node testEmail.js`
2. **Verify your email provider settings**
3. **Try a different email address**
4. **Check server logs for detailed error messages**
5. **Ensure your email provider allows automated sending**

## 📞 Support

If you're still experiencing issues:
1. Run the email test script
2. Copy the exact error messages
3. Check your email provider's documentation
4. Verify your network/firewall settings

---

**Remember:** Email delivery can sometimes be delayed. Wait a few minutes and check your spam folder before concluding the email isn't working.
