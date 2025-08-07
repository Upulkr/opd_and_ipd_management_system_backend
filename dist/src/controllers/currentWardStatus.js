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
exports.getWardNames = exports.getCurrentWardStatus = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
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
        const wardNos = noOfpatientsUndergoing.map((ward) => ward.wardNo);
        if (wardNos.length === 0) {
            console.log("No ward numbers found, skipping query");
            return [];
        }
        const wardDetails = yield prisma.$queryRaw `SELECT 
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
FROM "Ward"    WHERE "wardNo" IN (${client_2.Prisma.join(wardNos)});
`;
        const wardData = noOfpatientsUndergoing === null || noOfpatientsUndergoing === void 0 ? void 0 : noOfpatientsUndergoing.map((ward) => {
            const wardDetailsData = wardDetails.find((detail) => detail.wardNo === ward.wardNo);
            return {
                wardNumber: ward.wardNo,
                noOfpatientsUndergoing: ward.count,
                getnoOfTodayAdmitted: getnoOfTodayAdmitted.length > 0 ? getnoOfTodayAdmitted[0].count : 0,
                wardName: wardDetailsData ? wardDetailsData.wardName : null,
                noOfDischargedToday: getnoOfTodayDischarged.length > 0
                    ? getnoOfTodayDischarged[0].count
                    : 0,
                noOfBeds: wardDetailsData ? wardDetailsData.noOfBeds : 0,
                noOfUsedBeds: wardDetailsData ? wardDetailsData.noOfUsedBeds : 0,
                noOfFreeBeds: wardDetailsData ? wardDetailsData.noOfFreeBeds : 0,
                noOfdoctors: wardDetailsData ? wardDetailsData.noffdoctors : 0,
                noOfnurses: wardDetailsData ? wardDetailsData.nofNurses : 0,
                telephone: wardDetailsData ? wardDetailsData.telephone : null,
            };
        });
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
const getWardNames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wardNames = yield prisma.ward.findMany({
            select: {
                wardName: true,
            },
        });
        res.status(200).json(wardNames);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error getting ward names: ${error.message}` });
    }
});
exports.getWardNames = getWardNames;
