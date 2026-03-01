import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Creates a new medical report for a patient.
 * Requires PatientNic, reportType, and documentUrl in request body.
 */
export const createMedicalReport = async (req: Request, res: Response) => {
  const { PatientNic, reportType, documentUrl } = req.body; // Destructuring request body

  try {
    const medicalReport = await prisma.medicalreport.create({
      data: {
        PatientNic,
        reportType,
        documentUrl,
      },
    });
    res.status(201).json(medicalReport);
  } catch (error) {
    res.status(500).json({ error: "Error creating medical report" });
  }
};

/**
 * Retrieves all medical reports from the database.
 * Useful for admin or general overview (careful with large datasets).
 */
export const getMedicalReports = async (req: Request, res: Response) => {
  try {
    const medicalReports = await prisma.medicalreport.findMany();
    res.status(200).json(medicalReports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical reports" });
  }
};

/**
 * Retrieves all medical reports associated with a specific patient NIC.
 */
export const getAllMedicalReportbyNic = async (req: Request, res: Response) => {
  const { PatientNic } = req.params;

  try {
    const medicalReports = await prisma.medicalreport.findMany({
      where: {
        PatientNic,
      },
    });
    res.status(200).json(medicalReports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical reports" });
  }
};

/**
 * Retrieves a specific medical report using both Patient NIC and Report ID.
 * Ensures the report belongs to the specified patient.
 */
export const getMEdicalRportbyNicandId = async (
  req: Request,
  res: Response,
) => {
  const { PatientNic, id } = req.params;

  try {
    const medicalReport = await prisma.medicalreport.findFirst({
      where: {
        PatientNic,
        id: Number(id),
      },
    });
    res.status(200).json(medicalReport);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical report" });
  }
};

/**
 * Retrieves medical reports filtered by Patient NIC and Report Type.
 * Useful for finding specific categories of reports for a user.
 */
export const getMedicalReportByNicandType = async (
  req: Request,
  res: Response,
) => {
  const { nic: PatientNic, doctype: reportType } = req.params;

  // Validate required parameters
  if (!PatientNic || !reportType) {
    return res
      .status(400)
      .json({ message: "Patient Nic and reportType are required" });
  }

  console.log("Fetching report for type:", reportType);

  try {
    const medicalReport = await prisma.medicalreport.findMany({
      where: {
        PatientNic,
        reportType,
      },
    });

    if (!medicalReport || medicalReport.length === 0) {
      return res.status(404).json({ message: "No medical report found" });
    }

    // Log found reports (for debugging).
    console.log("Medical reports found:", medicalReport);

    res.status(200).json(medicalReport);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical report" });
  }
};
