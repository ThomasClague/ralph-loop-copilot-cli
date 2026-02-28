// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("../../src/db/repository", () => ({
  getProspectBySlug: vi.fn(),
  createSentEmail: vi.fn(),
  listAllSentEmails: vi.fn(),
}));

vi.mock("../../src/lib/email/factory", () => ({
  getEmailService: vi.fn(),
}));

import {
  getProspectBySlug,
  createSentEmail,
  listAllSentEmails,
} from "../../src/db/repository";
import { getEmailService } from "../../src/lib/email/factory";
import { POST } from "../../app/api/email/send/route";
import { GET } from "../../app/api/email/sent/route";
import { NextRequest } from "next/server";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeProspect(overrides: Record<string, unknown> = {}) {
  return {
    id: "prospect-1",
    slug: "abc-roofing",
    businessName: "ABC Roofing",
    email: "owner@abcroofing.com",
    ...overrides,
  };
}

function makeSendRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/email/send", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const mockEmailService = { send: vi.fn() };

// ── Tests: POST /api/email/send ────────────────────────────────────────────

describe("POST /api/email/send", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getEmailService).mockResolvedValue(mockEmailService as never);
    vi.mocked(createSentEmail).mockResolvedValue({} as never);
  });

  it("returns 400 if prospectSlug is missing", async () => {
    const req = makeSendRequest({ templateId: "coldOutreach" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/required/i);
  });

  it("returns 400 if templateId is missing", async () => {
    const req = makeSendRequest({ prospectSlug: "abc-roofing" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 if prospect not found", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(undefined);
    const req = makeSendRequest({
      prospectSlug: "unknown",
      templateId: "coldOutreach",
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 if templateId is invalid", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(makeProspect() as never);
    const req = makeSendRequest({
      prospectSlug: "abc-roofing",
      templateId: "nonExistent",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Template/i);
  });

  it("returns 422 if prospect has no email", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(
      makeProspect({ email: null }) as never,
    );
    const req = makeSendRequest({
      prospectSlug: "abc-roofing",
      templateId: "coldOutreach",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("sends email and returns 200 with sent:true and mode", async () => {
    vi.mocked(getProspectBySlug).mockResolvedValue(makeProspect() as never);
    mockEmailService.send.mockResolvedValue({
      success: true,
      messageId: "mock-123",
      mode: "mock",
    });
    const req = makeSendRequest({
      prospectSlug: "abc-roofing",
      templateId: "coldOutreach",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.sent).toBe(true);
    expect(json.mode).toBe("mock");
    expect(createSentEmail).toHaveBeenCalledOnce();
  });
});

// ── Tests: GET /api/email/sent ─────────────────────────────────────────────

describe("GET /api/email/sent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns array of sent emails with prospect info", async () => {
    vi.mocked(listAllSentEmails).mockResolvedValue([
      {
        id: "email-1",
        prospectId: "prospect-1",
        prospectSlug: "abc-roofing",
        businessName: "ABC Roofing",
        templateId: "coldOutreach",
        toEmail: "owner@abcroofing.com",
        fromEmail: "noreply@prospectforge.io",
        subject: "Test subject",
        bodyHtml: "<p>test</p>",
        bodyText: "test",
        status: "sent",
        providerId: "mock-123",
        sentAt: 1700000000000,
      },
    ] as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveLength(1);
    expect(json[0].prospectSlug).toBe("abc-roofing");
    expect(json[0].businessName).toBe("ABC Roofing");
    expect(json[0].sentAt).toBe(1700000000000);
  });

  it("returns empty array when no emails sent", async () => {
    vi.mocked(listAllSentEmails).mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });
});
