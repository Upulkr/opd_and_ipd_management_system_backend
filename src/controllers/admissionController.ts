import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface genralData {
  date?: Date;
  bht?: number;
  admissionSheetId?: number;
  admissionBookId?: number;
}
export const getadmiisionsGeneralDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const { nic } = req.params;
    const patientExists = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const admissionSheets = await prisma.admissionSheet.findMany({
      where: {
        nic,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        bht: true,
      },
    });

    const admissionbooks = await prisma.admissionbook.findMany({
      where: {
        nic,
        bht: {
          in: admissionSheets.map((admissionSheet) => admissionSheet.bht),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        bht: true,
      },
    });

    const combinedAdmissionData: genralData[] = admissionSheets.map(
      (admissionSheet) => ({
        date: admissionSheet.createdAt,
        bht: admissionSheet.bht,
        admissionSheetId: admissionSheet.id,
        admissionBookId: admissionbooks.find(
          (book) => book.bht == admissionSheet.bht
        )?.id,
      })
    );

    res.status(200).json({ combinedAdmissionData });
  } catch (error) {}
};

export const admissionSheeetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }
    const admissionSheet = await prisma.admissionSheet.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ admissionSheet });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admission sheet" });
  }
};
export const admissioBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }
    const admissionSheet = await prisma.admissionbook.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ admissionSheet });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admission book" });
  }
};
