import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTicket = async (req: Request, res: Response) => {
  try {
    // Destructure required fields from the request body
    const { nic, bht } = req.body;

    // Validate input
    if (!nic || !bht) {
      return res.status(400).json({ error: "NIC and BHT are required." });
    }

    // Create the ticket in the database
    const ticket = await prisma.ticket.create({
      data: {
        nic,
        bht,
      },
    });

    // Return the created ticket
    res.status(201).json({
      message: "Ticket created successfully!",
      ticket,
    });
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      error: "An error occurred while creating the ticket.",
      details: error.message,
    });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    // Fetch all tickets from the database
    const tickets = await prisma.ticket.findMany();

    // Return the list of tickets
    res.status(200).json(tickets);
  } catch (error: any) {
    console.error("Error getting tickets:", error);
    res.status(500).json({
      error: "An error occurred while getting tickets.",
      details: error.message,
    });
  }
};

export const getAllTicketByNic = async (req: Request, res: Response) => {
  try {
    const { nic } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    // Fetch the ticket by ID from the database
    const ticket = await prisma.ticket.findMany({
      where: {
        nic: Number(nic),
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    // Return the ticket details
    res.status(200).json(ticket);
  } catch (error: any) {
    console.error("Error getting ticket by ID:", error);
    res.status(500).json({
      error: "An error occurred while getting the ticket.",
      details: error.message,
    });
  }
};
export const getrelatedTicket = async (req: Request, res: Response) => {
  try {
    const { nic, bht } = req.params;
    if (!nic && !bht) {
      return res.status(400).json({ error: "NIC is required." });
    }
    // Fetch the ticket by ID from the database
    const ticket = await prisma.ticket.findUnique({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    // Return the ticket details
    res.status(200).json(ticket);
  } catch (error: any) {
    console.error("Error getting ticket by ID:", error);
    res.status(500).json({
      error: "An error occurred while getting the ticket.",
      details: error.message,
    });
  }
};

export const deleTicket = async (req: Request, res: Response) => {
  try {
    // Extract the ticket ID from the request parameters
    const { nic, bht } = req.params;
    if (!nic) {
      return res.status(400).json({ error: "NIC is required." });
    }
    // Delete the ticket from the database
    const deletedTicket = await prisma.ticket.delete({
      where: {
        nic: Number(nic),
        bht: Number(bht),
      },
    });
    // Return the deleted ticket details
    res.status(200).json({
      message: "Ticket deleted successfully!",
      deletedTicket,
    });
  } catch (error: any) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({
      error: "An error occurred while deleting the ticket.",
      details: error.message,
    });
  }
};
