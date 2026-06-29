import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json());
const PORT = 3000;

app.post('/api/leads', async (req, res) => {
  const { email, score, answers, topProblems, name, website, businessType } = req.body;

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const notifyEmail = process.env.NOTIFICATION_EMAIL || smtpEmail;

  if (!smtpEmail || !smtpPassword) {
    console.error('Missing SMTP credentials in environment variables.');
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
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
