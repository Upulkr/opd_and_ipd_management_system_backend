import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOutPatient = async (req: Request, res: Response) => {
  try {
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

    const checkNIC = await prisma.patient.findUnique({
      where: {
        nic,
      },
    });

    if (!checkNIC) {
      console.log("NIC is not available");
      return res.status(400).json({ message: "NIC is not available" });
    }
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
        livingStatus: "active", // or any default value
      },
    });

    res.status(201).json({
      message: "OutPatient Created Successfully",
      newOutPatient,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllOutPatients = async (req: Request, res: Response) => {
  try {
    const outPatients = await prisma.outPatientFrom.findMany();
    if (!outPatients.length) {
      return res.status(404).json({ message: "No OutPatients found." });
    }
    console.log("outPatients", outPatients);
    res.status(200).json(outPatients);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const getAllOutPatientsToday = async (req: Request, res: Response) => {
  try {
    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const outPatientsToday = await prisma.outPatientFrom.findMany();
    if (!outPatientsToday.length) {
      return res.status(404).json({ message: "No OutPatients found." });
    }
    console.log("outPatientsToday", outPatientsToday);
    res.status(200).json(outPatientsToday);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const getNumberOfOutPatientsToday = async (
  req: Request,
  res: Response
) => {
  try {
    // Get the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const outPatientsTodayCount = await prisma.outPatientFrom.count({
      where: {
        createdAt: {
          gte: startOfDay, // Greater than or equal to the start of the day
          lte: endOfDay, // Less than or equal to the end of the day
        },
      },
    });

    res.status(200).json(outPatientsTodayCount);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOutPatientByNic = async (req: Request, res: Response) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }

    const outPatient = await prisma.outPatientFrom.findMany({
      where: {
        nic: nic,
      },
      orderBy: {
        updatedAt: "desc",
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

export const getStaffMemebers = async (req: Request, res: Response) => {
  try {
    const staffOutPatient = await prisma.wardAssignment.findMany({
      where: {
        ward: "Outpatient",
      },
    });
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
