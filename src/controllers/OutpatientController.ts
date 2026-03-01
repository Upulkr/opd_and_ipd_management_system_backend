import { isPatientExist } from "./patientController";
// Import Express types for TypeScript support in Request and Response objects.
import { Request, Response } from "express";
// Import PrismaClient for database interactions.
import { PrismaClient } from "@prisma/client";

// Initialize the Prisma Client instance.
// This instance manages the database connection and provides an interface to query the database.
const prisma = new PrismaClient();

/**
 * Controller to create a new OutPatient record.
 * Handles validation, existence checks, and database insertion.
 */
export const createOutPatient = async (req: Request, res: Response) => {
  try {
    // Destructuring the request body to extract patient details.
    const {
      nic,
      name,
      age,
      gender,
      livingStatus,
      phone,
      description,
      reason,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      prescriptions,
    } = req.body;
    console.log("req.body", req.body);

    // Validation: Check if NIC is provided.
    if (!nic) {
      return res.status(400).json({ message: "NIC is required" });
    }

    // Check if the patient is already registered in the system (master patient table).
    // querying the 'patient' model by NIC.
    const isPatientExistResult = await prisma.patient.findUnique({
      where: {
        nic: nic,
      },
    });

    // If patient is not registered, deny outpatient creation.
    if (!isPatientExistResult) {
      return res
        .status(400)
        .json({ message: "Patient does not exist , please register first" });
    }

    // Create a new OutPatient record in the 'outPatientFrom' table.
    // Note: 'outPatientFrom' matches the schema definition, although it appears to be a typo (likely intended 'outPatientForm').
    const newOutPatient = await prisma.outPatientFrom.create({
      data: {
        nic,
        name,
        age,
        gender,
        prescriptions,
        phone,
        description,
        reason,
        city,
        stateProvince,
        postalCode,
        country,
        streetAddress,
        livingStatus: "active", // Setting default status to 'active'.
      },
    });

    // Send a 201 Created response.
    res.status(201).json({
      message: "OutPatient Created Successfully",
      newOutPatient,
    });
  } catch (error: any) {
    // Handle any errors during the process.
    res.status(400).json({ message: error.message });
  }
};

/**
 * Controller to retrieve all OutPatient records.
 */
export const getAllOutPatients = async (req: Request, res: Response) => {
  try {
    // Fetch all records from 'outPatientFrom' table.
    const outPatients = await prisma.outPatientFrom.findMany();

    // If no records found, return 404 Not Found.
    if (!outPatients.length) {
      return res.status(404).json({ message: "No OutPatients found." });
    }
    console.log("outPatients", outPatients);
    // Return the list of outpatients with 200 OK.
    res.status(200).json(outPatients);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * Controller to retrieve OutPatient records created TODAY.
 * Useful for daily operational views.
 */
export const getAllOutPatientsToday = async (req: Request, res: Response) => {
  try {
    // Define the time range for "Today".
    // Start of day: 00:00:00.000
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // End of day: 23:59:59.999
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Filter records where 'createdAt' is within the start and end of the current day.
    const outPatientsToday = await prisma.outPatientFrom.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if empty.
    if (!outPatientsToday.length) {
      return res.status(404).json({ message: "No OutPatients found." });
    }
    console.log("outPatientsToday", outPatientsToday);
    res.status(200).json(outPatientsToday);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
/**
 * Controller to get the count of OutPatients created today.
 */
export const getNumberOfOutPatientsToday = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count records where 'createdAt' is between start and end of today.
    const outPatientsTodayCount = await prisma.outPatientFrom.count({
      where: {
        createdAt: {
          gte: startOfDay, // Greater than or equal to start of day
          lte: endOfDay, // Less than or equal to end of day
        },
      },
    });

    res.status(200).json(outPatientsTodayCount);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Controller to get OutPatient history for a specific NIC.
 * Ordered by most recent updates.
 */
export const getOutPatientByNic = async (req: Request, res: Response) => {
  try {
    const { nic } = req.params;
    // Validate param.
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }

    // Fetch all outpatient visits for this NIC.
    const outPatient = await prisma.outPatientFrom.findMany({
      where: {
        nic: nic,
      },
      orderBy: {
        updatedAt: "desc", // Sort by latest update first.
      },
    });

    if (!outPatient.length) {
      return res.status(404).json({ message: "OutPatient not found." });
    }

    res
      .status(200)
      .json({ message: "OutPatient fetched successfully!", outPatient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting OutPatient: ${error.message}` });
  }
};

/**
 * Controller to get staff members assigned to 'Outpatient' ward.
 */
export const getStaffMemebers = async (req: Request, res: Response) => {
  try {
    // Query 'wardAssignment' table for staff in 'Outpatient'.
    const staffOutPatient = await prisma.wardAssignment.findMany({
      where: {
        ward: "Outpatient",
      },
    });
    // Handle case where no staff is found.
    if (!staffOutPatient.length) {
      return res.status(404).json({ message: "staffOutPatient not found." });
    }
    res.status(200).json({
      message: "staffOutPatient fetched successfully!",
      staffOutPatient,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting OutPatient: ${error.message}` });
  }
};
// export const updateOutPatient = async (req: Request, res: Response) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       return res.status(400).json({ error: "NIC is required." });
//     }
//     const updatedOutPatient = await prisma.outPatientFrom.update({
//       where: {
//         nic,
//       },
//       data: req.body,
//     });
//     res
//       .status(200)
//       .json({ message: "OutPatient updated successfully!", updatedOutPatient });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error updating OutPatient: ${error.message}` });
//   }
// };

// export const deleteOutPatient = async (req: Request, res: Response) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       return res.status(400).json({ error: "NIC is required." });
//     }
//     const deletedOutPatient = await prisma.outPatientFrom.delete({
//       where: {
//         nic,
//       },
//     });
//     res
//       .status(200)
//       .json({ message: "OutPatient deleted successfully!", deletedOutPatient });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error deleting OutPatient: ${error.message}` });
//   }
// };
