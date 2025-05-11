// routes/protectedRoutes.js
import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware";
import permissionMiddleware from "../middleware/permissionMiddleware";
const router = Router();
// Patient Records Routes
const { hasPermission, canAccessPatient } = permissionMiddleware;
const { verifyToken } = authMiddleware;
router.get(
  "/patients",
  verifyToken,
  hasPermission(["view_patient_records"]),
  (req, res) => {
    res.json({ message: "Access to patient list granted" });
  }
);

router.get(
  "/patients/:patientId",
  verifyToken,
  canAccessPatient,
  (req, res) => {
    res.json({ message: "Access to specific patient record granted" });
  }
);

// Prescription Routes
router.post(
  "/prescriptions",
  verifyToken,
  hasPermission(["create_prescription"]),
  (req, res) => {
    res.json({ message: "Prescription created" });
  }
);

router.get(
  "/prescriptions",
  verifyToken,
  hasPermission(["view_prescriptions"]),
  (req, res) => {
    res.json({ message: "Access to prescriptions granted" });
  }
);

// Appointment Routes
router.post(
  "/appointments",
  verifyToken,
  hasPermission(["create_appointments"]),
  (req, res) => {
    res.json({ message: "Appointment created" });
  }
);

router.get(
  "/appointments",
  verifyToken,
  hasPermission(["view_appointments"]),
  (req, res) => {
    res.json({ message: "Access to appointments granted" });
  }
);

// Pharmacy Routes
router.get(
  "/medications",
  verifyToken,
  hasPermission(["manage_medication_inventory"]),
  (req, res) => {
    res.json({ message: "Access to medication inventory granted" });
  }
);

router.put(
  "/prescriptions/:id/status",
  verifyToken,
  hasPermission(["update_prescription_status"]),
  (req, res) => {
    res.json({ message: "Prescription status updated" });
  }
);

// Admin Routes
router.get(
  "/audit-logs",
  verifyToken,
  hasPermission(["view_audit_logs"]),
  (req, res) => {
    res.json({ message: "Access to audit logs granted" });
  }
);

router.post(
  "/departments",
  verifyToken,
  hasPermission(["manage_departments"]),
  (req, res) => {
    res.json({ message: "Department created" });
  }
);

module.exports = router;
