import { Patient } from "./../../node_modules/.prisma/client/index.d";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createMedicalReport = async (req: Request, res: Response) => {
  const { PatientNic, reportType, documentUrl } = req.body;

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

export const getMedicalReports = async (req: Request, res: Response) => {
  try {
    const medicalReports = await prisma.medicalreport.findMany();
    res.status(200).json(medicalReports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical reports" });
  }
};

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

export const getMEdicalRportbyNicandId = async (
  req: Request,
  res: Response
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

export const getMedicalReportByNicandType = async (
  req: Request,
  res: Response
) => {
  const { nic: PatientNic, doctype: reportType } = req.params;
  // Log the PatientNic received in the request
  if (!PatientNic || !reportType) {
    return res
      .status(400)
      .json({ message: "Patient Nic and reportType are required" });
  }

  try {
    const medicalReport = await prisma.medicalreport.findMany({
      where: {
        PatientNic,
        reportType,
      },
    });
    console.log("medicalReport", medicalReport); // Log the fetched medical report
    if (!medicalReport || medicalReport.length === 0) {
      return res.status(404).json({ message: "No medical report found" });
    }
    // Log the fetched medical report
    res.status(200).json(medicalReport);
  } catch (error) {
    res.status(500).json({ error: "Error fetching medical report" });
  }
};
