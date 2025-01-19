import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createMObileClinic = async (req: Request, res: Response) => {
  const { clinicId, nic, location, clinicName, sheduledAt } = req.body;
  try {
    const newMobileClinincAssignmnet =
      await prisma.mobileclinicAssignment.create({
        data: { clinicId, nic, location, clinicName, sheduledAt },
      });
    res.status(200).json({
      newMobileClinincAssignmnet,
      message: "MobileClininc created successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: `Error creating mobile clinic:${error}` });
  }
};

export const getAllMobileClinics = async (req: Request, res: Response) => {
  try {
    const mobileClinics = await prisma.mobileclinicAssignment.findMany();
    res.status(200).json(mobileClinics);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMobileClinicAssigment = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const deletedClinicAssigment = await prisma.mobileclinicAssignment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      deletedClinicAssigment,
      message: "Clinic Assigment deleted successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting clinics:${error.message}` });
  }
};

export const updateMobileClinicAssigment = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const updatedClinicAssigment = await prisma.mobileclinicAssignment.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.status(200).json({
      updatedClinicAssigment,
      message: "MobileClinic Assigment updated successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating clinics:${error.message}` });
  }
};

export const getAllMobileClinicAssigmentsForTable = async (
  req: Request,
  res: Response
) => {
  try {
    // Fetch mobileclinic assignments and include only patient name and phone
    const mobileclinicAssigments = await prisma.mobileclinicAssignment.findMany(
      {
        where: {
          sheduledAt: {
            gte: new Date(), // Filter assignments for upcoming dates
          },
        },
        include: {
          patient: {
            select: {
              name: true, // Only select the name field
              phone: true,
              nic: true, // Only select the phone field
            },
          },
        },
      }
    );

    // If needed, filter assignments to only those where patients exist
    const filteredAssignments = mobileclinicAssigments.filter(
      (assignment) => assignment.patient && assignment.patient.nic
    );

    res.status(200).json({
      mobileclinicAssigments: filteredAssignments,
      message: "Mobile Clinic Assigments retrieved successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting clinics: ${error.message}` });
  }
};
