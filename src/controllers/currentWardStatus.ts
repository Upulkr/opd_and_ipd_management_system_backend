import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export const getCurrentWardStatus = async (req: Request, res: Response) => {
  try {
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
    ])
    ;
    
  } catch (error: any) {
    res.status(500).json({
      message: `Error getting current ward status: ${error.message}`,
    });
  }
};
