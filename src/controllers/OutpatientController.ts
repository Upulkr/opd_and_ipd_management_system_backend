import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createOutPatient = async (req: Request, res: Response) => {
  const {
    nic,
    age,
    name,
    gender,
    address,
    phone,
    diagnose,
    reason,
    pressure,
    weight,
  } = req.body;
  try {
    const newOutPatient = await prisma.outpatient.create({
      data: {
        nic,
        age,
        name,
        gender,
        address,
        phone,
        reason,
        pressure,
        weight,

        diagnose,
      },
    });

    res
      .status(200)
      .json({ message: "Patient Created Successfully", newOutPatient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating Patient: ${error.message}` });
  }
};

export const getAllOutPatients = async (req: Request, res: Response) => {
  try {
    const outPatients = await prisma.outpatient.findMany();
    res
      .status(200)
      .json({ message: "Patients fetched successfully!", outPatients });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Patients: ${error.message}` });
  }
};

export const getOutPatientByNic = async (req: Request, res: Response) => {
  const { nic } = req.params;
  try {
    const outPatient = await prisma.outpatient.findUnique({
      where: {
        nic: Number(nic),
      },
    });
    res
      .status(200)
      .json({ message: "Patient fetched successfully!", outPatient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Patient: ${error.message}` });
  }
};

export const deleteOutPatient = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const deletedOutPatient = await prisma.outpatient.delete({
      where: {
        nic: Number(nic),
      },
    });
    res.status(200).json({
      message: "OutPatient Deleted Successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting OutPatient: ${error.message}` });
  }
};

export const updateOutPatient = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const updatedOutPatient = await prisma.outpatient.update({
      where: {
        nic: Number(nic),
      },
      data: req.body,
    });
    res.status(200).json({
      message: "OutPatient Updated Successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating OutPatient: ${error.message}` });
  }
};
