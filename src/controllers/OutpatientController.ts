import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createPatient = async (req: Request, res: Response) => {
  try {
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

    const patient = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });
    if (patient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const newPatient = await prisma.patient.create({
      data: {
        nic,
        age,
        name,
        gender,
        address,
        phone,
        reason,
      },
    });

    res
      .status(200)
      .json({ message: "Patient Created Successfully", newPatient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating Patient: ${error.message}` });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const Patients = await prisma.patient.findMany();
    res
      .status(200)
      .json({ message: "Patients fetched successfully!", Patients });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Patients: ${error.message}` });
  }
};
export const getPatientByNic = async (req: Request, res: Response) => {
  const { nic } = req.params;

  try {
    const Patient = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });

    if (!Patient) {
      // Respond with a 404 if the patient is not found
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient fetched successfully!", Patient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Patient: ${error.message}` });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const deletedPatient = await prisma.patient.delete({
      where: {
        nic,
      },
    });
    res.status(200).json({
      message: "Patient Deleted Successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting Patient: ${error.message}` });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    const updatedPatient = await prisma.patient.update({
      where: {
        nic,
      },
      data: req.body,
    });
    res.status(200).json({
      message: "Patient Updated Successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating Patient: ${error.message}` });
  }
};
