import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);
const prisma = new PrismaClient();

export const createClininc = async (req: Request, res: Response) => {
  try {
    const { name, doctorName, location, sheduledAt } = req.body;
    const isoSheduledAt = new Date(sheduledAt).toISOString();
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
