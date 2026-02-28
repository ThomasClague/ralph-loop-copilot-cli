import * as fs from "fs";
import * as path from "path";
import type { EmailService, EmailPayload, EmailResult } from "./types";

export class MockEmailService implements EmailService {
  async send(payload: EmailPayload): Promise<EmailResult> {
    try {
      console.log("[MockEmailService] Sending email:", payload);

      const mockEmailsDir = path.resolve("./public/mock-emails");
      if (!fs.existsSync(mockEmailsDir)) {
        fs.mkdirSync(mockEmailsDir, { recursive: true });
      }

      const filename = `${Date.now()}-${payload.to.replace(/[^a-z0-9]/gi, "_")}.html`;
      fs.writeFileSync(path.join(mockEmailsDir, filename), payload.html);
    } catch (err) {
      console.error("[MockEmailService] Failed to write email file:", err);
    }

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      mode: "mock",
    };
  }
}
