import { Router } from "express";
import { changeBedStatusForInpatientTable } from "../controllers/wardBedsController";

const router = Router();

router.put("/:wardNo", changeBedStatusForInpatientTable);

export default router;
