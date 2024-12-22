import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const {
      nic,
      name,
      age,
      gender,
      address,
      phone,
      wardNo,
      reason,
      pressure,
      weight,
      ticket,
      bht,
    } = req.body;

    const newAdmissionSheet = await prisma.admissionSheet.create({
      data: {
        nic,
        name,
        age,
        gender,
        address,
        phone,
        wardNo,
        reason,
        pressure,
        weight,
        ticket,
        bht,
      },
    });
    res.status(201).json({
      message: "AdmissionSheet Created Successfully",
      newAdmissionSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error creating AdmissionSheet:  ${(error as any).message}`,
    });
  }
};

export const updateAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const {
      nic,
      name,
      age,
      gender,
      address,
      phone,
      wardNo,
      reason,
      pressure,
      weight,
      ticket,
    } = req.body;

    const updatedAdmissionSheet = await prisma.admissionSheet.update({
      where: {
        nic: nic,
      },
      data: {
        age,
        name,
        gender,
        address,
        phone,
        wardNo,
        reason,
        pressure,
        weight,
        ticket,
      },
    });
    res.status(200).json({
      message: "AdmissionSheet Updated Successfully",
      updatedAdmissionSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error updating AdmissionSheet ${(error as any).message}`,
    });
  }
};

export const getAdmissionSheets = async (req: Request, res: Response) => {
  try {
    const admissionSheets = await prisma.admissionSheet.findMany();
    res.json(admissionSheets);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving admissionSheets: ${error.message}` });
  }
};

export const deleteAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ message: "nic is required" });
    }
    const deletedAdmissionSheet = await prisma.admissionSheet.delete({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });
    res.status(200).json({
      message: "AdmissionSheet Deleted Successfully",
      deletedAdmissionSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error deleting AdmissionSheet: ${(error as any).message}`,
    });
  }
};

export const getAllAdmissionSheetByNic = async (
  req: Request,
  res: Response
) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ message: "nic is required" });
    }
    const admissionSheet = await prisma.admissionSheet.findMany({
      where: {
        nic: Number(nic),
      },
    });
    res.status(200).json(admissionSheet);
  } catch (error) {
    res.status(500).json({
      message: `Error getting AdmissionSheet: ${(error as any).message}`,
    });
  }
};
export const getrelatedAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic && !bht) {
      return res.status(400).json({ message: "nic is required" });
    }
    const admissionSheet = await prisma.admissionSheet.findUnique({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });
    res.status(200).json(admissionSheet);
  } catch (error) {
    res.status(500).json({
      message: `Error getting AdmissionSheet: ${(error as any).message}`,
    });
  }
};
