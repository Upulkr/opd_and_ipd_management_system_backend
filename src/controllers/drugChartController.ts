// Import Express types and Prisma Client.
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { get } from "http";

// Initialize Prisma.
const prisma = new PrismaClient();

/**
 * Controller to create a new Drug Chart entry.
 * Defines medication, dose, and frequency for a patient.
 */
export const createDrugChart = async (req: Request, res: Response) => {
  try {
    const { name, nic, bht, dose, frequency, date } = req.body;

    // Validate all required fields.
    if (!name || !nic || !bht || !dose || !frequency || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create new drug chart record.
    const newDrugChart = await prisma.drugChart.create({
      data: {
        name,
        nic,
        bht,
        dose,
        frequency,
        date,
      },
    });
    // Return 201 Created.
    res.status(201).json(newDrugChart);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating DrugChart: ${(error as any).message}` });
  }
};

/**
 * Retrieves all drug charts from the system.
 */
export const getDrugCharts = async (req: Request, res: Response) => {
  try {
    const drugCharts = await prisma.drugChart.findMany();
    res.status(200).json(drugCharts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting DrugChart: ${error.message}` });
  }
};

/**
 * Retrieves a specific drug chart by NIC and BHT.
 */
export const getrelatedDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    // Using findUnique to get a specific chart.
    const drugChart = await prisma.drugChart.findUnique({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(drugChart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting DrugChart: ${error.message}` });
  }
};
/**
 * Retrieves all drug charts for a specific NIC.
 * Note: 'getAllDrugChartByNic' name is slightly misleading as it only filters by 'nic' but accepts 'bht' in params (unused in logic).
 */
export const getAllDrugChartByNic = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const drugChart = await prisma.drugChart.findMany({
      where: {
        nic,
      },
    });
    res.status(200).json(drugChart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting DrugChart: ${error.message}` });
  }
};

/**
 * Deletes a drug chart entry.
 */
export const deleteDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "ID is required." });
    }
    const drugChart = await prisma.drugChart.delete({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(drugChart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting DrugChart: ${error.message}` });
  }
};

/**
 * Updates a drug chart entry.
 * Can update dose, frequency, and date.
 */
export const updateDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "ID is required." });
    }
    const { dose, frequency, date } = req.body;
    const updatedDrugChart = await prisma.drugChart.update({
      where: {
        nic,
        bht: Number(bht),
      },
      data: {
        dose,
        frequency,
        date,
      },
    });
    res.status(200).json(updatedDrugChart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating DrugChart: ${error.message}` });
  }
};
