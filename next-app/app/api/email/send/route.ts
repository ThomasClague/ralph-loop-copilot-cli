import { NextRequest, NextResponse } from "next/server";
import { getProspectBySlug, createSentEmail } from "@/src/db/repository";
import { getEmailService } from "@/src/lib/email/factory";
import { TEMPLATES } from "@/src/lib/email/templates";
import type { TemplateId } from "@/src/lib/email/templates";

interface SendEmailBody {
  prospectSlug: string;
  templateId: string;
  subject?: string;
  previewText?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendEmailBody;
    const { prospectSlug, templateId, subject: customSubject } = body;

    if (!prospectSlug || !templateId) {
      return NextResponse.json(
        { error: "prospectSlug and templateId are required" },
        { status: 400 },
      );
    }

    const prospect = await getProspectBySlug(prospectSlug);
    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect not found" },
        { status: 404 },
      );
    }

    const templateFn = TEMPLATES[templateId as TemplateId];
    if (!templateFn) {
      return NextResponse.json(
        { error: `Template '${templateId}' not found` },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const templateData = {
      businessName: prospect.businessName,
      previewUrl: `${baseUrl}/preview/${prospect.slug}`,
      agentName: "The Team",
    };

    const rendered = templateFn(templateData);
    const finalSubject = customSubject ?? rendered.subject;

    const emailService = await getEmailService();
    const to = prospect.email ?? "";
    if (!to) {
      return NextResponse.json(
        { error: "Prospect has no email address" },
        { status: 422 },
      );
    }

    const result = await emailService.send({
      to,
      subject: finalSubject,
      html: rendered.html,
      text: rendered.text,
    });

    await createSentEmail({
      id: crypto.randomUUID(),
      prospectId: prospect.id,
      templateId,
      toEmail: to,
      fromEmail: "noreply@prospectforge.io",
      subject: finalSubject,
      bodyHtml: rendered.html,
      bodyText: rendered.text ?? "",
      status: result.success ? "sent" : "failed",
      providerId: result.messageId ?? null,
      sentAt: Date.now(),
    });

    return NextResponse.json({ sent: result.success, mode: result.mode });
  } catch (err) {
    console.error("[POST /api/email/send]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
