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
          status: {
            equals: "pending",
          },
        },
        include: {
          Patient: {
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
      (assignment) => assignment.Patient && assignment.Patient.nic
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

export const updateMobileClinincCompletedStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { selectedRows } = req.body;

    // Validate that selectedRows is an array
    if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
      return res.status(400).json({
        message: "'selectedRows' must be a non-empty array.",
      });
    }

    // Map over the array and ensure each entry has `nic` and `id`
    const validRows = selectedRows.filter(
      (row) => row.nic && row.id && !isNaN(Number(row.id))
    );

    if (validRows.length === 0) {
      return res.status(400).json({
        message: "'selectedRows' contains invalid data.",
      });
    }

    // Update each record in the database
    const updatePromises = validRows.map((row) =>
      prisma.mobileclinicAssignment.updateMany({
        where: {
          nic: row.nic,
          id: Number(row.id),
        },
        data: {
          status: "completed",
        },
      })
    );

    const updatedMobileClinics = await Promise.all(updatePromises);

    res.status(200).json({
      updatedMobileClinics,
      message: "Mobile clinics updated successfully!",
    });
  } catch (error: any) {
    console.error("Error updating mobile clinics:", error);
    res
      .status(500)
      .json({ message: `Error updating mobile clinics: ${error.message}` });
  }
};
