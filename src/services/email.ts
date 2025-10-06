/**
 * Email Service
 * Handles transactional email sending via Resend with React Email templates
 */

import { render } from '@react-email/components';
import TestCompleteEmail from '@/emails/TestCompleteEmail';
import PaymentConfirmationEmail from '@/emails/PaymentConfirmationEmail';
import InvitationEmail from '@/emails/InvitationEmail';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, email not sent');
    return;
  }

  const fromEmail = from || process.env.FROM_EMAIL || 'auswertung@noba-experts.de';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

/**
 * Send test completion email with results link
 */
export async function sendTestCompleteEmail(
  email: string,
  testId: string,
  userName?: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const reportUrl = `${baseUrl}/report/${testId}`;

  const html = await render(
    TestCompleteEmail({
      userName: userName || 'Teilnehmer',
      testId,
      reportUrl,
    })
  );

  await sendEmail({
    to: email,
    subject: 'Ihr Big Five Test ist abgeschlossen!',
    html,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  testId: string,
  userName?: string,
  amount?: string,
  invoiceUrl?: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const reportUrl = `${baseUrl}/report/${testId}`;

  const html = await render(
    PaymentConfirmationEmail({
      userName: userName || 'Kunde',
      testId,
      amount: amount || '49,00 €',
      reportUrl,
      invoiceUrl,
      date: new Date().toLocaleDateString('de-DE'),
    })
  );

  await sendEmail({
    to: email,
    subject: 'Zahlungsbestätigung - NOBA EXPERTS Premium',
    html,
  });
}

/**
 * Send employee invitation email (B2B)
 */
export async function sendEmployeeInvitation(
  email: string,
  employeeName: string,
  companyName: string,
  inviterName: string,
  invitationToken: string,
  expiresAt: Date
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const invitationUrl = `${baseUrl}/invite/${invitationToken}`;

  const html = await render(
    InvitationEmail({
      employeeName,
      companyName,
      inviterName,
      invitationUrl,
      expiresAt: expiresAt.toLocaleDateString('de-DE'),
    })
  );

  await sendEmail({
    to: email,
    subject: `Einladung zum Persönlichkeitstest von ${companyName}`,
    html,
  });
}
