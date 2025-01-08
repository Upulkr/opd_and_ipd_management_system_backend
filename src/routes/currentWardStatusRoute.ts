import { Router } from "express";
import { getCurrentWardStatus } from "../controllers/currentWardStatus";

const router = Router();
router.get("/", getCurrentWardStatus);
export default router;
