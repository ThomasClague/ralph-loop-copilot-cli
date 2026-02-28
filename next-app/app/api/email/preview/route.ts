import { NextRequest, NextResponse } from "next/server";
import { getProspectBySlug } from "@/src/db/repository";
import { TEMPLATES } from "@/src/lib/email/templates";
import type { TemplateId } from "@/src/lib/email/templates";

/**
 * GET /api/email/preview?prospectSlug=...&templateId=...
 * Renders an email template with interpolated variables for a given prospect.
 * Returns { subject, html, text } without sending anything.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const prospectSlug = searchParams.get("prospectSlug");
  const templateId = searchParams.get("templateId");

  if (!prospectSlug || !templateId) {
    return NextResponse.json(
      { error: "prospectSlug and templateId are required" },
      { status: 400 },
    );
  }

  const prospect = await getProspectBySlug(prospectSlug);
  if (!prospect) {
    return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
  }

  const templateFn = TEMPLATES[templateId as TemplateId];
  if (!templateFn) {
    return NextResponse.json(
      { error: `Template '${templateId}' not found` },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const rendered = templateFn({
    businessName: prospect.businessName,
    previewUrl: `${baseUrl}/preview/${prospect.slug}`,
    agentName: "The Team",
  });

  return NextResponse.json({
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
