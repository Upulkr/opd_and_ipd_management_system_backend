import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addNewDrug = async (req: Request, res: Response) => {
  try {
    const { drugName, unit, totalQuantity, expiryDate, remainingQuantity } =
      req.body;

    if (!drugName || !unit || !totalQuantity || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const checkIfDrugExists = await prisma.drugs.findFirst({
      where: {
        drugName,
      },
    });

    if (checkIfDrugExists) {
      return res.status(400).json({ message: "Drug already exists" });
    }

    const newDrug = await prisma.drugs.create({
      data: {
        drugName,
        unit,
        totalQuantity,
        expiryDate,
        remainingQuantity: totalQuantity,
      },
    });
    res.status(200).json({ newDrug, message: "Drug added successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: `Error adding Drug: ${error.message}` });
  }
};

export const getAllDrugs = async (req: Request, res: Response) => {
  try {
    const drugs = await prisma.drugs.findMany();
    res.status(200).json({ drugs });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

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

export const updateDrug = async (req: Request, res: Response) => {
  try {
    const { drugId } = req.params;
    console.log("drugId", drugId);
    if (!drugId) {
      return res.status(400).json({ error: "Drug ID is required." });
    }
    const checkIfDrugExists = await prisma.drugs.findUnique({
      where: {
        drugId: Number(drugId),
      },
    });

    if (!checkIfDrugExists) {
      return res.status(400).json({ message: "Drug not found" });
    }
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
