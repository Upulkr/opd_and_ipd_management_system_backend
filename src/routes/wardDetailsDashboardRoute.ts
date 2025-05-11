import { getAllWardBedsCount } from "../controllers/wardBedsController";
import { Router } from "express";
const router = Router();
router.get("/", getAllWardBedsCount);
export default router;
