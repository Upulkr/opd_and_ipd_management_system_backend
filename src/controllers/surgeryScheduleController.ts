import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createSurgerySchedule = async (req: Request, res: Response) => {
  try {
    const {
      PatientNic,
      patientName,
      surgeryName,
      ScheduledDate,
      PatientPhonenUmber,
    } = req.body;
    if (
      !PatientNic ||
      !patientName ||
      !ScheduledDate ||
      !PatientPhonenUmber ||
      !surgeryName
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const isoSheduledAt = new Date(ScheduledDate).toISOString();
    const utcSheduledAt = dayjs(isoSheduledAt)
      .tz("Asia/Colombo", true)
      .utc()
      .toDate();
    const checkPatientRegistered = await prisma.patient.findUnique({
      where: {
        nic: String(PatientNic),
      },
    });
    if (!checkPatientRegistered) {
      return res.status(404).json({
        message: "Patient not registered",
      });
    }

    // Check if the patient is already scheduled for surgery on the same date
    const existingSurgery = await prisma.surgery.findFirst({
      where: {
        PatientNic: String(PatientNic),
        ScheduledDate: utcSheduledAt,
      },
    });
    if (existingSurgery) {
      console.log("Patient is already scheduled for surgery on the same date");
      return res.status(400).json({
        message: "Patient is already scheduled for surgery on the same date",
      });
    }

    if (checkPatientRegistered) {
      const surgerySchedule = await prisma.surgery.create({
        data: {
          ...req.body,
          ScheduledDate: utcSheduledAt,
          PatientNic: String(req.body.PatientNic),
        },
      });
      res.status(200).json(surgerySchedule);
    }
  } catch (error) {
    res.status(500).json({
      message: `Error creating Surgery Schedule: ${(error as any).message}`,
    });
  }
};

export const updateSurgerySchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Validate request body
    if (!id) {
      return res.status(400).json({
        message: "Id is required.",
      });
    }
    const {
      PatientNic,
      patientName,
      surgeryName,
      ScheduledDate,
      PatientPhonenUmber,
    } = req.body;
    if (
      !PatientNic ||
      !patientName ||
      !ScheduledDate ||
      !PatientPhonenUmber ||
      !surgeryName
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    // Check if surgery schedule exists
    const existingSurgery = await prisma.surgery.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingSurgery) {
      return res.status(404).json({
        message: "Surgery schedule not found",
      });
    }

    // If request includes a NIC and it's different, verify that patient exists
    // if (req.body.nic && req.body.nic !== existingSurgery.PatientNic) {
    //   const checkPatientRegistered = await prisma.patient.findUnique({
    //     where: {
    //       nic: req.body.nic,
    //     },
    //   });

    //   if (!checkPatientRegistered) {
    //     return res.status(404).json({
    //       message: "Patient not registered",
    //     });
    //   }
    // }

    // Update the surgery schedule
    const isoSheduledAt = new Date(ScheduledDate).toISOString();
    const utcSheduledAt = dayjs(isoSheduledAt)
      .tz("Asia/Colombo", true)
      .utc()
      .toDate();
    const updatedSurgery = await prisma.surgery.update({
      where: {
        id: parseInt(id),
      },

      data: {
        ...req.body,
        ScheduledDate: utcSheduledAt,
        PatientNic: String(req.body.PatientNic),
      },
    });

    res.status(200).json(updatedSurgery);
  } catch (error) {
    res.status(500).json({
      message: `Error updating surgery schedule: ${(error as any).message}`,
    });
  }
};

// DELETE - Delete a surgery schedule
export const deleteSurgerySchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if surgery schedule exists
    const existingSurgery = await prisma.surgery.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingSurgery) {
      return res.status(404).json({
        message: "Surgery schedule not found",
      });
    }

    // Delete the surgery schedule
    await prisma.surgery.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Surgery schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: `Error deleting surgery schedule: ${(error as any).message}`,
    });
  }
};

export const getAllSurgerySchedules = async (_req: Request, res: Response) => {
  try {
    const surgeries = await prisma.surgery.findMany({
      orderBy: {
        ScheduledDate: "asc",
      },
    });

    res.status(200).json(surgeries);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching surgery schedules: ${(error as any).message}`,
    });
  }
};

// READ - Get a specific surgery schedule by ID
export const getSurgeryScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const surgery = await prisma.surgery.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!surgery) {
      return res.status(404).json({
        message: "Surgery schedule not found",
      });
    }

    res.status(200).json(surgery);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching surgery schedule: ${(error as any).message}`,
    });
  }
};
