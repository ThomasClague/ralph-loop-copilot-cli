export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  mode: "mock" | "live";
  error?: string;
}

export interface EmailService {
  send(payload: EmailPayload): Promise<EmailResult>;
}
