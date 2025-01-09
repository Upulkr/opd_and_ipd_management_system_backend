import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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

    const wardDetailsAccordingToWardNo: [
      {
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
FROM "Ward" as wa
where wa."wardNo"=${noOfpatientsUndergoing[0].wardNo as string}`;

    const wardData = [
      {
        wardNumber:
          noOfpatientsUndergoing.length > 0
            ? noOfpatientsUndergoing[0].wardNo
            : null,
        noOfpatientsUndergoing:
          noOfpatientsUndergoing.length > 0
            ? noOfpatientsUndergoing[0].count
            : 0,
        getnoOfTodayAdmitted:
          getnoOfTodayAdmitted.length > 0 ? getnoOfTodayAdmitted[0].count : 0,
        wardName:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].wardName
            : null,
        noOfDischargedToday:
          getnoOfTodayDischarged.length > 0
            ? getnoOfTodayDischarged[0].count
            : 0,
        noOfBeds:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].noOfBeds
            : 0,
        noOfUsedBeds:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].noOfUsedBeds
            : 0,
        noOfFreeBeds:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].noOfFreeBeds
            : 0,
        noOfdoctors:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].noffdoctors
            : 0,
        noOfnurses:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].nofNurses
            : 0,
        telephone:
          wardDetailsAccordingToWardNo.length > 0
            ? wardDetailsAccordingToWardNo[0].telephone
            : null,
      },
    ];

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
