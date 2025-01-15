// clinicAssigment
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export const createClinicAssigment = async (req: Request, res: Response) => {
  try {
    const { nic, clinicId, clinicName } = req.body;

    const checkNicexisits = await prisma.patient.findUnique({
      where: {
        nic: nic,
      },
    });

    if (!checkNicexisits) {
      return res.status(400).json({ message: "Patient does not registered" });
    }

    const newClinicAssigment = await prisma.clinicAssignment.create({
      data: {
        nic,
        clinicId: Number(clinicId),
        clinicName,
      },
    });
    res.status(200).json({
      newClinicAssigment,
      message: "Clinic Assigment created successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating clinic:${error.message}` });
  }
};

export const getAllClinicAssigments = async (req: Request, res: Response) => {
  try {
    const clinicAssigments = await prisma.clinicAssignment.findMany();
    res.status(200).json({
      clinicAssigments,
      message: "Clinic Assigments retrieved successfully!",
    });
  } catch (error: any) {
    error
      .status(500)
      .json({ message: `Error getting clinics:${error.message}` });
  }
};

export const getClinicAssigmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const clinicAssigment = await prisma.clinicAssignment.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      clinicAssigment,
      message: "Clinic Assigment retrieved successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error getting clinics:${error.message}` });
  }
};

export const updateClinicAssigment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedClinicAssigment = await prisma.clinicAssignment.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.status(200).json({
      updatedClinicAssigment,
      message: "Clinic Assigment updated successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating clinics:${error.message}` });
  }
};

export const deleteClinicAssigment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedClinicAssigment = await prisma.clinicAssignment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      deletedClinicAssigment,
      message: "Clinic Assigment deleted successfully!",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting clinics:${error.message}` });
  }
};

export const getAllClinicAssigmentsForTable = async (
  req: Request,
  res: Response
) => {
  try {
    const clinicAssigments =
      await prisma.$queryRaw`select count(nic) as noOfpatients,ca."clinicName" ,cl."location",cl."doctorName",cl."sheduledAt" from clinic as cl
inner join "clinicAssignment" as ca on ca."clinicId" =cl.id group by ca."clinicId",ca."clinicName",cl."location",cl."doctorName",cl."sheduledAt";`;
    res.status(200).json({
      clinicAssigments,
      message: "Clinic Assigments retrieved successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error getting clinics:${error.message}` });
  }
};

export const getPatientDetailsByClinicName = async (
  req: Request,
  res: Response
) => {
  try {
    const { clinicName } = req.params;
    if (!clinicName) {
      return res.status(400).json({ message: "Patient does not registered" });
    }
    const patientDetails =
      await prisma.$queryRaw`SELECT pa."nic",pa."name",pa."phone", pa."city" FROM "clinicAssignment" as cl inner join "Patient" as pa on pa."nic"=cl."nic"  where "clinicName"=${clinicName}`;

    res.status(200).json({
      patientDetails,
      message: "Patient details retrieved successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error getting clinics:${error.message}` });
  }
};
