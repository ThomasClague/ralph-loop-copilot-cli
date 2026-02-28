import type { EmailService, EmailPayload, EmailResult } from "./types";

export class ResendEmailService implements EmailService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(payload: EmailPayload): Promise<EmailResult> {
    const from = payload.from ?? "onboarding@resend.dev";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { success: false, mode: "live", error: err };
    }

    const data = (await res.json()) as { id?: string };
    return { success: true, messageId: data.id, mode: "live" };
  }
}
