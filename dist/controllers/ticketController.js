"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleTicket = exports.getrelatedTicket = exports.getAllTicketByNic = exports.getTickets = exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure required fields from the request body
        const { nic, bht } = req.body;
        // Validate input
        if (!nic || !bht) {
            return res.status(400).json({ error: "NIC and BHT are required." });
        }
        // Create the ticket in the database
        const ticket = yield prisma.ticket.create({
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
    }
    catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({
            error: "An error occurred while creating the ticket.",
            details: error.message,
        });
    }
});
exports.createTicket = createTicket;
const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all tickets from the database
        const tickets = yield prisma.ticket.findMany();
        // Return the list of tickets
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error("Error getting tickets:", error);
        res.status(500).json({
            error: "An error occurred while getting tickets.",
            details: error.message,
        });
    }
});
exports.getTickets = getTickets;
const getAllTicketByNic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        // Fetch the ticket by ID from the database
        const ticket = yield prisma.ticket.findMany({
            where: {
                nic: Number(nic),
            },
        });
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found." });
        }
        // Return the ticket details
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error("Error getting ticket by ID:", error);
        res.status(500).json({
            error: "An error occurred while getting the ticket.",
            details: error.message,
        });
    }
});
exports.getAllTicketByNic = getAllTicketByNic;
const getrelatedTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nic, bht } = req.params;
        if (!nic && !bht) {
            return res.status(400).json({ error: "NIC is required." });
        }
        // Fetch the ticket by ID from the database
        const ticket = yield prisma.ticket.findUnique({
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
    }
    catch (error) {
        console.error("Error getting ticket by ID:", error);
        res.status(500).json({
            error: "An error occurred while getting the ticket.",
            details: error.message,
        });
    }
});
exports.getrelatedTicket = getrelatedTicket;
const deleTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the ticket ID from the request parameters
        const { nic, bht } = req.params;
        if (!nic) {
            return res.status(400).json({ error: "NIC is required." });
        }
        // Delete the ticket from the database
        const deletedTicket = yield prisma.ticket.delete({
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
    }
    catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({
            error: "An error occurred while deleting the ticket.",
            details: error.message,
        });
    }
});
exports.deleTicket = deleTicket;
