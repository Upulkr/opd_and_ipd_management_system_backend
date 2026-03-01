import { Request, Response } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client for database interaction.
const prisma = new PrismaClient();

// Interface for extending the session object to include user details
interface CustomSession {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

// Nodemailer transport configuration for sending emails (e.g., verification, password change)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "upulkr4@gmail.com", // Sender's email address
    pass: "pwyf vcsx fvxg oiln", // App password for authentication
  },
});

/**
 * Generates a random cryptographic token for email verification.
 * @returns {string} Hexadecimal string of the random bytes.
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const authController = {
  /**
   * Handles user registration.
   * Validates input, checks for existing users, hashes password, creates user, and sends verification email.
   */
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

      // Validate required fields
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

      // Check if user already exists based on email or username
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password before saving to ensure security.
      // bcrypt.hash uses a salt round of 10.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a verification token for email confirmation.
      const verificationToken = generateVerificationToken();
      // Set expiration time to 24 hours from now.
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create new user record in database.
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword, // Store hashed password, NEVER plain text.
          role,
          registrationNumber,
          nic,
          phoneNumber,
          emailVerificationToken: verificationToken,
          emailTokenExpires: tokenExpires,
        },
      });

      // Construct verification link to be sent via email.
      const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;

      // Configure email content.
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

      // Send the email using Nodemailer.
      await transporter.sendMail(mailOptions);

      // Return success response with User ID.
      res.status(200).json({
        message:
          "User created successfully. Please check your email for verification.",
        userId: user.id,
      });
    } catch (error: any) {
      // Prisma error code P2002 indicates a unique constraint violation (e.g., duplicate email).
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

  /**
   * Verifies user's email address using the token.
   * Checks validity and expiration of the token.
   */
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      // Find user by verification token.
      const user = await prisma.user.findUnique({
        where: { emailVerificationToken: token },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }

      // Check if already verified.
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Check if token has expired.
      if (user.emailTokenExpires && user.emailTokenExpires < new Date()) {
        return res
          .status(400)
          .json({ message: "Verification token has expired" });
      }

      // Mark user as verified and clear token data (security practice).
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

  /**
   * Resends the verification email if the user is not yet verified.
   * Generates a new token and resets the expiration.
   */
  resendVerificationEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Generate new token and expiration
      const verificationToken = generateVerificationToken();
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Update user with new token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: verificationToken,
          emailTokenExpires: tokenExpires,
        },
      });

      // Send new verification email
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

  /**
   * Handles user login.
   * Verifies credentials, checks email verification status, generates JWT, and sets session.
   */
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user by email.
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Ensure email is verified before allowing login.
      if (!user.isEmailVerified) {
        return res.status(401).json({
          message: "Please verify your email before logging in",
          userId: user.id,
        });
      }

      // Verify password match using bcrypt.compare.
      // This compares the plain text password with the hashed password from DB.
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT (JSON Web Token).
      // Contains userId and role in payload.
      // Signed with a secret key and expires in 24h.
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" },
      );

      // Set user session data (if using session-based auth alongside or instead of JWT).
      (req.session as CustomSession).user = {
        id: user.id.toString(),
        role: user.role,
        username: user.username,
      };

      // Return token and user info.
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

  /**
   * Handles user logout.
   * Destroys the current session.
   */
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

  /**
   * Changes the user's password.
   */
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

      // Verify if the old password provided matches the current one.
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      // Hash the new password before storing.
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database.
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashedPassword },
      });

      // Send a notification email to inform the user of the change.
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
