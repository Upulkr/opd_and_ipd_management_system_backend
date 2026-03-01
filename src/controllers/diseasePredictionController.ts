import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

// Initialize Prisma Client for database interactions.
// This allows us to query the 'diseasePrediction' table.
const prisma = new PrismaClient();

/**
 * Creates a new disease prediction record.
 * Validates the request body and saves the prediction details (NIC, disease, prediction) to the database.
 */
/**
 * Creates a new disease prediction record.
 * Validates the request body and saves the prediction details (NIC, disease, prediction) to the database.
 */
export const createDisasePrediction = async (req: Request, res: Response) => {
  try {
    // Validate request body existence.
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing." });
    }
    const { nic, disease, prediction } = req.body;

    // Create a new record in the diseasePrediction table.
    const newDisasePrediction = await prisma.diseasePrediction.create({
      data: {
        nic,
        disease,
        prediction,
      },
    });

    // Respond with created record and success message.
    res.status(200).json({
      newDisasePrediction,
      message: "Disase Prediction created successfully!",
    });
  } catch (error) {
    // Return 500 Internal Server Error if database op fails.
    res.status(500).json({ error: "Error saving Disase Prediction." });
  }
};

/**
 * Retrieves all disease prediction records for a specific NIC.
 * Fetches data from the database based on the provided NIC parameter.
 */
/**
 * Retrieves all disease prediction records for a specific NIC.
 * Fetches data from the database based on the provided NIC parameter.
 */
export const getDiseasePredictionByNic = async (
  req: Request,
  res: Response,
) => {
  const { nic } = req.params;
  try {
    // Find all predictions associated with the given NIC.
    const disasePrediction = await prisma.diseasePrediction.findMany({
      where: {
        nic: String(nic),
      },
    });

    // Check if any records were found.
    // Note: findMany returns an empty array if no records found, so this check will only be true if 'disasePrediction' is null/undefined, which is rare for findMany.
    // If you want to check for empty array, perform: if (disasePrediction.length === 0)
    if (!disasePrediction) {
      return res.status(404).json({ error: "Disase Prediction not found." });
    }

    res.status(200).json(disasePrediction);
  } catch (error) {
    res.status(500).json({ error: "Error getting Disase Prediction." });
  }
};

/**
 * Updates an existing disease prediction record.
 * Requires both NIC and record ID to identify the record to update.
 */
/**
 * Updates an existing disease prediction record.
 * Requires both NIC and record ID to identify the record to update.
 */
export const updateDiseasePredictionByNic = async (
  req: Request,
  res: Response,
) => {
  const { nic, id } = req.params;

  // Validate NIC parameter.
  if (!nic) {
    return res.status(400).json({ error: "NIC is required." });
  }
  try {
    // Update the specific record identified by ID and NIC.
    const updatedDisasePrediction = await prisma.diseasePrediction.update({
      where: {
        id: Number(id),
        nic: String(nic),
      },
      data: req.body, // Update with data from request body.
    });

    res.status(200).json({
      updatedDisasePrediction,
      message: "Disase Prediction updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Disase Prediction." });
  }
};

/**
 * Deletes a disease prediction record.
 * Requires both NIC and record ID to identify the record to delete.
 */
/**
 * Deletes a disease prediction record.
 * Requires both NIC and record ID to identify the record to delete.
 */
export const deleteDiseasePredictionByNic = async (
  req: Request,
  res: Response,
) => {
  const { nic, id } = req.params;

  // Validate NIC parameter.
  if (!nic) {
    return res.status(400).json({ error: "NIC is required." });
  }
  try {
    // Delete the specific record identified by ID and NIC.
    const deletedDisasePrediction = await prisma.diseasePrediction.delete({
      where: {
        nic: String(nic),
        id: Number(id),
      },
    });

    res.status(200).json({
      deletedDisasePrediction,
      message: "Disase Prediction deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting Disase Prediction." });
  }
};
