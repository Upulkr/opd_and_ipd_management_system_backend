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
        res.status(200).json([
            {
                wardNumber: noOfpatientsUndergoing[0].wardNo,
                noOfpatientsUndergoing: noOfpatientsUndergoing[0].count,
                getnoOfTodayAdmitted: getnoOfTodayAdmitted[0].count,
                wardName: wardDetailsAccordingToWardNo[0].wardName,
                noOfDischargedToday: getnoOfTodayDischarged[0].count,
                noOfBeds: wardDetailsAccordingToWardNo[0].noOfBeds,
                noOfUsedBeds: wardDetailsAccordingToWardNo[0].noOfUsedBeds,
                noOfFreeBeds: wardDetailsAccordingToWardNo[0].noOfFreeBeds,
                noOfdoctors: wardDetailsAccordingToWardNo[0].noffdoctors,
                noOfnurses: wardDetailsAccordingToWardNo[0].nofNurses,
                telephone: wardDetailsAccordingToWardNo[0].telephone,
            }
        ]);
    }
    catch (error) {
        res.status(500).json({
            message: `Error getting current ward status: ${error.message}`,
        });
    }
});
exports.getCurrentWardStatus = getCurrentWardStatus;
