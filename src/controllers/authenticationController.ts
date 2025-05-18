import { Request, Response } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomSession {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const {
        username,
        email,
        password,
        role,
        registrationNumber,
        nic,
        phoneNumber,
      } = req.body;

      if (
        !username ||
        !email ||
        !password ||
        !role ||
        !registrationNumber ||
        !nic ||
        !phoneNumber
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationToken();
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role,
          registrationNumber,
          nic,
          phoneNumber,
          emailVerificationToken: verificationToken,
          emailTokenExpires: tokenExpires,
        },
      });
      // Send verification email
      const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
          <h2>Welcome to Our Healthcare Platform</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        `,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message:
          "User created successfully. Please check your email for verification.",
        userId: user.id,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  },
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const user = await prisma.user.findUnique({
        where: { emailVerificationToken: token },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      if (user.emailTokenExpires && user.emailTokenExpires < new Date()) {
        return res
          .status(400)
          .json({ message: "Verification token has expired" });
      }
      // Update user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailTokenExpires: null,
        },
      });

      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error verifying email", error: error.message });
    }
  },

  resendVerificationEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const verificationToken = generateVerificationToken();
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: verificationToken,
          emailTokenExpires: tokenExpires,
        },
      });

      const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
          <h2>Email Verification</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Verification email resent" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error resending verification email",
        error: error.message,
      });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (!user.isEmailVerified) {
        return res.status(401).json({
          message: "Please verify your email before logging in",
          userId: user.id,
        });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      (req.session as CustomSession).user = {
        id: user.id.toString(),
        role: user.role,
        username: user.username,
      };

      res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Login error", error: error.message });
    }
  },

  logout: (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Logout error", error: err.message });
      }
      res.json({ message: "Logged out successfully" });
    });
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Change Notification",
        html: `
          <p>Hello ${user.username},</p>
          <p>You have successfully changed your password.</p>
          <p>If you did not initiate this change, please contact the system administrator immediately.</p>
          <p>Thank you.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        return res.status(500).json({
          message: "Password updated but failed to send notification email",
          error: (emailError as Error).message,
        });
      }

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
      console.error("Password change error:", error);
      return res
        .status(500)
        .json({ message: "Error changing password", error: error.message });
    }
  },
};

export default authController;
