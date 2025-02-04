import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MAILTRAP_TOKEN) {
  throw new Error("MAILTRAP_TOKEN is required");
}

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL || "no-reply@crisiscompass.org",
  name: process.env.MAILTRAP_SENDER_NAME || "CrisisCompass",
};
