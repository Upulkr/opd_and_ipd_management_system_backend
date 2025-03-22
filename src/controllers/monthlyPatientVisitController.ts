import { format, subMonths } from "date-fns";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface patienData {
  month_year: string;
  visits: number;
}
export const getMonthlyPatientVisit = async (req: Request, res: Response) => {
  try {
    const sixMonthsAgo = subMonths(new Date(), 6);

    // Fetch outpatient data grouped by month
    const monthlyOutPatient: patienData[] = await prisma.$queryRaw`
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "OutPatientFrom"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;

    // Fetch inpatient data grouped by month
    const monthlyInPatient: patienData[] = await prisma.$queryRaw`
  SELECT 
    TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon-YYYY') AS month_year,
    COUNT(id) AS visits
  FROM "AdmissionSheet"
  WHERE "createdAt" >= ${sixMonthsAgo}
  GROUP BY DATE_TRUNC('month', "createdAt")
  ORDER BY DATE_TRUNC('month', "createdAt") ASC;
`;

    // Initialize response object with last 6 months
    const monthlyPatientData: { month_year: string; visits: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const monthKey = format(subMonths(new Date(), i), "MMM-yyyy"); // 'Jan', 'Feb', etc.

      // Push the formatted object into the array
      monthlyPatientData.push({
        month_year: monthKey, // Month name
        visits: 0, // Default visits count
      });
    }

    monthlyOutPatient.forEach(({ month_year, visits }: patienData) => {
      // Find the existing month in the array and update the visits count
      const monthData = monthlyPatientData.find(
        (m) => m.month_year === month_year
      );
      if (monthData) {
        monthData.visits += visits; // Corrected property reference
      }
    });

    // Step 3: Aggregate Inpatient Data
    monthlyInPatient.forEach(({ month_year, visits }: patienData) => {
      // Find the existing month in the array and update the visits count
      const monthData = monthlyPatientData.find(
        (m) => m.month_year === month_year
      );
      if (monthData) {
        monthData.visits += visits; // Sum up visits correctly
      }
    });

    return res.json(monthlyPatientData);
  } catch (error) {
    console.error("Error fetching monthly patient visits:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
