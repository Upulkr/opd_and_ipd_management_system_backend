import { Router } from "express";
import { getAllDoctors } from "../controllers/userController";
import permissionMiddleware from "../middleware/permissionMiddleware";
import authMiddleware from "../middleware/authMiddleware";
// import {
//   createUser,
//   deleteUser,
//   getAllDoctors,
//   getAllLabTechnicians,
//   getAllNurses,
//   getAllPatients,
//   getAllUsers,
//   getUserByNic,
//   updateUser,
// } from "../controllers/userController";
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
const router = Router();
// router.get("/", getAllUsers);
// router.post("/", getUserByNic);
// router.post("/", createUser);
// router.get("/:nic", updateUser);
// router.put("/:nic", updateUser);
// router.delete("/:nic", deleteUser);

// router.get("/", getAllLabTechnicians);
// router.get("/", getAllNurses);
router.get(
  "/getalldoctors",
  verifyToken,
  hasPermission(["getAllDoctors"]),
  getAllDoctors
);
// router.get("/", getAllPatients);

export default router;
