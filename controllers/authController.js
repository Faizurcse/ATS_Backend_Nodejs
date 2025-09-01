import prisma from '../prismaClient.js';
import sendOtpEmail, { sendUserCreateEmail, sendUserUpdateEmail, sendUserDeleteEmail, sendUserTypeChangeEmail, isEmailServiceAvailable } from "../utils/mailer.js";
import { generateOtp, storeOtp, validateOtp } from "../middlewares/validateOtp.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email service is available
    if (!isEmailServiceAvailable()) {
      return res.status(503).json({ 
        error: "Email service is currently unavailable. Please contact support or try again later.",
        details: "Email configuration is missing or invalid. Please check server configuration."
      });
    }

    const user = await prisma.ats_User.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    storeOtp(email, otp);
    
    try {
      await sendOtpEmail(email, otp);
      res.json({ message: "OTP sent successfully" });
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      res.status(500).json({ 
        error: "Failed to send OTP email",
        details: emailError.message,
        suggestion: "Please check your email address and try again, or contact support if the issue persists."
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const result = validateOtp(email, otp);
  if (!result.valid) return res.status(400).json({ error: result.message });

  const user = await prisma.ats_User.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      number: true,
      userType: true,
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  // ✅ Add login history entry
  await prisma.ats_Login.create({
    data: {
      userId: user.id,
    },
  });

  res.json({
    message: "OTP verified & login history saved",
    user,
  });
};

export const createUser = async (req, res) => {
  const { name, email, number, userType = 'USER' } = req.body;
  console.log("Creating user:", { name, email, number, userType });
  
  try {
    const user = await prisma.ats_User.create({ 
      data: { 
        name, 
        email, 
        number, 
        userType: userType.toUpperCase() 
      } 
    });
    
    // Send welcome email
    try {
      await sendUserCreateEmail(email, user, {
        createdBy: req.body.createdBy || 'System',
        createdAt: new Date().toLocaleDateString()
      });
    } catch (emailError) {
      console.error('Error sending user creation email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error('User creation error:', err);
    res.status(500).json({ error: "User creation failed" });
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, number, userType } = req.body;

  try {
    // Get the current user data to check for changes
    const currentUser = await prisma.ats_User.findUnique({
      where: { id: userId },
      select: { name: true, email: true, number: true, userType: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare update data
    const updateData = {};
    const updatedFields = [];

    if (name && name !== currentUser.name) {
      updateData.name = name;
      updatedFields.push('Name');
    }
    if (email && email !== currentUser.email) {
      updateData.email = email;
      updatedFields.push('Email');
    }
    if (number && number !== currentUser.number) {
      updateData.number = number;
      updatedFields.push('Phone');
    }
    if (userType && userType.toUpperCase() !== currentUser.userType) {
      updateData.userType = userType.toUpperCase();
      updatedFields.push('User Type');
    }

    // Update user
    const updatedUser = await prisma.ats_User.update({
      where: { id: userId },
      data: updateData,
    });

    // Send email notifications if there are changes
    if (updatedFields.length > 0) {
      try {
        // Send update email to user
        await sendUserUpdateEmail(updatedUser.email, updatedUser, updatedFields, {
          updatedBy: req.body.updatedBy || 'System',
          updatedAt: new Date().toLocaleDateString()
        });

        // Send special email for user type change
        if (userType && userType.toUpperCase() !== currentUser.userType) {
          await sendUserTypeChangeEmail(updatedUser.email, updatedUser, currentUser.userType, userType.toUpperCase(), {
            changedBy: req.body.updatedBy || 'System',
            changedAt: new Date().toLocaleDateString()
          });
        }
      } catch (emailError) {
        console.error('Error sending user update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ 
      message: "User updated successfully", 
      user: updatedUser,
      updatedFields: updatedFields.length > 0 ? updatedFields : []
    });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ error: "User update failed" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // Get user data before deletion for email notification
    const userToDelete = await prisma.ats_User.findUnique({
      where: { id: userId },
      select: { name: true, email: true, userType: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete related login records first
    await prisma.ats_Login.deleteMany({ where: { userId } });
    
    // Delete the user
    await prisma.ats_User.delete({ where: { id: userId } });

    // Send deletion email
    try {
      await sendUserDeleteEmail(userToDelete.email, userToDelete, {
        deletedBy: req.body.deletedBy || 'System',
        deletedAt: new Date().toLocaleDateString()
      });
    } catch (emailError) {
      console.error('Error sending user deletion email:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error('User deletion error:', err);
    res.status(500).json({ error: "User deletion failed" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.ats_User.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        userType: true,
      },
    });
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getAllLoginHistory = async (req, res) => {
  try {
    const logins = await prisma.ats_Login.findMany({
      select: {
        id: true,
        loggedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            userType: true,
          },
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    });

    res.json({ logins });
  } catch (err) {
    console.error('Error fetching login history:', err);
    res.status(500).json({ error: "Failed to fetch login history" });
  }
};

export const getUsersByType = async (req, res) => {
  const { userType } = req.params;
  
  try {
    const users = await prisma.ats_User.findMany({
      where: {
        userType: userType.toUpperCase()
      },
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        userType: true,
      },
    });
    
    res.json({ 
      users,
      count: users.length,
      userType: userType.toUpperCase()
    });
  } catch (err) {
    console.error('Error fetching users by type:', err);
    res.status(500).json({ error: "Failed to fetch users by type" });
  }
};

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  
  try {
    const user = await prisma.ats_User.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        number: true,
        userType: true,
        logins: {
          select: {
            id: true,
            loggedAt: true,
          },
          orderBy: {
            loggedAt: "desc",
          },
          take: 10, // Get last 10 logins
        },
      },
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
