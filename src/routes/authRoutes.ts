import { Router } from "express";
import authController from "../controllers/authenticationController"; // Adjust the path as necessary
import authMiddleware from "../middleware/authMiddleware";
const router = Router();

router.post("/signup", authController.signup);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
