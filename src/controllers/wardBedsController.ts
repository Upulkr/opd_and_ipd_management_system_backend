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

/**
 * Updates bed status when a patient is admitted to a ward.
 * Decrements free beds, increments used beds and patient count.
 * Note: Should ideally be a transaction to ensure data integrity.
 */
export const changeBedStatusForInpatientTable = async (
  req: Request,
  res: Response,
) => {
  try {
    const { wardNo } = req.params;

    // Check if the ward exists.
    const wardIsExist = await prisma.ward.findUnique({
      where: {
        wardNo: wardNo,
      },
    });
    if (!wardIsExist) {
      return res.status(404).json({ message: "Ward not found" });
    }

    // Fetch current statistics for the ward.
    const wardDetails: [
      {
        noOfBeds: number;
        noOfPatients: number;
        noOfUsedBeds: number;
        noOfFreeBeds: number;
      },
    ] =
      await prisma.$queryRaw`select "noOfBeds","noOfPatients","noOfUsedBeds","noOfFreeBeds" from "Ward" where "wardNo" = ${wardNo}`;
    console.log("wardDetails", wardDetails[0]);

    // Update 'noOfFreeBeds' - decrement by 1.
    await prisma.$queryRaw`update "Ward" set "noOfFreeBeds"=${
      wardDetails[0].noOfFreeBeds - 1
    } where "wardNo" = ${wardNo}`;

    // Update 'noOfUsedBeds' - increment by 1.
    await prisma.$queryRaw`update "Ward" set "noOfUsedBeds"=${
      wardDetails[0].noOfUsedBeds + 1
    } where "wardNo" = ${wardNo}`;

    // Update 'noOfPatients' - increment by 1.
    await prisma.$queryRaw`update "Ward" set "noOfPatients"=${
      wardDetails[0].noOfPatients + 1
    } where "wardNo" = ${wardNo}`;

    res.status(200).json({ message: "Bed status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing bed status" });
  }
};

/**
 * Retrieves bed usage statistics for all wards.
 * Calculates the percentage of used beds.
 */
export const getAllWardBedsCount = async (req: Request, res: Response) => {
  try {
    // Fetch ward summaries (total beds, used beds, name).
    const wardDetails = await prisma.$queryRaw<WardSummary[]>`
    select "noOfBeds", "noOfUsedBeds", "wardName" from "Ward"
  `;

    // Calculate usage percentage for each ward.
    const wardArray = wardDetails.map((ward) => ({
      wardName: ward.wardName,
      noOfBeds: ward.noOfBeds,
      percentage: parseFloat(
        ((ward.noOfUsedBeds / ward.noOfBeds) * 100).toFixed(2),
      ),
    }));

    res.status(200).json(wardArray);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ward details" });
  }
};
/**
 * Retrieves a list of all Ward Numbers and Ward Names.
 */
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
