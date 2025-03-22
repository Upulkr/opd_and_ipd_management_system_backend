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
exports.getMonthlyPatientVisit = void 0;
const date_fns_1 = require("date-fns");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMonthlyPatientVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sixMonthsAgo = (0, date_fns_1.subMonths)(new Date(), 6);
        // Fetch outpatient data grouped by month
        const monthlyOutPatient = yield prisma.$queryRaw `
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "OutPatientFrom"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;
        // Fetch inpatient data grouped by month
        const monthlyInPatient = yield prisma.$queryRaw `
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "AdmissionSheet"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;
        // Initialize response object with last 6 months
        const monthlyPatientData = [];
        for (let i = 6; i >= 0; i--) {
            const monthKey = (0, date_fns_1.format)((0, date_fns_1.subMonths)(new Date(), i), "MMM-yyyy"); // 'Jan', 'Feb', etc.
            // Push the formatted object into the array
            monthlyPatientData.push({
                month_year: monthKey, // Month name
                visits: 0, // Default visits count
            });
        }
        monthlyOutPatient.forEach(({ month_year, visits }) => {
            // Find the existing month in the array and update the visits count
            const monthData = monthlyPatientData.find((m) => m.month_year === month_year);
            if (monthData) {
                monthData.visits += visits; // Corrected property reference
            }
        });
        // Step 3: Aggregate Inpatient Data
        monthlyInPatient.forEach(({ month_year, visits }) => {
            // Find the existing month in the array and update the visits count
            const monthData = monthlyPatientData.find((m) => m.month_year === month_year);
            if (monthData) {
                monthData.visits += visits; // Sum up visits correctly
            }
        });
        return res.json(monthlyPatientData);
    }
    catch (error) {
        console.error("Error fetching monthly patient visits:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMonthlyPatientVisit = getMonthlyPatientVisit;
