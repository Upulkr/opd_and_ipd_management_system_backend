import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createLabtest = async (req: Request, res: Response) => {
  try {
    const { nic, bht, testno, date, test, result } = req.body;

    // Validate input
    if (!nic || !bht || !testno || !date || !test || !result) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create the labtest in the database
    const labtest = await prisma.labtest.create({
      data: {
        nic,
        bht,
        testno,
        date,
        test,
        result,
      },
    });

    // Return the created labtest
    res.status(201).json({
      message: "Lab test created successfully!",
      labtest,
    });
  } catch (error: any) {
    console.error("Error creating lab test:", error);
    res.status(500).json({
      error: "An error occurred while creating the lab test.",
      details: error.message,
    });
  }
};

export const getAllLabtests = async (req: Request, res: Response) => {
  try {
    // Fetch all lab tests from the database
    const labtests = await prisma.labtest.findMany();

    // Return the list of lab tests
    res.status(200).json({
      message: "Lab tests fetched successfully!",
      labtests,
    });
  } catch (error: any) {
    console.error("Error getting lab tests:", error);
    res.status(500).json({
      error: "An error occurred while fetching lab tests.",
      details: error.message,
    });
  }
};

export const getAllLabtestByNic = async (req: Request, res: Response) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const labtest = await prisma.labtest.findMany({
      where: {
        nic: Number(nic),
      },
    });
    res
      .status(200)
      .json({ message: "Lab test fetched successfully!", labtest });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting labtest: ${error.message}` });
  }
};
export const getrelatedLabtest = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic && !bht) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const labtest = await prisma.labtest.findUnique({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });
    res
      .status(200)
      .json({ message: "Lab test fetched successfully!", labtest });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting labtest: ${error.message}` });
  }
};

export const deleteLabtest = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    await prisma.labtest.deleteMany({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });
    res.status(200).json({ message: "Lab test deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting labtest: ${(error as any).message}` });
  }
};

export const updateLabtest = async (req: Request, res: Response) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    const { bht, testno, date, test, result } = req.body;
    if (!bht || !testno || !date || !test || !result) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const labtest = await prisma.labtest.updateMany({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
      data: {
        bht,
        testno,
        date: new Date(date),
        test,
        result,
      },
    });
    res.status(200).json({ message: "Lab test updated successfully!" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating labtest: ${error.message}` });
  }
};
