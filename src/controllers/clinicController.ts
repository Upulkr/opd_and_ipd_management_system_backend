import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extending dayjs with timezone and utc plugins to handle date conversions accurately.
dayjs.extend(timezone);
dayjs.extend(utc);

const prisma = new PrismaClient();

/**
 * Controller to create a new Clinic.
 * Handles date conversion to UTC before saving.
 */
export const createClininc = async (req: Request, res: Response) => {
  try {
    const { name, doctorName, location, sheduledAt } = req.body;

    // Standardize the input date string to ISO format.
    const isoSheduledAt = new Date(sheduledAt).toISOString();

    // Convert the local time (Asia/Colombo) to UTC for standardized storage in database.
    const utcSheduledAt = dayjs(isoSheduledAt)
      .tz("Asia/Colombo", true)
      .utc()
      .toDate();

    const newClinic = await prisma.clinic.create({
      data: {
        name,
        doctorName,
        location,
        sheduledAt: utcSheduledAt,
      },
    });
    res
      .status(200)
      .json({ newClinic, message: "Clinic created successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating clinic:${error.message}` });
  }
};

/**
 * Retrieves all clinics.
 * Using raw SQL to select distinct records (though prisma.findMany is usually preferred).
 */
export const getAllClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.$queryRaw`SELECT distinct * 
FROM "clinic" as cl`;
    res
      .status(200)
      .json({ clinics, message: "Clinics retrieved successfully!" });
  } catch (error: any) {
    error
      .status(500)
      .json({ message: `Error getting clinics:${error.message}` });
  }
};

/**
 * Retrieves a single clinic by its ID.
 */
export const getClinicById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const clinic = await prisma.clinic.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ clinic, message: "Clinic retrieved successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: `Error getting clinics:${error.message}` });
  }
};

/**
 * Updates a clinic's details.
 */
export const updateClinic = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedClinic = await prisma.clinic.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res
      .status(200)
      .json({ updatedClinic, message: "Clinic updated successfully!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating clinics:${error.message}` });
  }
};

/**
 * Deletes a clinic by its ID.
 */
export const deleteClinic = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedClinic = await prisma.clinic.delete({
      where: {
        id: Number(id),
      },
    });
    res
      .status(200)
      .json({ deletedClinic, message: "Clinic deleted successfully!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting clinics:${error.message}` });
  }
};
