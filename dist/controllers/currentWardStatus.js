"use strict";
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
exports.getCurrentWardStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int !== null && int !== void 0 ? int : this.toString();
};
const getCurrentWardStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalAvailableBeds = yield prisma.$queryRaw `select SUM(COALESCE("noOfBeds", 0)) AS "totalBeds", 
    SUM(COALESCE("noOfFreeBeds", 0)) AS "totalNoOfFreeBeds"  from "Ward"`;
        const noOfpatientsUndergoing = yield prisma.$queryRaw `SELECT ad."wardNo", count(name) AS "count"
FROM "Admissionbook" AS ad 
WHERE ad."dischargeDate" IS NULL group by ad."wardNo";`;
        const getnoOfTodayAdmitted = yield prisma.$queryRaw `SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."admittedDate"::DATE = CURRENT_DATE;`;
        const getnoOfTodayDischarged = yield prisma.$queryRaw `SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."dischargeDate"::DATE = CURRENT_DATE;`;
        const wardDetailsAccordingToWardNo = yield prisma.$queryRaw `SELECT 
  "wardId", 
  "wardNo", 
  "wardName", 
  "noOfBeds", 
  "noOfUsedBeds", 
  "noOfFreeBeds", 
  "noOfPatients", 
  "telephone", 
  "noffdoctors", 
  "nofNurses" 
FROM "Ward" as wa
where wa."wardNo"=${noOfpatientsUndergoing[0].wardNo}`;
        const wardData = [
            {
                wardNumber: noOfpatientsUndergoing.length > 0
                    ? noOfpatientsUndergoing[0].wardNo
                    : null,
                noOfpatientsUndergoing: noOfpatientsUndergoing.length > 0
                    ? noOfpatientsUndergoing[0].count
                    : 0,
                getnoOfTodayAdmitted: getnoOfTodayAdmitted.length > 0 ? getnoOfTodayAdmitted[0].count : 0,
                wardName: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].wardName
                    : null,
                noOfDischargedToday: getnoOfTodayDischarged.length > 0
                    ? getnoOfTodayDischarged[0].count
                    : 0,
                noOfBeds: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].noOfBeds
                    : 0,
                noOfUsedBeds: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].noOfUsedBeds
                    : 0,
                noOfFreeBeds: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].noOfFreeBeds
                    : 0,
                noOfdoctors: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].noffdoctors
                    : 0,
                noOfnurses: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].nofNurses
                    : 0,
                telephone: wardDetailsAccordingToWardNo.length > 0
                    ? wardDetailsAccordingToWardNo[0].telephone
                    : null,
            },
        ];
        // Extract totalBeds and totalNoOfFreeBeds
        const totalBeds = totalAvailableBeds.length > 0 ? totalAvailableBeds[0].totalBeds : 0;
        const totalNoOfFreeBeds = totalAvailableBeds.length > 0
            ? totalAvailableBeds[0].totalNoOfFreeBeds
            : 0;
        // Send response with separate data
        res.status(200).json({
            wardData,
            totalBeds,
            totalNoOfFreeBeds,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Error getting current ward status: ${error.message}`,
        });
    }
});
exports.getCurrentWardStatus = getCurrentWardStatus;
