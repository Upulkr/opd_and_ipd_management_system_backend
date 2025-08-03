import { getAllWardBedsCount, getAllWarNoAndWardNAme } from "../controllers/wardBedsController";
import { Router } from "express";
const router = Router();
router.get("/", getAllWardBedsCount);
router.get("/wardnames", getAllWarNoAndWardNAme);
export default router;
