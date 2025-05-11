import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAdmissionBook = async (req: Request, res: Response) => {
  try {
    const {
      nic,
      bht,
      name,
      dailyno,
      yearlyno,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      age,
      admittedDate,
      reason,
      allergies,
      phone,
      transferCategory,
      dischargeDate,
      wardNo,
      livingStatus,
    } = req.body;

    const newAdmissionBook = await prisma.admissionbook.create({
      data: {
        nic,
        bht: Number(bht),
        name,
        dailyno,
        yearlyno,
        city,
        stateProvince,
        postalCode,
        country,
        streetAddress,
        age,
        admittedDate: new Date(admittedDate),
        reason,
        allergies,
        transferCategory,
        phone,
        wardNo,
        livingStatus,
        dischargeDate: dischargeDate ? new Date(dischargeDate) : null,
      },
    });
    res.status(201).json({
      message: "AdmissionBook Created Successfully",
      newAdmissionBook,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating AdmissionBook:  ${(error as any).message}`,
    });
  }
};

export const getAdmissionBooks = async (req: Request, res: Response) => {
  try {
    const admissionBooks = await prisma.admissionbook.findMany();
    res.status(200).json(admissionBooks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};

export const getrelatedAdmissionBookbyBHT = async (
  req: Request,
  res: Response
) => {
  const { bht } = req.query;
  try {
    const admissionBook = await prisma.admissionbook.findUnique({
      where: {
        bht: Number(bht),
      },
    });
    res.status(200).json({ admissionBook });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};
export const getAllAdmissionBooksforNic = async (
  req: Request,
  res: Response
) => {
  const { nic, bht } = req.params;
  try {
    const admissionBook = await prisma.admissionbook.findMany({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(admissionBook);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};

export const updateAdmissionBook = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const {
      nic,
      bht,
      name,
      dailyno,
      yearlyno,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      age,
      admittedDate,
      reason,
      allergies,
      phone,
      transferCategory,
      dischargeDate,
      wardNo,
      livingStatus,
    } = req.body;
    const updatedAdmissionBook = await prisma.admissionbook.update({
      where: {
        nic,
        bht,
      },
      data: {
        nic,
        bht: Number(bht),
        name,
        dailyno,
        yearlyno,
        city,
        stateProvince,
        postalCode,
        country,
        streetAddress,
        age,
        admittedDate: new Date(admittedDate),
        reason,
        allergies,
        transferCategory,
        phone,
        wardNo,
        dischargeDate: new Date(dischargeDate),
      },
    });
    res.status(200).json(updatedAdmissionBook);
  } catch (error) {
    res.status(500).json({
      message: `Error updating AdmissionBook: ${(error as any).message}`,
    });
  }
};

export const deleteAdmissionBook = async (req: Request, res: Response) => {
  const { nic, bht } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const deletedAdmissionBook = await prisma.admissionbook.delete({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(deletedAdmissionBook);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting AdmissionBook: ${error.message}` });
  }
};

export const getNumberOfAdmissionBooksToday = async (
  req: Request,
  res: Response
) => {
  try {
    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const outPatientsTodayCount = await prisma.admissionbook.count({
      where: {
        createdAt: {
          gte: startOfDay, // Greater than or equal to the start of the day
          lte: endOfDay, // Less than or equal to the end of the day
        },
      },
    });

    res.status(200).json(outPatientsTodayCount);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDischargeCounts = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const dischargeCounts = await prisma.admissionbook.groupBy({
      by: ["dischargeDate"],
      _count: {
        dischargeDate: true,
      },
      where: {
        dischargeDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    res.status(200).json(dischargeCounts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
