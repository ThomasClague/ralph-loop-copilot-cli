import type { TemplateData } from "./coldOutreach";

export function followUp(data: TemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Following up — your free site is still live`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #1a1a1a;">Hi${data.prospectName ? ` ${data.prospectName}` : ""},</h2>
  <p>Just following up on my previous email about the free website I built for <strong>${data.businessName}</strong>.</p>
  <p>The site is still up and ready for you to review:</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${data.previewUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Website →</a>
  </p>
  <p>I'd love to hear your thoughts. If you're interested, I can help get it live quickly. If not, totally understood!</p>
  <p>Best,<br>${data.agentName}</p>
</body>
</html>`;
  const text = `Hi${data.prospectName ? ` ${data.prospectName}` : ""},

Just following up on my previous email about the free website I built for ${data.businessName}.

The site is still up and ready for you to review:
${data.previewUrl}

I'd love to hear your thoughts. If you're interested, I can help get it live quickly. If not, totally understood!

Best,
${data.agentName}`;
  return { subject, html, text };
}
