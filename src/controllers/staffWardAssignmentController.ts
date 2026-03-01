import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates a new Staff Assignment for a Ward.
 * Validates existence of user and checks for duplicate assignments.
 */
export const createStaffAssignment = async (req: Request, res: Response) => {
  try {
    const { registrationId, nic, ward, role } = req.body;

    // Check if the user exists based on registration ID.
    const isUserExists = await prisma.user.findUnique({
      where: {
        registrationNumber: registrationId,
      },
    });
    if (!isUserExists) {
      return res.status(400).json({ error: "User does not exist." });
    }

    // Check if this registration ID is already assigned to a ward.
    const isRegistrationIdExists = await prisma.wardAssignment.findFirst({
      where: {
        registrationId: registrationId,
      },
    });
    if (isRegistrationIdExists) {
      return res.status(400).json({ error: " Already assigned." });
    }

    // Create the new assignment.
    const newStaffAssignment = await prisma.wardAssignment.create({
      data: {
        registrationId: registrationId,
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

/**
 * Updates an existing Staff Assignment by ID.
 * Allows moving staff to a different ward.
 */
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

/**
 * Deletes a Staff Assignment by ID.
 * Removes the staff member from the ward.
 */
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

/**
 * Retrieves all assignments for a specific Registration ID (Staff ID).
 */
export const getStaffAssignmentsByRegisterId = async (
  req: Request,
  res: Response,
) => {
  const { registrationId } = req.params;
  try {
    const staffAssignments = await prisma.wardAssignment.findMany({
      where: {
        registrationId: registrationId,
      },
    });
    res.status(200).json(staffAssignments);
  } catch (error) {
    res.status(500).json({ error: "Error getting StaffAssignments." });
  }
};

/**
 * Retrieves all staff assignments across all wards.
 */
export const getAllStaffAssignments = async (req: Request, res: Response) => {
  try {
    const staffAssignments = await prisma.wardAssignment.findMany();
    res.status(200).json({ staffAssignments });
  } catch (error) {
    res.status(500).json({ error: "Error getting StaffAssignments." });
  }
};

/**
 * Retrieves aggregated counts of staff roles grouped by ward.
 * Uses PostgreSQL FILTER clause to count doctors, nurses, and pharmacists separately per ward.
 */
export const getStaffCountGroupByWard = async (req: Request, res: Response) => {
  try {
    const staffCountGroupByWard = await prisma.$queryRaw`
 SELECT ward, 
       COUNT(*) FILTER (WHERE role = 'doctor') AS "noofdoctors",
       COUNT(*) FILTER (WHERE role = 'nurse') AS "noofnurses",
	        COUNT(*) FILTER (WHERE role = 'pharmacist') AS "noofpharmacist"
FROM public."WardAssignment"
GROUP BY ward;
`;
    console.log("staffCountGroupByWard", staffCountGroupByWard);
    res.status(200).json({ staffCountGroupByWard });
  } catch (error) {
    res.status(500).json({ error: "Error getting StaffAssignments." });
  }
};
