import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export const getCurrentWardStatus = async (req: Request, res: Response) => {
  try {
    const totalAvailableBeds: [
      { totalBeds: number; totalNoOfFreeBeds: number }
    ] =
      await prisma.$queryRaw`select SUM(COALESCE("noOfBeds", 0)) AS "totalBeds", 
    SUM(COALESCE("noOfFreeBeds", 0)) AS "totalNoOfFreeBeds"  from "Ward"`;

    const noOfpatientsUndergoing: [{ wardNo: string; count: number }] =
      await prisma.$queryRaw`SELECT ad."wardNo", count(name) AS "count"
FROM "Admissionbook" AS ad 
WHERE ad."dischargeDate" IS NULL group by ad."wardNo";`;

    const getnoOfTodayAdmitted: [{ count: number }] =
      await prisma.$queryRaw`SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."admittedDate"::DATE = CURRENT_DATE;`;

    const getnoOfTodayDischarged: [{ count: number }] =
      await prisma.$queryRaw`SELECT COUNT(name)
FROM "Admissionbook" AS ad
WHERE ad."dischargeDate"::DATE = CURRENT_DATE;`;

    const wardNos = noOfpatientsUndergoing.map((ward) => ward.wardNo);
    if (wardNos.length === 0) {
      console.log("No ward numbers found, skipping query");
      return [];
    }
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
      }
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

    const wardData = noOfpatientsUndergoing?.map((ward) => {
      const wardDetailsData = wardDetails.find(
        (detail) => detail.wardNo === ward.wardNo
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

    // Extract totalBeds and totalNoOfFreeBeds
    const totalBeds =
      totalAvailableBeds.length > 0 ? totalAvailableBeds[0].totalBeds : 0;
    const totalNoOfFreeBeds =
      totalAvailableBeds.length > 0
        ? totalAvailableBeds[0].totalNoOfFreeBeds
        : 0;

    // Send response with separate data
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
