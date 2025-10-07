/**
 * Email sending utilities using Resend
 */

interface InvitationEmailParams {
  to: string;
  firstName: string;
  companyName: string;
  invitationUrl: string;
}

export async function sendInvitationEmail(params: InvitationEmailParams): Promise<void> {
  const { to, firstName, companyName, invitationUrl } = params;

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const fromEmail = process.env.FROM_EMAIL || 'noreply@noba-experts.de';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Persönlichkeitstest Einladung</h1>
    </div>
    <div class="content">
      <p>Hallo ${firstName || 'dort'},</p>

      <p><strong>${companyName}</strong> lädt Sie ein, an unserem wissenschaftlichen Big Five Persönlichkeitstest teilzunehmen.</p>

      <p>Dieser Test hilft Ihnen:</p>
      <ul>
        <li>Ihre Stärken und Entwicklungsbereiche zu erkennen</li>
        <li>Ihr Führungspotenzial zu verstehen</li>
        <li>Karriereempfehlungen basierend auf Ihrer Persönlichkeit zu erhalten</li>
      </ul>

      <p>Der Test dauert etwa 10-15 Minuten.</p>

      <p style="text-align: center;">
        <a href="${invitationUrl}" class="button">Test jetzt starten</a>
      </p>

      <p><small>Dieser Link ist 7 Tage gültig.</small></p>
    </div>
    <div class="footer">
      <p>© 2025 NOBA EXPERTS - Big Five Personality Assessment</p>
      <p>Falls Sie Fragen haben, wenden Sie sich an ${companyName}.</p>
    </div>
  </div>
</body>
</html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: `${companyName} - Einladung zum Persönlichkeitstest`,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  const data = await response.json();
  console.log(`Email sent to ${to}:`, data.id);
}
