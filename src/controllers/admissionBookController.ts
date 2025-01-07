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
