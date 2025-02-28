"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
// controllers/authController.js
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
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
    return crypto_1.default.randomBytes(32).toString("hex");
};
const authController = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, email, password, role, registrationNumber, nic, phoneNumber, } = req.body;
            if (!username ||
                !email ||
                !password ||
                !role ||
                !registrationNumber ||
                !nic ||
                !phoneNumber) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const existingUser = yield prisma.user.findFirst({
                where: {
                    OR: [{ email }, { username }],
                },
            });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const verificationToken = generateVerificationToken();
            const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            const user = yield prisma.user.create({
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
            yield transporter.sendMail(mailOptions);
            res.status(200).json({
                message: "User created successfully. Please check your email for verification.",
                userId: user.id,
            });
        }
        catch (error) {
            if (error.code === "P2002") {
                return res
                    .status(400)
                    .json({ message: "Username or email already exists" });
            }
            res
                .status(500)
                .json({ message: "Error creating user", error: error.message });
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            console.log("token++++++++", token);
            const user = yield prisma.user.findUnique({
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
            yield prisma.user.update({
                where: { id: user.id },
                data: {
                    isEmailVerified: true,
                    emailVerificationToken: null,
                    emailTokenExpires: null,
                },
            });
            res.json({ message: "Email verified successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Error verifying email", error: error.message });
        }
    }),
    resendVerificationEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield prisma.user.findUnique({
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
            yield prisma.user.update({
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
            yield transporter.sendMail(mailOptions);
            res.json({ message: "Verification email resent" });
        }
        catch (error) {
            res.status(500).json({
                message: "Error resending verification email",
                error: error.message,
            });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield prisma.user.findUnique({
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
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
            req.session.user = {
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
        }
        catch (error) {
            res.status(500).json({ message: "Login error", error: error.message });
        }
    }),
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Logout error", error: err.message });
            }
            res.json({ message: "Logged out successfully" });
        });
    },
};
exports.default = authController;
