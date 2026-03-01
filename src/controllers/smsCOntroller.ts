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
// Initialize Twilio client using credentials from environment variables.
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * Schedules an SMS to be sent to a list of phone numbers.
 * Uses 'node-schedule' to trigger the sending process after a 1-minute delay.
 */
export const scheduleSMS = async (req: Request, res: Response) => {
  try {
    const { phoneNumbers, message, scheduleTime, jobId }: ScheduleSMSBody =
      req.body;

    // Validate input: ensure phoneNumbers list is not empty and other fields are present.
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

    // Ensure 'from' number is set in environment variables.
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!fromPhoneNumber) {
      return res.status(500).json({ error: "Twilio phone number is not set" });
    }

    // Create a scheduled job.
    // The scheduling logic here sets the execution time to 1 minute from now for demonstration/testing purposes.
    const job = schedule.scheduleJob(
      jobId,
      new Date(Date.now() + 1 * 60 * 1000),
      async () => {
        try {
          // Send SMS to each phone number concurrently.
          const messagePromises = phoneNumbers.map((phoneNumber) =>
            twilioClient.messages.create({
              body: message,
              from: fromPhoneNumber,
              to: "+94720979028", // HARDCODED for testing safety! In production, use 'phoneNumber'.
            }),
          );

          await Promise.all(messagePromises);
          console.log(
            `Successfully sent SMS to ${phoneNumbers.length} recipients`,
          );

          // Remove completed job from the in-memory map.
          scheduledJobs.delete(jobId);
        } catch (error) {
          console.error("Error sending scheduled SMS:", error);
        }
      },
    );

    // Store job reference to allow cancellation if needed.
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

/**
 * Cancels a scheduled SMS job.
 * Looks up the job ID in the `scheduledJobs` map and cancels it if found.
 */
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

/**
 * Retrieves a list of all currently scheduled SMS jobs.
 */
export const getScheduledSMS = async (req: Request, res: Response) => {
  try {
    // Map existing jobs to a simplified format.
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
