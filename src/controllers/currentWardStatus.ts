import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Handling BigInt serialization for JSON response.
// Prisma raw queries return BigInt for counts, which need to be converted to numbers or strings.
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

/**
 * Retrieves the current status of all wards.
 * Aggregates data from multiple sources:
 * - Ward capacity and free beds
 * - Active admissions (patients currently in wards)
 * - Daily admission and discharge stats
 */
export const getCurrentWardStatus = async (req: Request, res: Response) => {
  try {
    // 1. Calculate total capacity and availability across all wards.
    // Uses COALESCE to handle null values (treating them as 0).
    const totalAvailableBeds: [
      { totalBeds: number; totalNoOfFreeBeds: number },
    ] =
      await prisma.$queryRaw`select SUM(COALESCE("noOfBeds", 0)) AS "totalBeds", 
    SUM(COALESCE("noOfFreeBeds", 0)) AS "totalNoOfFreeBeds"  from "Ward"`;

    // 2. Count patients currently admitted (active) in each ward.
    // Filters for records where 'dischargeDate' is NULL.
    const noOfpatientsUndergoing: [{ wardNo: string; count: number }] =
      await prisma.$queryRaw`SELECT ad."wardNo", count(name) AS "count"
FROM "Admissionbook" AS ad 
WHERE ad."dischargeDate" IS NULL group by ad."wardNo";`;

    // 3. Count total admissions for TODAY.
    const getnoOfTodayAdmitted: [{ count: number }] =
      await prisma.$queryRaw`SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."admittedDate"::DATE = CURRENT_DATE;`;

    // 4. Count total discharges for TODAY.
    const getnoOfTodayDischarged: [{ count: number }] =
      await prisma.$queryRaw`SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."dischargeDate"::DATE = CURRENT_DATE;`;

    // Get list of ward numbers that have active patients.
    const wardNos = noOfpatientsUndergoing.map((ward) => ward.wardNo);

    // If no wards have patients, return empty array immediately to avoid query error.
    if (wardNos.length === 0) {
      console.log("No ward numbers found, skipping query");
      return [];
    }

    // 5. Fetch detailed information for the relevant wards.
    // Uses Prisma.join to safely insert the array of ward numbers into the raw SQL query.
    const wardDetails: [
      {
        wardNo: string;
        wardName: string;
        noOfBeds: number;
        noOfUsedBeds: number;
        noOfFreeBeds: number;
        noOfPatients: number;
        telephone: string;
        noffdoctors: number;
        nofNurses: number;
      },
    ] = await prisma.$queryRaw`SELECT 
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
FROM "Ward"    WHERE "wardNo" IN (${Prisma.join(wardNos)});
`;

    // Combine aggregated counts with ward details.
    const wardData = noOfpatientsUndergoing?.map((ward) => {
      const wardDetailsData = wardDetails.find(
        (detail) => detail.wardNo === ward.wardNo,
      );
      return {
        wardNumber: ward.wardNo,
        noOfpatientsUndergoing: ward.count,
        getnoOfTodayAdmitted:
          getnoOfTodayAdmitted.length > 0 ? getnoOfTodayAdmitted[0].count : 0,
        wardName: wardDetailsData ? wardDetailsData.wardName : null,
        noOfDischargedToday:
          getnoOfTodayDischarged.length > 0
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

    // Extract total capacity stats.
    const totalBeds =
      totalAvailableBeds.length > 0 ? totalAvailableBeds[0].totalBeds : 0;
    const totalNoOfFreeBeds =
      totalAvailableBeds.length > 0
        ? totalAvailableBeds[0].totalNoOfFreeBeds
        : 0;

    // Send the constructed response.
    res.status(200).json({
      wardData,
      totalBeds,
      totalNoOfFreeBeds,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Error getting current ward status: ${error.message}`,
    });
  }
};

/**
 * Retrieves a simple list of all ward names.
 * Useful for dropdowns or filters.
 */
export const getWardNames = async (req: Request, res: Response) => {
  try {
    const wardNames = await prisma.ward.findMany({
      select: {
        wardName: true,
      },
    });
    res.status(200).json(wardNames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting ward names: ${error.message}` });
  }
};
