import { format, subMonths } from "date-fns";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client.
const prisma = new PrismaClient();

// Data interface for mapping query results.
interface patienData {
  month_year: string;
  visits: number;
}
/**
 * Retrieves monthly patient visit statistics for the last 6 months.
 * Aggregates both OutPatient and InPatient (Admission) numbers.
 */
export const getMonthlyPatientVisit = async (req: Request, res: Response) => {
  try {
    const sixMonthsAgo = subMonths(new Date(), 6);

    // 1. Fetch outpatient data grouped by month for the last 6 months.
    // Uses PostgreSQL date functions for truncation and formatting.
    const monthlyOutPatient: patienData[] = await prisma.$queryRaw`
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "OutPatientFrom"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;

    // 2. Fetch inpatient data grouped by month for the last 6 months.
    const monthlyInPatient: patienData[] = await prisma.$queryRaw`
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "AdmissionSheet"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;

    // 3. Initialize a result array with default 0 visits for the last 6 months.
    // This ensures we have entries even for months with zero patients.
    const monthlyPatientData: { month_year: string; visits: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const monthKey = format(subMonths(new Date(), i), "MMM-yyyy"); // e.g., 'Jan-2024'

      // Push the initial object into the array.
      monthlyPatientData.push({
        month_year: monthKey, // Month name.
        visits: 0, // Default visits count.
      });
    }

    // 4. Map Outpatient data to the result array.
    monthlyOutPatient.forEach(({ month_year, visits }: patienData) => {
      // Find the existing month object and update the visits count.
      const monthData = monthlyPatientData.find(
        (m) => m.month_year === month_year,
      );
      if (monthData) {
        monthData.visits += Number(visits);
      }
    });

    // 5. Aggregate Inpatient Data into the result array.
    monthlyInPatient.forEach(({ month_year, visits }: patienData) => {
      // Find the existing month object and add the visits count to the total.
      const monthData = monthlyPatientData.find(
        (m) => m.month_year === month_year,
      );
      if (monthData) {
        monthData.visits += Number(visits); // Summing up inpatient visits.
      }
    });

    return res.json(monthlyPatientData);
  } catch (error) {
    console.error("Error fetching monthly patient visits:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
