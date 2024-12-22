import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the NIC from the request query or parameters
    const { nic } = req.params;

    // Validate input
    if (!nic) {
      res.status(400).json({ error: "NIC is required." });
      return;
    }

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { nic: parseInt(nic, 10) },
    });

    // Check if user exists
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Return the user data
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "An error occurred while fetching the user.",
      details: error.message,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract user data from the request body
    const { nic, name, email, password, role } = req.body;

    // Validate input
    if (!nic || !name || !email || !password || !role) {
      res.status(400).json({
        error: "All fields (nic, name, email, password, role) are required.",
      });
      return;
    }

    // Check if the role is valid
    const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
    if (!validRoles.includes(role)) {
      res
        .status(400)
        .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
      return;
    }

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        nic,
        name,
        email,
        password, // Ideally, hash the password before saving
        role,
      },
    });

    // Return the created user
    res.status(201).json(user);
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle unique constraint errors
    if (error.code === "P2002") {
      res.status(409).json({ error: "NIC or email already exists." });
      return;
    }

    // Handle other errors
    res.status(500).json({
      error: "An error occurred while creating the user.",
      details: error.message,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract user data from the request body
    const { nic, name, email, password, role } = req.body;

    // Validate input
    if (!nic || !name || !email || !password || !role) {
      res.status(400).json({
        error: "All fields (nic, name, email, password, role) are required.",
      });
      return;
    }

    // Check if the role is valid
    const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
    if (!validRoles.includes(role)) {
      res
        .status(400)
        .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
      return;
    }

    // Update the user in the database
    const user = await prisma.user.update({
      where: { nic: parseInt(nic, 10) },
      data: {
        name,
        email,
        password, // Ideally, hash the password before saving
        role,
      },
    });

    // Return the updated user
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);

    // Handle unique constraint errors
    if (error.code === "P2002") {
      res.status(409).json({ error: "NIC or email already exists." });
      return;
    }

    // Handle other errors
    res.status(500).json({
      error: "An error occurred while updating the user.",
      details: error.message,
    });
  }
};
