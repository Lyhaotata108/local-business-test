import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, score, answers, topProblems, name, website, businessType } = req.body;

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const notifyEmail = process.env.NOTIFICATION_EMAIL || smtpEmail;

  if (!smtpEmail || !smtpPassword) {
    return res.status(500).json({ error: 'Email configuration is missing on the server.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const formattedAnswers = Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n');
    const formattedProblems = topProblems?.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n') || 'None';

    const mailOptions = {
      from: smtpEmail,
      to: notifyEmail,
      subject: `New Diagnostic Lead: ${businessType || 'Local Business'} - Score ${score}`,
      text: `
New lead from the Local Business Diagnostic Tool!

Contact Details:
Email: ${email}
Name: ${name || 'N/A'}
Website: ${website || 'N/A'}

Diagnostic Results:
Overall Score: ${score}/100

Top Problems Found:
${formattedProblems}

Full Answers:
${formattedAnswers}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
