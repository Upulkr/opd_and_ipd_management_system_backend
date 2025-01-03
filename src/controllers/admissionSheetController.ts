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

      phone,
      wardNo,
      reason,
      pressure,
      weight,

      bht,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
    } = req.body;

    // const existingAdmissionSheet = await prisma.admissionSheet.findUnique({
    //   where: {
    //     nic,
    //   },
    // });

    // if (existingAdmissionSheet) {
    //   return res.status(400).json({
    //     message: "AdmissionSheet already exists",
    //   });
    // }
    const newAdmissionSheet = await prisma.admissionSheet.create({
      data: {
        nic,
        name,
        age,
        gender,

        phone,
        wardNo,
        reason,
        pressure,
        weight,

        bht: Number(bht),
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
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
      bht,
      phone,
      wardNo,
      reason,
      pressure,
      weight,
    } = req.body;

    const updatedAdmissionSheet = await prisma.admissionSheet.update({
      where: {
        nic: nic,
        bht: Number(bht),
      },
      data: {
        age,
        name,
        gender,

        phone,
        wardNo,
        reason,
        pressure,
        weight,
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
        nic,
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
        nic,
      },
    });
    res.status(200).json(admissionSheet);
  } catch (error) {
    res.status(500).json({
      message: `Error getting AdmissionSheet: ${(error as any).message}`,
    });
  }
};

export const getrelatedAdmissionSheetByBht = async (
  req: Request,
  res: Response
) => {
  try {
    const { bht } = req.query;

    if (!bht) {
      return res.status(400).json({ message: "BHT is required" });
    }

    // Try findFirst instead of findUnique if bht is not a unique field
    const admissionSheet = await prisma.admissionSheet.findUnique({
      where: {
        bht: Number(bht),
      },
    });

    if (!admissionSheet) {
      return res
        .status(404)
        .json({ message: "No admission sheet found for the given BHT" });
    }

    res.status(200).json({ admissionSheet });
  } catch (error) {
    console.error("Error fetching admission sheet:", error);
    res.status(500).json({
      message: `Error getting admission sheet: ${(error as any).message}`,
    });
  }
};
