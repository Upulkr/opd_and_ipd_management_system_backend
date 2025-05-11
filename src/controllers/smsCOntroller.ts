import { Twilio } from "twilio";
import schedule from "node-schedule";
// src/controllers/smsController.ts
import { Request, Response } from "express";

import dotenv from "dotenv";

dotenv.config();

// Types
interface ScheduleSMSBody {
  phoneNumbers: string[];
  message: string;
  scheduleTime: string;
  jobId: string;
}

// Store scheduled jobs
const scheduledJobs = new Map<string, schedule.Job>();

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const scheduleSMS = async (req: Request, res: Response) => {
  try {
    const { phoneNumbers, message, scheduleTime, jobId }: ScheduleSMSBody =
      req.body;

    // Validate input
    console.log("phoneNumbers", phoneNumbers);
    if (
      !phoneNumbers ||
      !Array.isArray(phoneNumbers) ||
      phoneNumbers.length === 0
    ) {
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
    const job = schedule.scheduleJob(
      jobId,
      new Date(Date.now() + 1 * 60 * 1000),
      async () => {
        try {
          // Send SMS to each phone number
          const messagePromises = phoneNumbers.map((phoneNumber) =>
            twilioClient.messages.create({
              body: message,
              from: fromPhoneNumber,
              to: "+94720979028", // Use correct recipient phone numbers
            })
          );

          await Promise.all(messagePromises);
          console.log(
            `Successfully sent SMS to ${phoneNumbers.length} recipients`
          );

          // Remove completed job from storage
          scheduledJobs.delete(jobId);
        } catch (error) {
          console.error("Error sending scheduled SMS:", error);
        }
      }
    );

    // Store job reference
    scheduledJobs.set(jobId, job);

    res.json({
      message: "SMS scheduled successfully",
      jobId,
      scheduledTime: new Date(Date.now() + 1 * 60 * 1000),
      recipientCount: phoneNumbers.length,
    });
  } catch (error) {
    console.error("Error scheduling SMS:", error);
    res.status(500).json({ error: "Failed to schedule SMS" });
  }
};

export const cancelScheduledSMS = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = scheduledJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: "Scheduled job not found" });
    }

    job.cancel();
    scheduledJobs.delete(jobId);
    res.json({ message: "Scheduled SMS cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling scheduled SMS:", error);
    res.status(500).json({ error: "Failed to cancel scheduled SMS" });
  }
};

export const getScheduledSMS = async (req: Request, res: Response) => {
  try {
    const jobs = Array.from(scheduledJobs.keys()).map((jobId) => ({
      jobId,
      nextInvocation: scheduledJobs.get(jobId)?.nextInvocation(),
    }));

    res.json({ scheduledJobs: jobs });
  } catch (error) {
    console.error("Error fetching scheduled SMS:", error);
    res.status(500).json({ error: "Failed to fetch scheduled SMS" });
  }
};
