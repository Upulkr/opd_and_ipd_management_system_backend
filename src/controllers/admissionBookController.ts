// Importing necessary types from Express for TypeScript support.
// Request and Response interfaces define the structure of the HTTP request and response objects.
import { Request, Response } from "express";

// Importing PrismaClient to interact with the database.
// Prisma acts as an Object-Relational Mapper (ORM) to bridge our code and the database.
import { PrismaClient } from "@prisma/client";
// Instantiating the Prisma Client.
// This instance will be used to perform CRUD (Create, Read, Update, Delete) operations on the database.
const prisma = new PrismaClient();

/**
 * Controller to create a new Admission Book entry.
 * This is an asynchronous function that handles the creation logic.
 *
 * @param req - The request object containing data sent by the client.
 * @param res - The response object used to send back the desired HTTP response.
 */
export const createAdmissionBook = async (req: Request, res: Response) => {
  try {
    // Destructuring data from the request body.
    // This extracts all the necessary fields sent from the frontend form.
    const {
      nic,
      bht,
      name,
      dailyno,
      yearlyno,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      age,
      admittedDate,
      reason,
      allergies,
      phone,
      transferCategory,
      dischargeDate,
      wardNo,
      livingStatus,
    } = req.body;

    // Using Prisma to create a new record in the 'admissionbook' table.
    // We use 'await' to wait for the database operation to complete before proceeding.
    const newAdmissionBook = await prisma.admissionbook.create({
      data: {
        nic,
        bht: Number(bht), // Converting BHT to a number as expected by the schema.
        name,
        dailyno,
        yearlyno,
        city,
        stateProvince,
        postalCode,
        country,
        streetAddress,
        age,
        admittedDate: new Date(admittedDate), // Parsing string date to JavaScript Date object.
        reason,
        allergies,
        transferCategory,
        phone,
        wardNo,
        livingStatus,
        // Handling optional dischargeDate: if provided, parse it; otherwise, set to null.
        dischargeDate: dischargeDate ? new Date(dischargeDate) : null,
      },
    });
    // Respond with HTTP 201 (Created) and the newly created record.
    res.status(201).json({
      message: "AdmissionBook Created Successfully",
      newAdmissionBook,
    });
  } catch (error) {
    // Error handling: If the database operation fails, we catch the error here.
    // Respond with HTTP 500 (Internal Server Error) and the error message.
    res.status(500).json({
      message: `Error creating AdmissionBook:  ${(error as any).message}`,
    });
  }
};

/**
 * Controller to retrieve all Admission Book entries.
 * Useful for listing all admissions in an administrative view.
 */
export const getAdmissionBooks = async (req: Request, res: Response) => {
  try {
    // Fetching all records from the 'admissionbook' table using 'findMany'.
    const admissionBooks = await prisma.admissionbook.findMany();
    // Respond with HTTP 200 (OK) and the list of admission books.
    res.status(200).json(admissionBooks);
  } catch (error: any) {
    // Standard error handling for retrieval failures.
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};

/**
 * Controller to get a specific Admission Book entry by BHT (Bed Head Ticket).
 * expecting 'bht' as a query parameter.
 */
export const getrelatedAdmissionBookbyBHT = async (
  req: Request,
  res: Response,
) => {
  // Extracting 'bht' from the query parameters (e.g., ?bht=123).
  const { bht } = req.query;
  try {
    // Using 'findUnique' to retrieve a single record that matches the unique BHT key.
    const admissionBook = await prisma.admissionbook.findUnique({
      where: {
        bht: Number(bht), // Ensuring BHT is a number for the query.
      },
    });
    // Returning the found record.
    res.status(200).json({ admissionBook });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};
/**
 * Controller to get all Admission Books related to a specific NIC (National Identity Card) and BHT.
 * Note: The naming 'getAllAdmissionBooksforNic' suggests NIC focused, but it queries by both NIC and BHT.
 */
export const getAllAdmissionBooksforNic = async (
  req: Request,
  res: Response,
) => {
  // Extracting 'nic' and 'bht' from the route parameters (e.g., /:nic/:bht).
  const { nic, bht } = req.params;
  try {
    // Finding multiple records that match the given criteria.
    // Although 'findMany' is used, BHT is typically unique, so this might return one or no results depending on schema.
    const admissionBook = await prisma.admissionbook.findMany({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(admissionBook);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting AdmissionBook: ${error.message}` });
  }
};

/**
 * Controller to update an existing Admission Book entry.
 * It identifies the record by NIC and BHT and updates the provided fields.
 */
export const updateAdmissionBook = async (req: Request, res: Response) => {
  const { nic } = req.params;
  // Validation check: Ensure NIC is provided in params.
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    // Destructuring all potential fields to update from the request body.
    const {
      nic,
      bht,
      name,
      dailyno,
      yearlyno,
      city,
      stateProvince,
      postalCode,
      country,
      streetAddress,
      age,
      admittedDate,
      reason,
      allergies,
      phone,
      transferCategory,
      dischargeDate,
      wardNo,
      livingStatus,
    } = req.body;

    // Using 'prisma.update' to modify the existing record.
    // 'where' clause specifies which record to update (composite key might be involved here).
    const updatedAdmissionBook = await prisma.admissionbook.update({
      where: {
        nic,
        bht, // Assuming there's a unique constraint or composite ID on nic + bht
      },
      data: {
        nic,
        bht: Number(bht),
        name,
        dailyno,
        yearlyno,
        city,
        stateProvince,
        postalCode,
        country,
        streetAddress,
        age,
        admittedDate: new Date(admittedDate),
        reason,
        allergies,
        transferCategory,
        phone,
        wardNo,
        // Updating dischargeDate: converting string to Date object.
        dischargeDate: new Date(dischargeDate),
      },
    });
    // Replying with the updated record.
    res.status(200).json(updatedAdmissionBook);
  } catch (error) {
    res.status(500).json({
      message: `Error updating AdmissionBook: ${(error as any).message}`,
    });
  }
};

/**
 * Controller to delete an Admission Book entry.
 * Removes the record identified by NIC and BHT from the database.
 */
export const deleteAdmissionBook = async (req: Request, res: Response) => {
  const { nic, bht } = req.params;
  // Basic validation.
  if (!nic) {
    return res.status(400).json({ message: "nic is required" });
  }
  try {
    // 'prisma.delete' removes the record matching the 'where' clause.
    const deletedAdmissionBook = await prisma.admissionbook.delete({
      where: {
        nic,
        bht: Number(bht),
      },
    });
    res.status(200).json(deletedAdmissionBook);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error deleting AdmissionBook: ${error.message}` });
  }
};

/**
 * Controller to count how many Admission Book entries were created today.
 * Useful for daily statistical dashboards.
 */
export const getNumberOfAdmissionBooksToday = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get the start and end of today
    // We create a Date object representing the current moment.
    const startOfDay = new Date();
    // Set time to 00:00:00.000 to get the beginning of the day.
    startOfDay.setHours(0, 0, 0, 0);

    // Create another Date object for the end of the day.
    const endOfDay = new Date();
    // Set time to 23:59:59.999 to get the very last millisecond of the day.
    endOfDay.setHours(23, 59, 59, 999);

    // Using 'prisma.count' to count records created within this time range.
    const outPatientsTodayCount = await prisma.admissionbook.count({
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

/**
 * Controller to get the count of patients discharged today.
 * It groups records by discharge date and counts them.
 */
export const getDischargeCounts = async (req: Request, res: Response) => {
  try {
    // Defining the time range for "Today".
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (00:00)

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow (next day 00:00)

    // Using 'groupBy' to aggregate data based on 'dischargeDate'.
    // We filter for discharge dates that fall between 'today' and 'tomorrow'.
    const dischargeCounts = await prisma.admissionbook.groupBy({
      by: ["dischargeDate"],
      _count: {
        dischargeDate: true, // Counting the occurrences.
      },
      where: {
        dischargeDate: {
          gte: today, // Greater than or equal to today 00:00
          lt: tomorrow, // Strictly less than tomorrow 00:00
        },
      },
    });

    res.status(200).json(dischargeCounts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
