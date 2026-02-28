import { NextResponse } from "next/server";
import { listAllSentEmails } from "@/src/db/repository";

export async function GET() {
  try {
    const emails = await listAllSentEmails();
    const result = emails.map((e) => ({
      id: e.id,
      prospectSlug: e.prospectSlug,
      businessName: e.businessName,
      sentAt: e.sentAt,
      subject: e.subject,
      mode: e.status,
      templateId: e.templateId,
      toEmail: e.toEmail,
    }));
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/email/sent]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
