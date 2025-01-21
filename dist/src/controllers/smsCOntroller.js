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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduledSMS = exports.cancelScheduledSMS = exports.scheduleSMS = void 0;
const twilio_1 = require("twilio");
const node_schedule_1 = __importDefault(require("node-schedule"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Store scheduled jobs
const scheduledJobs = new Map();
// Initialize Twilio client
const twilioClient = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const scheduleSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumbers, message, scheduleTime, jobId } = req.body;
        // Validate input
        console.log("phoneNumbers", phoneNumbers);
        if (!phoneNumbers ||
            !Array.isArray(phoneNumbers) ||
            phoneNumbers.length === 0) {
            return res.status(400).json({ error: "Invalid phone numbers" });
        }
        if (!message || !scheduleTime || !jobId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Ensure 'from' number is valid
        const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        if (!fromPhoneNumber) {
            return res.status(500).json({ error: "Twilio phone number is not set" });
        }
        // Create scheduled job
        const job = node_schedule_1.default.scheduleJob(jobId, new Date(Date.now() + 1 * 60 * 1000), () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Send SMS to each phone number
                const messagePromises = phoneNumbers.map((phoneNumber) => twilioClient.messages.create({
                    body: message,
                    from: fromPhoneNumber,
                    to: "+94720979028", // Use correct recipient phone numbers
                }));
                yield Promise.all(messagePromises);
                console.log(`Successfully sent SMS to ${phoneNumbers.length} recipients`);
                // Remove completed job from storage
                scheduledJobs.delete(jobId);
            }
            catch (error) {
                console.error("Error sending scheduled SMS:", error);
            }
        }));
        // Store job reference
        scheduledJobs.set(jobId, job);
        res.json({
            message: "SMS scheduled successfully",
            jobId,
            scheduledTime: new Date(Date.now() + 1 * 60 * 1000),
            recipientCount: phoneNumbers.length,
        });
    }
    catch (error) {
        console.error("Error scheduling SMS:", error);
        res.status(500).json({ error: "Failed to schedule SMS" });
    }
});
exports.scheduleSMS = scheduleSMS;
const cancelScheduledSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const job = scheduledJobs.get(jobId);
        if (!job) {
            return res.status(404).json({ error: "Scheduled job not found" });
        }
        job.cancel();
        scheduledJobs.delete(jobId);
        res.json({ message: "Scheduled SMS cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling scheduled SMS:", error);
        res.status(500).json({ error: "Failed to cancel scheduled SMS" });
    }
});
exports.cancelScheduledSMS = cancelScheduledSMS;
const getScheduledSMS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = Array.from(scheduledJobs.keys()).map((jobId) => {
            var _a;
            return ({
                jobId,
                nextInvocation: (_a = scheduledJobs.get(jobId)) === null || _a === void 0 ? void 0 : _a.nextInvocation(),
            });
        });
        res.json({ scheduledJobs: jobs });
    }
    catch (error) {
        console.error("Error fetching scheduled SMS:", error);
        res.status(500).json({ error: "Failed to fetch scheduled SMS" });
    }
});
exports.getScheduledSMS = getScheduledSMS;
