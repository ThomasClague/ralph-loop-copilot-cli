export interface TemplateData {
  businessName: string;
  previewUrl: string;
  agentName: string;
  prospectName?: string;
}

export function coldOutreach(data: TemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `I built a free website for ${data.businessName}`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #1a1a1a;">Hi${data.prospectName ? ` ${data.prospectName}` : ""},</h2>
  <p>I came across <strong>${data.businessName}</strong> and noticed your online presence could use a boost.</p>
  <p>I took the initiative to build a <strong>free, professional website</strong> for your business. You can see it here:</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${data.previewUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Free Website →</a>
  </p>
  <p>No strings attached — if you like it, we can talk about taking it live. If not, no worries at all.</p>
  <p>Best,<br>${data.agentName}</p>
</body>
</html>`;
  const text = `Hi${data.prospectName ? ` ${data.prospectName}` : ""},

I came across ${data.businessName} and noticed your online presence could use a boost.

I took the initiative to build a free, professional website for your business. You can see it here:
${data.previewUrl}

No strings attached — if you like it, we can talk about taking it live. If not, no worries at all.

Best,
${data.agentName}`;
  return { subject, html, text };
}
