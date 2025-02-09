import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createStaffAssignment = async (req: Request, res: Response) => {
  try {
    const { registrationId, nic, ward, role } = req.body.staff[0];
    console.log("registrationId", registrationId);
    const isRegistrationIdExists = await prisma.wardAssignment.findFirst({
      where: {
        registrationId: Number(registrationId),
      },
    });
    if (isRegistrationIdExists) {
      return res.status(400).json({ error: " Already assigned." });
    }
    const newStaffAssignment = await prisma.wardAssignment.create({
      data: {
        registrationId: Number(registrationId),
        nic,
        ward,
        role,
      },
    });
    res.status(200).json({
      message: "newStaffAssignment Created Successfully",
      newStaffAssignment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStaffAssignment = async (req: Request, res: Response) => {
  const { staffId: id } = req.params;

  if (!id) return res.status(400).json({ error: "Id is required." });
  const { ward } = req.body;
  try {
    const updatedStaffAssignment = await prisma.wardAssignment.update({
      where: {
        id: Number(id),
      },
      data: { ward, id: Number(id) },
    });
    res.status(200).json(updatedStaffAssignment);
  } catch (error) {
    res.status(500).json({ error: "Error updating StaffAssignment." });
  }
};

export const deleteStaffAssignment = async (req: Request, res: Response) => {
  const { staffId: id } = req.params;
  try {
    const deletedStaffAssignment = await prisma.wardAssignment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletedStaffAssignment);
  } catch (error) {
    res.status(500).json({ error: "Error deleting StaffAssignment." });
  }
};

export const getStaffAssignmentsByRegisterId = async (
  req: Request,
  res: Response
) => {
  const { registrationId } = req.params;
  try {
    const staffAssignments = await prisma.wardAssignment.findMany({
      where: {
        registrationId: Number(registrationId),
      },
    });
    res.status(200).json(staffAssignments);
  } catch (error) {
    res.status(500).json({ error: "Error getting StaffAssignments." });
  }
};

export const getAllStaffAssignments = async (req: Request, res: Response) => {
  try {
    const staffAssignments = await prisma.wardAssignment.findMany();
    res.status(200).json({ staffAssignments });
  } catch (error) {
    res.status(500).json({ error: "Error getting StaffAssignments." });
  }
};
