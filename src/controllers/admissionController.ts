import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Interface defining the structure of the combined admission data.
// This matches the shape of data we want to send to the frontend.
interface genralData {
  date?: Date;
  bht?: number;
  admissionSheetId?: number;
  admissionBookId?: number;
}
/**
 * Retrieves general admission details for a patient by NIC.
 * It aggregates data from both AdmissionSheet and AdmissionBook.
 */
export const getadmiisionsGeneralDetails = async (
  req: Request,
  res: Response,
) => {
  try {
    const { nic } = req.params;

    // First, verify if the patient exists in the system.
    const patientExists = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Fetch all admission sheets for this NIC.
    // Selecting specific fields to optimize query performance.
    const admissionSheets = await prisma.admissionSheet.findMany({
      where: {
        nic,
      },
      orderBy: {
        createdAt: "desc", // Latest first
      },
      select: {
        id: true,
        createdAt: true,
        bht: true,
      },
    });

    // Fetch admission book entries that match the BHTs found in the admission sheets.
    // 'in' operator checks if 'bht' exists in the provided array.
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

    // Combining data from both sources into a unified structure.
    // We map over admission sheets and find the corresponding admission book entry by BHT.
    const combinedAdmissionData: genralData[] = admissionSheets.map(
      (admissionSheet) => ({
        date: admissionSheet.createdAt,
        bht: admissionSheet.bht,
        admissionSheetId: admissionSheet.id,
        // Finding the matching book ID, if it exists.
        admissionBookId: admissionbooks.find(
          (book) => book.bht == admissionSheet.bht,
        )?.id,
      }),
    );

    res.status(200).json({ combinedAdmissionData });
  } catch (error) {
    // TODO: Add error logging here.
  }
};

/**
 * Fetch a single Admission Sheet by its unique ID.
 */
export const admissionSheeetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }
    // Using findUnique with the primary key 'id'.
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
/**
 * Fetch a single Admission Book entry by its unique ID.
 */
export const admissionBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }
    // Using findUnique with the primary key 'id'.
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
