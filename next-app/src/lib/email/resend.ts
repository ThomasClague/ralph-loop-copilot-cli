import { Resend } from "resend";
import type { EmailService, EmailPayload, EmailResult } from "./types";

export class ResendEmailService implements EmailService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /** Send an email via the Resend API using the official SDK. */
  async send(payload: EmailPayload): Promise<EmailResult> {
    const resend = new Resend(this.apiKey);
    const from = payload.from ?? "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    if (error) {
      return { success: false, mode: "live", error: error.message };
    }

    return { success: true, messageId: data?.id, mode: "live" };
  }
}
