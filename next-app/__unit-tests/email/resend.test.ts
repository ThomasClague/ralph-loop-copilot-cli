// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ResendEmailService } from "../../src/lib/email/resend";

let sendMock: ReturnType<typeof vi.fn>;

// Mock the Resend SDK using a class so `new Resend()` works
vi.mock("resend", () => {
  return {
    Resend: class MockResend {
      emails = {
        send: (...args: unknown[]) =>
          (sendMock as (...a: unknown[]) => unknown)(...args),
      };
    },
  };
});

describe("ResendEmailService", () => {
  beforeEach(() => {
    sendMock = vi.fn();
  });

  it("returns success result with messageId on successful send", async () => {
    sendMock.mockResolvedValue({ data: { id: "resend-msg-123" }, error: null });

    const service = new ResendEmailService("test-api-key");
    const result = await service.send({
      to: "prospect@example.com",
      subject: "Hello",
      html: "<p>Hello</p>",
    });

    expect(result).toEqual({
      success: true,
      messageId: "resend-msg-123",
      mode: "live",
    });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "prospect@example.com",
        subject: "Hello",
        html: "<p>Hello</p>",
        from: "onboarding@resend.dev",
      }),
    );
  });

  it("returns failure result when Resend returns an error", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { message: "Invalid API key" },
    });

    const service = new ResendEmailService("bad-key");
    const result = await service.send({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });

    expect(result).toEqual({
      success: false,
      mode: "live",
      error: "Invalid API key",
    });
  });

  it("uses custom from address when provided", async () => {
    sendMock.mockResolvedValue({ data: { id: "msg-456" }, error: null });

    const service = new ResendEmailService("test-key");
    await service.send({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
      from: "custom@myapp.com",
    });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "custom@myapp.com" }),
    );
  });
});
