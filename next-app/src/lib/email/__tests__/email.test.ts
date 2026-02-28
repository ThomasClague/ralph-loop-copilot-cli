import { describe, it, expect, vi, beforeEach } from "vitest";
import { MockEmailService } from "../mock";
import { ResendEmailService } from "../resend";
import { getEmailService } from "../factory";
import type { EmailPayload } from "../types";

const sendMock = vi.fn();

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = { send: sendMock };
    },
  };
});

vi.mock("../../../db/repository", () => ({
  getAllSettings: vi.fn(),
}));

const minimalPayload: EmailPayload = {
  to: "test@example.com",
  subject: "Hello",
  html: "<p>Hi</p>",
};

describe("MockEmailService", () => {
  it("returns success=true with mode=mock", async () => {
    const svc = new MockEmailService();
    const result = await svc.send(minimalPayload);
    expect(result.success).toBe(true);
    expect(result.mode).toBe("mock");
  });

  it("does not throw with minimal payload", async () => {
    const svc = new MockEmailService();
    await expect(svc.send(minimalPayload)).resolves.toBeDefined();
  });

  it("returns a messageId prefixed with mock-", async () => {
    const svc = new MockEmailService();
    const result = await svc.send(minimalPayload);
    expect(result.messageId).toMatch(/^mock-/);
  });
});

describe("ResendEmailService", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it("calls Resend SDK and returns success on ok response", async () => {
    sendMock.mockResolvedValue({ data: { id: "msg-123" }, error: null });
    const svc = new ResendEmailService("test-api-key");
    const result = await svc.send(minimalPayload);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
    expect(result.mode).toBe("live");
    expect(result.messageId).toBe("msg-123");
  });

  it("returns success=false when Resend SDK returns an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Rate limited" },
    });
    const svc = new ResendEmailService("test-api-key");
    const result = await svc.send(minimalPayload);
    expect(result.success).toBe(false);
    expect(result.mode).toBe("live");
    expect(result.error).toBe("Rate limited");
  });

  it("passes all payload fields to the SDK", async () => {
    sendMock.mockResolvedValue({ data: { id: "x" }, error: null });
    const svc = new ResendEmailService("key");
    const payload: EmailPayload = {
      to: "a@b.com",
      subject: "Sub",
      html: "<b>hi</b>",
      text: "hi",
      from: "sender@example.com",
      replyTo: "reply@example.com",
    };
    await svc.send(payload);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "a@b.com",
        subject: "Sub",
        html: "<b>hi</b>",
        text: "hi",
        from: "sender@example.com",
        replyTo: "reply@example.com",
      }),
    );
  });
});

describe("getEmailService factory", () => {
  let getAllSettings: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const repo = await import("../../../db/repository");
    getAllSettings = repo.getAllSettings as ReturnType<typeof vi.fn>;
    getAllSettings.mockReset();
  });

  it('returns MockEmailService when email_mode is "mock"', async () => {
    getAllSettings.mockResolvedValue({ email_mode: "mock" });
    const svc = await getEmailService();
    expect(svc).toBeInstanceOf(MockEmailService);
  });

  it("returns MockEmailService when email_mode is not set", async () => {
    getAllSettings.mockResolvedValue({});
    const svc = await getEmailService();
    expect(svc).toBeInstanceOf(MockEmailService);
  });

  it('returns ResendEmailService when mode is "live" and key is set', async () => {
    getAllSettings.mockResolvedValue({
      email_mode: "live",
      resend_api_key: "key-abc",
    });
    const svc = await getEmailService();
    expect(svc).toBeInstanceOf(ResendEmailService);
  });

  it('throws when mode is "live" but no API key is configured', async () => {
    getAllSettings.mockResolvedValue({ email_mode: "live" });
    await expect(getEmailService()).rejects.toThrow(
      "RESEND_API_KEY not configured",
    );
  });
});
