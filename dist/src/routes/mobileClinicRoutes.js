"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mobileClinicController_1 = require("../controllers/mobileClinicController");
const router = (0, express_1.Router)();
router.get("/", mobileClinicController_1.getAllMobileClinics);
router.post("/", mobileClinicController_1.createMObileClinic);
router.delete("/", mobileClinicController_1.deleteMobileClinicAssigment);
router.put("/id", mobileClinicController_1.updateMobileClinicAssigment);
router.get("/sheduled", mobileClinicController_1.getAllMobileClinicAssigmentsForTable);
router.put("/markascompleted", mobileClinicController_1.updateMobileClinincCompletedStatus);
router.get("/getcountofcompletedmobileclinincs", mobileClinicController_1.getCountOfCompletedMobileClinicsFor30days);
router.get("/monthlyhomevisits", mobileClinicController_1.getMothlyMobileClinicCount);
router.get(`/getpatientsbyage`, mobileClinicController_1.getPatientsByage);
exports.default = router;
