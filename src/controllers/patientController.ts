import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

// Initialize Prisma Client for database operations.
const prisma = new PrismaClient();

/**
 * Creates a new patient record in the database.
 * Ensures the patient does not already exist by checking the NIC.
 */
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
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      livingStatus,
    } = req.body;

    // Check if a patient with the given NIC already exists.
    const patient = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });
    if (patient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    // Create a new patient record.
    const newPatient = await prisma.patient.create({
      data: {
        nic,
        age,
        name,
        gender,
        livingStatus,
        phone,
        reason,
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
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

/**
 * Retrieves all patients from the database.
 */
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
/**
 * Retrieves a single patient by their NIC.
 */
export const getPatientByNic = async (req: Request, res: Response) => {
  const { nic } = req.params;

  try {
    const Patient = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });

    if (!Patient) {
      // Respond with a 404 if the patient is not found.
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient fetched successfully!", Patient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Patient: ${error.message}` });
  }
};

/**
 * Deletes a patient record by NIC.
 */
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

/**
 * Updates an existing patient's information.
 */
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

/**
 * Checks if a patient with a specific NIC exists.
 * Returns a boolean indicating existence.
 */
export const isPatientExist = async (req: Request, res: Response) => {
  const { nic } = req.params;
  if (!nic) {
    return res.status(400).json({ error: "NIC is required." });
  }
  try {
    const patient = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });
    if (!patient) {
      return res.json({ message: "Patient not found.", patientExist: false });
    }
    return res
      .status(200)
      .json({ message: "Patient found.", patientExist: true });
  } catch (error: any) {
    res.status(500).json({ error: "Error checking Patient existence." });
  }
};
