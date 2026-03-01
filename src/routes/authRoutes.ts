import { Router } from "express";
import authController from "../controllers/authenticationController"; // Adjust the path as necessary
import authMiddleware from "../middleware/authMiddleware";
const router = Router();

/**
 * @route POST /signup
 * @description Register a new user
 * @access Public
 */
router.post("/signup", authController.signup);

/**
 * @route GET /verify-email/:token
 * @description Verify user email address via token
 * @access Public
 */
router.get("/verify-email/:token", authController.verifyEmail);

/**
 * @route POST /resend-verification
 * @description Resend the verification email
 * @access Public
 */
router.post("/resend-verification", authController.resendVerificationEmail);

/**
 * @route POST /login
 * @description Authenticate user and get token
 * @access Public
 */
router.post("/login", authController.login);

/**
 * @route POST /logout
 * @description Logout user and invalidate token
 * @access Public
 */
router.post("/logout", authController.logout);

/**
 * @route PUT /update-password/:userId
 * @description Update user password
 * @access Protected
 */
router.put(
  "/update-password/:userId",
  authMiddleware.verifyToken,
  authController.changePassword,
);

export default router;
