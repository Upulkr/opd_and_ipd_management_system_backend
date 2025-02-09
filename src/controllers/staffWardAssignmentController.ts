import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createStaffAssignment = async (req: Request, res: Response) => {
  let newStaffAssignment;
  try {
    const { registrationId, nic, ward } = req.body;
    newStaffAssignment = await prisma.wardAssignment.create({
      data: {
        registrationId,
        nic,
        ward,
      },
    });
    res.status(201).json({
      message: "newStaffAssignment Created Successfully",
      newStaffAssignment,
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving newStaffAssignment." });
  }
};

export const updateStaffAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedStaffAssignment = await prisma.wardAssignment.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.status(200).json(updatedStaffAssignment);
  } catch (error) {
    res.status(500).json({ error: "Error updating StaffAssignment." });
  }
};

export const deleteStaffAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
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
