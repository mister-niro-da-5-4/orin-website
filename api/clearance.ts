import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, org, role, intent } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  try {
    await resend.emails.send({
      from: 'Orin LXDS <onboarding@resend.dev>',
      to: 'signal@orinlxds.com',
      subject: `Clearance Request: ${name} — ${role}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #ccc; padding: 32px; border-radius: 8px;">
          <div style="border-left: 3px solid #FF4F00; padding-left: 16px; margin-bottom: 24px;">
            <h2 style="color: #FF4F00; margin: 0 0 4px;">Clearance Request</h2>
            <p style="color: #666; margin: 0; font-size: 12px;">orinlxds.com</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #666; padding: 8px 16px 8px 0; vertical-align: top;">DESIGNATION</td><td style="color: #fff; padding: 8px 0;">${name}</td></tr>
            <tr><td style="color: #666; padding: 8px 16px 8px 0; vertical-align: top;">CLASSIFICATION</td><td style="color: #fff; padding: 8px 0;">${role}</td></tr>
            <tr><td style="color: #666; padding: 8px 16px 8px 0; vertical-align: top;">EMAIL</td><td style="color: #fff; padding: 8px 0;">${email}</td></tr>
            ${org ? `<tr><td style="color: #666; padding: 8px 16px 8px 0; vertical-align: top;">SECTOR</td><td style="color: #fff; padding: 8px 0;">${org}</td></tr>` : ''}
            ${intent ? `<tr><td style="color: #666; padding: 8px 16px 8px 0; vertical-align: top;">INTENT</td><td style="color: #fff; padding: 8px 0;">${intent}</td></tr>` : ''}
          </table>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to send' });
  }
}
