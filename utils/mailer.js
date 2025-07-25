import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #ffffff;">
    <div style="text-align: center;">
      <h1 style="color: #4A00E0; margin-bottom: 10px;">OTP Verification</h1>
      <p style="font-size: 16px; color: #555;">Use the following One-Time Password (OTP) to complete your login/verification process.</p>
      <div style="margin: 30px 0;">
        <span style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #4A00E0;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>2 minutes</strong>.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 13px; color: #999;">If you did not request this code, please ignore this email.</p>
      <p style="font-size: 13px; color: #999;">Regards,<br><strong>${process.env.MAIL_FROM_NAME}</strong></p>
    </div>
  </div>
`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOtpEmail;
