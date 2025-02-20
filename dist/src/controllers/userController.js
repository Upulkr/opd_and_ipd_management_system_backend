"use strict";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
// const prisma = new PrismaClient();
// export const getAllUsers = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving users: ${error.message}` });
//   }
// };
// export const getUserByNic = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Extract the NIC from the request query or parameters
//     const { nic } = req.params;
//     // Validate input
//     if (!nic) {
//       res.status(400).json({ error: "NIC is required." });
//       return;
//     }
//     // Fetch the user from the database
//     const user = await prisma.user.findUnique({
//       where: { nic },
//     });
//     // Check if user exists
//     if (!user) {
//       res.status(404).json({ error: "User not found." });
//       return;
//     }
//     // Return the user data
//     res.status(200).json(user);
//   } catch (error: any) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({
//       error: "An error occurred while fetching the user.",
//       details: error.message,
//     });
//   }
// };
// export const createUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Extract user data from the request body
//     const { nic, name, email, password, role } = req.body;
//     // Validate input
//     if (!nic || !name || !email || !password || !role) {
//       res.status(400).json({
//         error: "All fields (nic, name, email, password, role) are required.",
//       });
//       return;
//     }
//     // Check if the role is valid
//     const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
//     if (!validRoles.includes(role)) {
//       res
//         .status(400)
//         .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
//       return;
//     }
//     // Create the user in the database
//     const user = await prisma.user.create({
//       data: {
//         nic,
//         name,
//         email,
//         password, // Ideally, hash the password before saving
//         role,
//       },
//     });
//     // Return the created user
//     res.status(201).json(user);
//   } catch (error: any) {
//     console.error("Error creating user:", error);
//     // Handle unique constraint errors
//     if (error.code === "P2002") {
//       res.status(409).json({ error: "NIC or email already exists." });
//       return;
//     }
//     // Handle other errors
//     res.status(500).json({
//       error: "An error occurred while creating the user.",
//       details: error.message,
//     });
//   }
// };
// export const updateUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Extract user data from the request body
//     const { nic, name, email, password, role } = req.body;
//     // Validate input
//     if (!nic || !name || !email || !password || !role) {
//       res.status(400).json({
//         error: "All fields (nic, name, email, password, role) are required.",
//       });
//       return;
//     }
//     // Check if the role is valid
//     const validRoles = ["DOCTOR", "NURSE", "PATIENT", "LABTECHNICIAN"];
//     if (!validRoles.includes(role)) {
//       res
//         .status(400)
//         .json({ error: `Role must be one of: ${validRoles.join(", ")}.` });
//       return;
//     }
//     // Update the user in the database
//     const user = await prisma.user.update({
//       where: { nic },
//       data: {
//         name,
//         email,
//         password, // Ideally, hash the password before saving
//         role,
//       },
//     });
//     // Return the updated user
//     res.status(200).json(user);
//   } catch (error: any) {
//     console.error("Error updating user:", error);
//     // Handle unique constraint errors
//     if (error.code === "P2002") {
//       res.status(409).json({ error: "NIC or email already exists." });
//       return;
//     }
//     // Handle other errors
//     res.status(500).json({
//       error: "An error occurred while updating the user.",
//       details: error.message,
//     });
//   }
// };
// export const deleteUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { nic } = req.params;
//     if (!nic) {
//       res.status(400).json({ error: "NIC is required." });
//       return;
//     }
//     await prisma.user.delete({
//       where: { nic },
//     });
//     res.status(200).json({ message: "User deleted successfully." });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: `Error deleting user: ${(error as any).message}` });
//   }
// };
// export const getAllPatients = async (req: Request, res: Response) => {
//   try {
//     const patients = await prisma.user.findMany({
//       where: {
//         role: "PATIENT",
//       },
//     });
//     res.json(patients);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving patients: ${error.message}` });
//   }
// };
// export const getAllDoctors = async (req: Request, res: Response) => {
//   try {
//     const doctors = await prisma.user.findMany({
//       where: {
//         role: "DOCTOR",
//       },
//     });
//     res.json(doctors);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving doctors: ${error.message}` });
//   }
// };
// export const getAllNurses = async (req: Request, res: Response) => {
//   try {
//     const nurses = await prisma.user.findMany({
//       where: {
//         role: "NURSE",
//       },
//     });
//     res.status(200).json(nurses);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving nurses: ${error.message}` });
//   }
// };
// export const getAllLabTechnicians = async (req: Request, res: Response) => {
//   try {
//     const labTechnicians = await prisma.user.findMany({
//       where: { role: "LABTECHNICIAN" },
//     });
//     res.status(200).json(labTechnicians);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error retrieving lab technicians: ${error.message}` });
//   }
// };
