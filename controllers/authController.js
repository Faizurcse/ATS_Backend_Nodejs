import prisma from '../prismaClient.js';
import sendOtpEmail from "../utils/mailer.js";
import { generateOtp, storeOtp, validateOtp } from "../middlewares/validateOtp.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.ats_User.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = generateOtp();
  storeOtp(email, otp);
  await sendOtpEmail(email, otp);

  res.json({ message: "OTP sent" });
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
  const { name, email, number } = req.body;
  console.log("Creating user:", { name, email, number });
  try {
    const user = await prisma.ats_User.create({ data: { name, email, number } });
    res.json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "User creation failed" });
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, number } = req.body;

  try {
    const user = await prisma.ats_User.update({
      where: { id: userId },
      data: { name, email, number },
    });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "User update failed" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.ats_Login.deleteMany({ where: { userId } }); // FK cleanup
    await prisma.ats_User.delete({ where: { id: userId } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
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
      },
    });
    res.json({ users });
  } catch (err) {
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
          },
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    });

    res.json({ logins });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch login history" });
  }
};
