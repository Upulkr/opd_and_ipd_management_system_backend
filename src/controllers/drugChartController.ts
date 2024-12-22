import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { get } from "http";
const prisma = new PrismaClient();

export const createDrugChart = async (req: Request, res: Response) => {
  try {
    const { name, nic, bht, dose, frequency, date } = req.body;

    if (!name || !nic || !bht || !dose || !frequency || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }
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
    res.status(201).json(newDrugChart);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating DrugChart: ${(error as any).message}` });
  }
};

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

export const getrelatedDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const drugChart = await prisma.drugChart.findUnique({
      where: {
        nic: Number(nic),
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
export const getAllDrugChartByNic = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const drugChart = await prisma.drugChart.findMany({
      where: {
        nic: Number(nic),
      },
    });
    res.status(200).json(drugChart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting DrugChart: ${error.message}` });
  }
};

export const deleteDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "ID is required." });
    }
    const drugChart = await prisma.drugChart.delete({
      where: {
        nic: Number(nic),
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

export const updateDrugChart = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "ID is required." });
    }
    const { dose, frequency, date } = req.body;
    const updatedDrugChart = await prisma.drugChart.update({
      where: {
        nic: Number(nic),
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
