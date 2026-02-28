import { getAllSettings } from "../../db/repository";
import { MockEmailService } from "./mock";
import { ResendEmailService } from "./resend";
import type { EmailService } from "./types";

export async function getEmailService(): Promise<EmailService> {
  const settings = await getAllSettings();
  const mode = settings["email_mode"] ?? "mock";

  if (mode === "live") {
    const apiKey = settings["resend_api_key"];
    if (!apiKey) throw new Error("RESEND_API_KEY not configured in settings");
    return new ResendEmailService(apiKey);
  }

  return new MockEmailService();
}
