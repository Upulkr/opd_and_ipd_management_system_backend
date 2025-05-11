import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const createDisasePrediction = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing." });
    }
    const { nic, disease, prediction } = req.body;

    const newDisasePrediction = await prisma.diseasePrediction.create({
      data: {
        nic,
        disease,
        prediction,
      },
    });
    res.status(200).json({
      newDisasePrediction,
      message: "Disase Prediction created successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Error saving Disase Prediction." });
  }
};

export const getDiseasePredictionByNic = async (
  req: Request,
  res: Response
) => {
  const { nic } = req.params;
  try {
    const disasePrediction = await prisma.diseasePrediction.findMany({
      where: {
        nic: String(nic),
      },
    });
    if (!disasePrediction) {
      return res.status(404).json({ error: "Disase Prediction not found." });
    }
    res.status(200).json(disasePrediction);
  } catch (error) {
    res.status(500).json({ error: "Error getting Disase Prediction." });
  }
};

export const updateDiseasePredictionByNic = async (
  req: Request,
  res: Response
) => {
  const { nic, id } = req.params;
  if (!nic) {
    return res.status(400).json({ error: "NIC is required." });
  }
  try {
    const updatedDisasePrediction = await prisma.diseasePrediction.update({
      where: {
        id: Number(id),
        nic: String(nic),
      },
      data: req.body,
    });
    res.status(200).json({
      updatedDisasePrediction,
      message: "Disase Prediction updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Disase Prediction." });
  }
};

export const deleteDiseasePredictionByNic = async (
  req: Request,
  res: Response
) => {
  const { nic, id } = req.params;
  if (!nic) {
    return res.status(400).json({ error: "NIC is required." });
  }
  try {
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
