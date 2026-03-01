// Import necessary Express types.
import { Request, Response } from "express";
// Import PrismaClient for database operations.
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client for database connectivity.
const prisma = new PrismaClient();

/**
 * Creates a new admission sheet.
 * Expects admission details in the request body.
 */
/**
 * Controller to create a new Admission Sheet.
 * This handles the initial data entry for a patient's admission.
 */
export const createAdmissionSheet = async (req: Request, res: Response) => {
  try {
    // Destructuring all necessary fields from the request body.
    const {
      nic,
      name,
      age,
      gender,
      phone,
      wardNo,
      reason,
      pressure,
      weight,
      bht,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      livingStatus,
    } = req.body;

    // Persisting the new Admission Sheet to the database.
    // We map the request body fields to the 'admissionSheet' table columns.
    const newAdmissionSheet = await prisma.admissionSheet.create({
      data: {
        nic,
        name,
        age,
        gender,
        phone,
        wardNo,
        reason,
        pressure,
        weight,
        bht: Number(bht), // Explicitly casting BHT to a number type.
        streetAddress,
        city,
        stateProvince,
        postalCode,
        country,
        livingStatus,
      },
    });

    // Successfully created resource, return 201 Created status.
    res.status(201).json({
      message: "AdmissionSheet Created Successfully",
      newAdmissionSheet,
    });
  } catch (error) {
    // Internal Server Error handling.
    res.status(500).json({
      message: `Error creating AdmissionSheet:  ${(error as any).message}`,
    });
  }
};

/**
 * Updates an existing admission sheet.
 * Identifies the record by NIC and BHT provided in the request body.
 */
/**
 * Controller to update an existing Admission Sheet.
 * Identified by the composite key of NIC and BHT.
 */
export const updateAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const {
      nic,
      name,
      age,
      gender,
      bht,
      phone,
      wardNo,
      reason,
      pressure,
      weight,
      livingStatus,
    } = req.body;

    // Updating the record using 'prisma.update'.
    // The 'where' clause specifies the unique identifier (or unique constraint) to find the record.
    const updatedAdmissionSheet = await prisma.admissionSheet.update({
      where: {
        nic: nic,
        bht: Number(bht),
      },
      data: {
        age,
        name,
        gender,
        phone,
        wardNo,
        reason,
        pressure,
        weight,
        livingStatus,
      },
    });

    // Respond with 200 OK and the updated object.
    res.status(200).json({
      message: "AdmissionSheet Updated Successfully",
      updatedAdmissionSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error updating AdmissionSheet ${(error as any).message}`,
    });
  }
};

/**
 * Retrieves all admission sheets from the database.
 */
/**
 * Controller to retrieve all Admission Sheets.
 */
export const getAdmissionSheets = async (req: Request, res: Response) => {
  try {
    // Fetching all admission sheets.
    const admissionSheets = await prisma.admissionSheet.findMany();
    // Returning the list as JSON.
    res.json(admissionSheets);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving admissionSheets: ${error.message}` });
  }
};

/**
 * Deletes an admission sheet.
 * Requires 'nic' and 'bht' as route parameters.
 */
/**
 * Controller to delete an Admission Sheet.
 * Expects 'nic' and 'bht' in the URL parameters.
 */
export const deleteAdmissionSheet = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;

    // Basic validation for required params.
    if (!nic) {
      return res.status(400).json({ message: "nic is required" });
    }

    // Performing the delete operation.
    const deletedAdmissionSheet = await prisma.admissionSheet.delete({
      where: {
        nic,
        bht: Number(bht),
      },
    });

    res.status(200).json({
      message: "AdmissionSheet Deleted Successfully",
      deletedAdmissionSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error deleting AdmissionSheet: ${(error as any).message}`,
    });
  }
};

/**
 * Retrieves all admission sheets associated with a specific NIC.
 * Requires 'nic' as a route parameter.
 */
/**
 * Controller to get all Admission Sheets for a specific patient (by NIC).
 */
export const getAllAdmissionSheetByNic = async (
  req: Request,
  res: Response,
) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ message: "nic is required" });
    }
    // Finding all sheets associated with the provided NIC.
    const admissionSheet = await prisma.admissionSheet.findMany({
      where: {
        nic,
      },
    });
    res.status(200).json(admissionSheet);
  } catch (error) {
    res.status(500).json({
      message: `Error getting AdmissionSheet: ${(error as any).message}`,
    });
  }
};

/**
 * Retrieves a specific admission sheet by BHT (Bed Head Ticket).
 * Requires 'bht' as a query parameter.
 */
/**
 * Controller to get a specific Admission Sheet by BHT.
 */
export const getrelatedAdmissionSheetByBht = async (
  req: Request,
  res: Response,
) => {
  try {
    const { bht } = req.query;

    if (!bht) {
      return res.status(400).json({ message: "BHT is required" });
    }

    // Using findUnique to retrieve the specific record.
    const admissionSheet = await prisma.admissionSheet.findUnique({
      where: {
        bht: Number(bht),
      },
    });

    if (!admissionSheet) {
      return res
        .status(404)
        .json({ message: "No admission sheet found for the given BHT" });
    }

    res.status(200).json({ admissionSheet });
  } catch (error) {
    console.error("Error fetching admission sheet:", error);
    res.status(500).json({
      message: `Error getting admission sheet: ${(error as any).message}`,
    });
  }
};

/**
 * Calculates the total number of admission sheets created in the current year.
 * Uses a raw SQL query for performance.
 */
/**
 * Controller to count total Admission Sheets created in the current YEAR.
 * Uses Prisma's raw query feature ($queryRaw) for database-specific SQL functions.
 */
export const getNumberOfAdmissionSheetsperYear = async (
  req: Request,
  res: Response,
) => {
  try {
    // SQL Query to count records matching current year.
    // 'EXTRACT(YEAR FROM ...)' collects the year part of the date.
    const result = await prisma.$queryRaw`
      SELECT count(name) 
      FROM "AdmissionSheet"
      WHERE EXTRACT(YEAR FROM "createdAt") = EXTRACT(YEAR FROM CURRENT_DATE);
    `;

    // Extract count from the result.
    // BigInt return types need to be converted to strings for JSON serialization.
    const NoOfAdmissionSheetsPerYear = (
      result as { count: bigint }[]
    )[0]?.count.toString();

    res.status(200).json({ NoOfAdmissionSheetsPerYear });
  } catch (error) {
    res.status(500).json({
      message: `Error getting number of admission sheets per year: ${
        (error as any).message
      }`,
    });
  }
};

/**
 * Calculates the total number of admission sheets created today.
 * Uses a raw SQL query.
 */
/**
 * Controller to count total Admission Sheets created TODAY.
 * Uses raw SQL to truncate dates to day level comparison.
 */
export const getNumberOfAdmissionSheetsperDay = async (
  req: Request,
  res: Response,
) => {
  try {
    // SQL Query to count records matching current date.
    // DATE_TRUNC('day', ...) resets time to 00:00:00 for comparison.
    const result = await prisma.$queryRaw`SELECT count(name)
FROM "AdmissionSheet"
WHERE DATE_TRUNC('day', "createdAt") =CURRENT_DATE;`;

    // Convert BigInt result to string.
    const NoOfAdmissionSheetsPerDay = (
      result as { count: bigint }[]
    )[0]?.count.toString();
    res.status(200).json({ NoOfAdmissionSheetsPerDay });
  } catch (error) {
    res.status(500).json({
      message: `Error getting number of admission sheets per year: ${
        (error as any).message
      }`,
    });
  }
};

/**
 * Checks if an admission sheet exists for a given BHT.
 * Requires 'bht' as a route parameter.
 * Returns boolean true if exists, or error/404 if not.
 */
/**
 * Check if a BHT exists in the Admission Sheets.
 * Used for validation (e.g., ensuring unique BHTs or verifying existence before other ops).
 */
export const checkBHTisExists = async (req: Request, res: Response) => {
  try {
    const { bht } = req.params;
    if (!bht) {
      return res.status(400).json({ message: "BHT is required" });
    }
    // Attempt to find the record.
    const admissionSheet = await prisma.admissionSheet.findUnique({
      where: {
        bht: Number(bht),
      },
    });
    // If not found, return 404.
    if (!admissionSheet) {
      return res
        .status(404)
        .json({ message: "No admission sheet found for the given BHT" });
    }
    // If found, return true (200 OK).
    res.status(200).json(true);
  } catch (error) {
    console.error("Error fetching admission sheet:", error);
    res.status(500).json({
      message: `Error getting admission sheet: ${(error as any).message}`,
    });
  }
};
