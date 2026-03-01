import { DrugAllocation } from ".prisma/client";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client for database interaction.
const prisma = new PrismaClient();

/**
 * Controller to add a new drug to the inventory.
 */
export const addNewDrug = async (req: Request, res: Response) => {
  try {
    const { drugName, unit, totalQuantity, expiryDate, remainingQuantity } =
      req.body;

    // Validate required fields.
    if (!drugName || !unit || !totalQuantity || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if drug already exists by name.
    const checkIfDrugExists = await prisma.drugs.findFirst({
      where: {
        drugName,
      },
    });

    if (checkIfDrugExists) {
      // Suggest including expiry date in name for uniqueness if it's the same drug batch.
      return res
        .status(400)
        .json({
          message:
            "Drug already exists, add expire date to the medicine and resubmi. ex Insulin_05jun25 ",
        });
    }

    // Create the new drug record.
    const newDrug = await prisma.drugs.create({
      data: {
        drugName,
        unit,
        totalQuantity,
        expiryDate,
      },
    });
    res.status(200).json({ newDrug, message: "Drug added successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: `Error adding Drug: ${error.message}` });
  }
};

/**
 * Retrieves all drugs from the inventory.
 */
export const getAllDrugs = async (req: Request, res: Response) => {
  try {
    const drugs = await prisma.drugs.findMany();
    res.status(200).json({ drugs });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Deletes a drug from the inventory.
 */
export const deleteDrug = async (req: Request, res: Response) => {
  const { drugId } = req.params;
  try {
    const deletedDrug = await prisma.drugs.delete({
      where: {
        drugId: Number(drugId),
      },
    });
    res.status(200).json(deletedDrug);
  } catch (error: any) {
    res.status(500).json({ message: `Error deleting Drug: ${error.message}` });
  }
};

/**
 * Updates an existing drug's details.
 */
export const updateDrug = async (req: Request, res: Response) => {
  try {
    const { drugId } = req.params;
    console.log("drugId", drugId);

    if (!drugId) {
      return res.status(400).json({ error: "Drug ID is required." });
    }

    // Check if the drug exists before attempting update.
    const checkIfDrugExists = await prisma.drugs.findUnique({
      where: {
        drugId: Number(drugId),
      },
    });

    if (!checkIfDrugExists) {
      return res.status(400).json({ message: "Drug not found" });
    }

    // Perform the update.
    const updatedDrug = await prisma.drugs.update({
      where: {
        drugId: Number(drugId),
      },
      data: req.body,
    });
    res
      .status(200)
      .json({ message: "Drug updated successfully!", updatedDrug });
  } catch (error: any) {
    res.status(500).json({ message: `Error updating Drug: ${error.message}` });
  }
};

/**
 * Retrieves a single drug by its ID.
 */
export const getDrugById = async (req: Request, res: Response) => {
  const { drugId } = req.params;
  try {
    const drug = await prisma.drugs.findUnique({
      where: {
        drugId: Number(drugId),
      },
    });
    res.status(200).json(drug);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Creates a new drug allocation for a ward.
 * Handles inventory deduction from the main store and addition/update to the ward's allocation.
 */
export const createNewDrugAllocation = async (req: Request, res: Response) => {
  try {
    const {
      drugId,

      drugName,
      wardName,
      totalQuantity,
      usedQuantity,
      unit,
      dateGiven,
    } = req.body;

    // Validate inputs.
    if (!drugId || !drugName || !wardName || !totalQuantity) {
      return res.status(400).json({
        message:
          "Missing required fields: drugId, drugName, wardName, or totalQuantity.",
      });
    }

    // Check if there is already an allocation record for this drug in this ward.
    const existingAllocation = await prisma.drugAllocation.findFirst({
      where: {
        drugId,
        wardName,
      },
    });

    if (existingAllocation) {
      // Update existing allocation: increase quantity.
      const updatedAllocation = await prisma.drugAllocation.update({
        where: {
          id: existingAllocation.id,
        },
        data: {
          totalQuantity: {
            increment: Number(totalQuantity),
          },
        },
      });

      // Update main drug inventory: decrement total quantity and increment used quantity (distributed).
      await prisma.drugs.update({
        where: {
          drugId: Number(drugId),
        },
        data: {
          totalQuantity: {
            decrement: Number(totalQuantity),
          },
          usedQuantity: {
            increment: Number(totalQuantity),
          },
        },
      });
      return res.status(200).json({
        updatedAllocation,
        message: "Drug Allocation updated successfully!",
      });
    }

    // Create new allocation record if none exists for this ward/drug.
    const newDrugAllocation = await prisma.drugAllocation.create({
      data: {
        drugId,
        drugName,
        wardName,
        totalQuantity: Number(totalQuantity),
        usedQuantity,
        unit,
        dateGiven,
      },
    });

    // Update main inventory.
    await prisma.drugs.update({
      where: {
        drugId: Number(drugId),
      },
      data: {
        totalQuantity: {
          decrement: Number(totalQuantity),
        },
        usedQuantity: {
          increment: Number(totalQuantity),
        },
      },
    });
    res.status(200).json({
      newDrugAllocation,
      message: "Drug Allocation added successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error adding Drug Allocation: ${error.message}` });
  }
};

/**
 * Retrieves all drug allocations for a specific ward.
 */
export const getDrugAllocationbyWardName = async (
  req: Request,
  res: Response,
) => {
  try {
    const { wardName } = req.params;
    const allocations = await prisma.drugAllocation.findMany({
      where: {
        wardName,
      },
    });
    res.status(200).json({
      allocations,
      message: "Drug Allocations retrieved succssfulley",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting Drug Allocations: ${error.message}` });
  }
};
