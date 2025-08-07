"use strict";
// middleware/permissionMiddleware.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rolePermissions = {
    DOCTOR: [
        //patient related
        "getAllPatients",
        "getPatientByNic",
        "createPatient",
        "updatePatient",
        "isPatientExist",
        //admission book related
        "getrelatedAdmissionBookbyBHT",
        "getAdmissionBooks",
        "getAllAdmissionBooksforNic",
        "updateAdmissionBook",
        "createAdmissionBook",
        "getadmiisionsGeneralDetails",
        "admissionbookById",
        "admissionSheeetById",
        //admission sheet related
        "getNumberOfAdmissionSheetsperYear",
        "getrelatedAdmissionSheetByBht",
        "getAdmissionSheets",
        "getAllAdmissionSheetByNic",
        "updateAdmissionSheet",
        "createAdmissionSheet",
        "getNumberOfAdmissionSheetsperDay",
        //clinic assignment related
        "createClinicAssigment",
        "deleteClinicAssigment",
        "getAllClinicAssigments",
        "getAllClinicAssigmentsForTable",
        "getPatientDetailsByClinicName",
        "updateClinicAssigment",
        //clinic
        "createClininc",
        "deleteClinic",
        "getAllClinics",
        "updateClinic",
        //wardStatus
        "getCurrentWardStatus",
        //disease prediction
        "createDisasePrediction",
        "deleteDiseasePredictionByNic",
        "getDiseasePredictionByNic",
        "updateDiseasePredictionByNic",
        //drugChart
        "createDrugChart",
        "deleteDrugChart",
        "getAllDrugChartByNic",
        "getDrugCharts",
        "getrelatedDrugChart",
        "updateDrugChart",
        //drug related
        "addNewDrug",
        "createNewDrugAllocation",
        "deleteDrug",
        "getAllDrugs",
        "getDrugAllocationbyWardName",
        "updateDrug",
        //labtestRelated
        "createLabtest",
        "deleteLabtest",
        "getAllLabtestByNic",
        "getAllLabtests",
        "getrelatedLabtest",
        "updateLabtest",
        //mobile clinic related
        "createMObileClinic",
        "deleteMobileClinicAssigment",
        "getAllMobileClinicAssigmentsForTable",
        "getAllMobileClinics",
        "getCountOfCompletedMobileClinicsFor30days",
        "getMothlyMobileClinicCount",
        "getPatientsByage",
        "updateMobileClinicAssigment",
        "updateMobileClinincCompletedStatus",
        //outpatient related
        "createOutPatient",
        "getAllOutPatientsToday",
        "getOutPatientByNic",
        "getStaffMemebers",
        //sms routes
        "cancelScheduledSMS",
        "getScheduledSMS",
        "scheduleSMS",
        //staff assignment related
        "createStaffAssignment",
        "deleteStaffAssignment",
        "getAllStaffAssignments",
        "getStaffAssignmentsByRegisterId",
        "updateStaffAssignment",
        //wards beds related
        "changeBedStatusForInpatientTable",
        //sugery related
        "getAllDoctors",
        "createSurgeriesSchedule",
        "updateSurgeriesSchedule",
        "deleteSurgeriesSchedule",
        "getSurgeriesSchedule",
        "getSurgeryScheduleById",
        //medical report related
        "getMedicalReports",
        "getAllMedicalReportbyNic",
        "getMEdicalRportbyNicandId",
        "createMedicalReport",
        "getMedicalReportByNicandType",
    ],
    NURSE: [
        //wards beds related
        "changeBedStatusForInpatientTable",
        //staff assignment related
        "createStaffAssignment",
        "deleteStaffAssignment",
        "getAllStaffAssignments",
        "getStaffAssignmentsByRegisterId",
        "updateStaffAssignment",
        //patient related
        "getAllPatients",
        "getPatientByNic",
        "createPatient",
        "updatePatient",
        "isPatientExist",
        "deletePatient",
        //admission book related
        "getrelatedAdmissionBookbyBHT",
        "getAdmissionBooks",
        "getAllAdmissionBooksforNic",
        "updateAdmissionBook",
        "createAdmissionBook",
        "getadmiisionsGeneralDetails",
        "admissionbookById",
        "admissionSheeetById",
        //admission sheet related
        "getNumberOfAdmissionSheetsperYear",
        "getrelatedAdmissionSheetByBht",
        "getAdmissionSheets",
        "getAllAdmissionSheetByNic",
        "updateAdmissionSheet",
        "createAdmissionSheet",
        "getNumberOfAdmissionSheetsperDay",
        //clinic assignment related
        "createClinicAssigment",
        "deleteClinicAssigment",
        "getAllClinicAssigments",
        "getAllClinicAssigmentsForTable",
        "getPatientDetailsByClinicName",
        "updateClinicAssigment",
        //clinic
        "createClininc",
        "deleteClinic",
        "getAllClinics",
        "updateClinic",
        //wardStatus
        "getCurrentWardStatus",
        //disease prediction
        "createDisasePrediction",
        "deleteDiseasePredictionByNic",
        "getDiseasePredictionByNic",
        "updateDiseasePredictionByNic",
        //drugChart
        "createDrugChart",
        "deleteDrugChart",
        "getAllDrugChartByNic",
        "getDrugCharts",
        "getrelatedDrugChart",
        "updateDrugChart",
        //drug related
        "addNewDrug",
        "createNewDrugAllocation",
        "deleteDrug",
        "getAllDrugs",
        "getDrugAllocationbyWardName",
        "updateDrug",
        //labtestRelated
        "createLabtest",
        "deleteLabtest",
        "getAllLabtestByNic",
        "getAllLabtests",
        "getrelatedLabtest",
        "updateLabtest",
        //mobile clinic related
        "createMObileClinic",
        "deleteMobileClinicAssigment",
        "getAllMobileClinicAssigmentsForTable",
        "getAllMobileClinics",
        "getCountOfCompletedMobileClinicsFor30days",
        "getMothlyMobileClinicCount",
        "getPatientsByage",
        "updateMobileClinicAssigment",
        "updateMobileClinincCompletedStatus",
        //outpatient related
        "createOutPatient",
        "getAllOutPatientsToday",
        "getOutPatientByNic",
        "getStaffMemebers",
        //sms routes
        "cancelScheduledSMS",
        "getScheduledSMS",
        "scheduleSMS",
        //sugery related
        "getAllDoctors",
        " getSurgeriesSchedule",
        "createSurgeriesSchedule",
        "updateSurgeriesSchedule",
        "deleteSurgeriesSchedule",
        "getSurgeryScheduleById",
        //medical report related
        "getMedicalReports",
        "getAllMedicalReportbyNic",
        "getMEdicalRportbyNicandId",
        "createMedicalReport",
        "getMedicalReportByNicandType",
    ],
    PHARMACIST: [
        "view_prescriptions",
        "update_prescription_status",
        "manage_medication_inventory",
        "view_medication_history",
        "updateDrug",
        "getAllDrugs",
        "addNewDrug",
        "deleteDrug",
        "getDrugAllocationbyWardName",
        "createNewDrugAllocation",
        "getDrugById",
    ],
    PATIENT: [
        "view_own_records",
        "view_own_prescriptions",
        "view_own_appointments",
        "create_appointment_request",
    ],
    ADMIN: [
        "getAllPatients",
        "getPatientByNic",
        "createPatient",
        "updatePatient",
        "isPatientExist",
        "deletePatient",
    ],
};
const permissionMiddleware = {
    // Check if user has required permissions
    hasPermission: (requiredPermissions) => {
        return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        message: "Unauthorized: User information is missing",
                    });
                }
                const userRole = req.user.role;
                const userPermissions = rolePermissions[userRole] || [];
                // Check if user has all required permissions
                const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));
                if (!hasAllPermissions) {
                    return res.status(403).json({
                        message: "You don't have permission to perform this action",
                    });
                }
                next();
            }
            catch (error) {
                res.status(500).json({
                    message: "Error checking permissions",
                    error: error.message,
                });
            }
        });
    },
    // Check if user can access specific patient data
    canAccessPatient: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || !req.user.id) {
                return res.status(401).json({
                    message: "Unauthorized: User information is missing",
                });
            }
            const userRole = req.user.role;
            const userId = req.user.id;
            const patientId = req.params.nic;
            // Admins, doctors, and nurses can access all patient records
            if (["ADMIN", "DOCTOR", "NURSE"].includes(userRole)) {
                return next();
            }
            // Patients can only access their own records
            //   if (userRole === "PATIENT" && userId === parseInt(patientId)) {
            //     return next();
            //   }
            res.status(403).json({
                message: "You don't have permission to access this patient's records",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Error checking patient access",
                error: error.message,
            });
        }
    }),
};
exports.default = permissionMiddleware;
