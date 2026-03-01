// clinicAssigment
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extending BigInt prototype to support JSON serialization.
// Prisma returns BigInt for some count operations, which JSON.stringify cannot handle directly.
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

/**
 * Controller to create a new Clinic Assignment.
 * Assigns a patient (by NIC) to a specific clinic.
 */
export const createClinicAssigment = async (req: Request, res: Response) => {
  try {
    const { nic, clinicId, clinicName } = req.body;

    // Validate required fields.
    if (!nic || !clinicId || !clinicName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the patient exists in the database.
    const checkNicexisits = await prisma.patient.findUnique({
      where: {
        nic: nic,
      },
    });

    if (!checkNicexisits) {
      return res.status(400).json({ message: "Patient does not registered" });
    }

    // Create the assignment record.
    const newClinicAssigment = await prisma.clinicAssignment.create({
      data: {
        nic,
        clinicId: Number(clinicId),
        clinicName,
      },
    });

    // Return success response.
    res.status(200).json({
      newClinicAssigment,
      message: "Clinic Assigment created successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error creating clinic:${error.message}` });
  }
};

/**
 * Retrieves all Clinic Assignments.
 */
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

/**
 * Retrieves a single Clinic Assignment by ID.
 */
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

/**
 * Updates a Clinic Assignment by ID.
 */
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

/**
 * Deletes a Clinic Assignment by ID.
 */
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

/**
 * Retrieves aggregated clinic assignment data for display in a table.
 * Uses a raw SQL query to join 'clinic' and 'clinicAssignment' tables.
 * filters for future scheduled clinics.
 */
export const getAllClinicAssigmentsForTable = async (
  req: Request,
  res: Response,
) => {
  try {
    // Execute raw SQL to gather clinic details and count patients.
    const clinicAssigments = await prisma.$queryRaw<
      Array<{
        noOfpatients: number;
        clinicName: string;
        location: string;
        doctorName: string;
        sheduledAt: Date;
      }>
    >`SELECT 
    count(nic) as noOfpatients, -- Count patients per clinic
    ca."clinicName",
    cl."location",
    cl."doctorName",
    cl."sheduledAt"
FROM 
    clinic AS cl
INNER JOIN 
    "clinicAssignment" AS ca 
ON 
    ca."clinicId" = cl.id
WHERE 
    DATE(cl."sheduledAt") >= CURRENT_DATE -- Filter for today or future dates
GROUP BY 
    ca."clinicId", 
    ca."clinicName", 
    cl."location", 
    cl."doctorName", 
    cl."sheduledAt";
`;
    if (clinicAssigments.length === 0) {
      return res
        .status(404)
        .json({ message: "No future clinic assigments found" });
    }

    res.status(200).json({
      clinicAssigments,
      message: "Clinic Assigments retrieved successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error getting clinics:${error.message}` });
  }
};

/**
 * Retrieves patient details for a specific clinic name.
 * Joins 'clinicAssignment' with 'Patient' table.
 */
export const getPatientDetailsByClinicName = async (
  req: Request,
  res: Response,
) => {
  try {
    const { clinicName } = req.params;
    if (!clinicName) {
      return res.status(400).json({ message: "Patient does not registered" });
    }
    // Raw SQL to fetch patient details who are assigned to the given clinic.
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

/**
 * Calculates clinic visits for the past 7 days.
 * Returns an array of days and visit counts.
 */
export const getWeeklyClinincVisits = async (req: Request, res: Response) => {
  try {
    // Fetch creation dates of assignments from the last 7 days.
    const clicnicDates: Array<{ createdAt: Date }> =
      await prisma.$queryRaw`SELECT "createdAt"
        FROM "clinicAssignment"
        WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days';`;

    // Step 1: Prepare base array for all days of the week, initialized to 0.
    const allDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeklyData: { day: string; count: number }[] = allDays.map((day) => ({
      day,
      count: 0,
    }));

    // Step 2: Iterate through fetched dates and increment counts for corresponding days.
    clicnicDates.forEach(({ createdAt }) => {
      // Get the full weekday name from the date.
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(createdAt);

      // Find the day entry and increment count.
      const dayEntry = weeklyData.find((d) => d.day === dayName);
      if (dayEntry) {
        dayEntry.count += 1;
      }
    });

    res.status(200).json({ weeklyData });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting clinics: ${error.message}` });
  }
};
