import { Request, Response } from "express";
import { PrismaClient, Ward } from "@prisma/client";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
type WardSummary = {
  noOfBeds: number;
  noOfUsedBeds: number;
  wardName: string;
  wardNo: string;
};

export const changeBedStatusForInpatientTable = async (
  req: Request,
  res: Response
) => {
  try {
    const { wardNo } = req.params;

    const wardIsExist = await prisma.ward.findUnique({
      where: {
        wardNo: wardNo,
      },
    });
    if (!wardIsExist) {
      return res.status(404).json({ message: "Ward not found" });
    }

    const wardDetails: [
      {
        noOfBeds: number;
        noOfPatients: number;
        noOfUsedBeds: number;
        noOfFreeBeds: number;
      }
    ] =
      await prisma.$queryRaw`select "noOfBeds","noOfPatients","noOfUsedBeds","noOfFreeBeds" from "Ward" where "wardNo" = ${wardNo}`;
    console.log("wardDetails", wardDetails[0]);

    await prisma.$queryRaw`update "Ward" set "noOfFreeBeds"=${
      wardDetails[0].noOfFreeBeds - 1
    } where "wardNo" = ${wardNo}`;

    await prisma.$queryRaw`update "Ward" set "noOfUsedBeds"=${
      wardDetails[0].noOfUsedBeds + 1
    } where "wardNo" = ${wardNo}`;

    await prisma.$queryRaw`update "Ward" set "noOfPatients"=${
      wardDetails[0].noOfPatients + 1
    } where "wardNo" = ${wardNo}`;

    res.status(200).json({ message: "Bed status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing bed status" });
  }
};

export const getAllWardBedsCount = async (req: Request, res: Response) => {
  try {
    const wardDetails = await prisma.$queryRaw<WardSummary[]>`
    select "noOfBeds", "noOfUsedBeds", "wardName" from "Ward"
  `;

    const wardArray = wardDetails.map((ward) => ({
      wardName: ward.wardName,
      noOfBeds: ward.noOfBeds,
      percentage: parseFloat(
        ((ward.noOfUsedBeds / ward.noOfBeds) * 100).toFixed(2)
      ),
    }));

    res.status(200).json(wardArray);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ward details" });
  }
};
export const getAllWarNoAndWardNAme = async (req: Request, res: Response) => {
  try {
    const wardDetails = await prisma.$queryRaw<WardSummary[]>`
    select "wardNo","wardName" from "Ward"
  `;

    const wardArray = wardDetails.map((ward) => ({
      wardNo: ward.wardNo,
      wardName: ward.wardName,
    }));

    res.status(200).json(wardArray);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ward details" });
  }
};
