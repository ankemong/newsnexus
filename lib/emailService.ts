import { ViteDevServer, createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

// Simple email service using SMTP
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_USER || 'resend',
      pass: process.env.SMTP_PASSWORD || process.env.RESEND_API_KEY,
    },
  });
};

// Store verification codes - In production, use Redis or database
const verificationCodes = new Map<string, { code: string; expiresAt: Date }>();

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// API Routes for email functionality
export const configureEmailAPI = (server: ViteDevServer) => {
  server.middlewares.use('/api/send-verification', async (req, res, next) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end();
      return;
    }

    try {
      const body = await new Promise<any>((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({});
          }
        });
      });

      const { email } = body;
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email address' }));
        return;
      }

      // Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store code
      verificationCodes.set(email.toLowerCase(), { code, expiresAt });

      // Send email
      const transporter = createEmailTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'hi@newsnexus.app',
        to: email,
        subject: 'NewsNexus - 验证码',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">NewsNexus 验证码</h2>
            <p>您好！</p>
            <p>您正在注册 NewsNexus 账户，您的验证码是：</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${code}</span>
            </div>
            <p>验证码有效期为 10 分钟。如果这不是您的操作，请忽略此邮件。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              此邮件由 NewsNexus 自动发送，请勿回复。<br>
              如有疑问，请联系我们的客服团队。
            </p>
          </div>
        `,
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: '验证码已发送',
        expiresAt: expiresAt.toISOString()
      }));
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Failed to send verification email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  });

  server.middlewares.use('/api/verify-code', async (req, res, next) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end();
      return;
    }

    try {
      const body = await new Promise<any>((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({});
          }
        });
      });

      const { email, code } = body;
      if (!email || !code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Email and code are required' }));
        return;
      }

      // Check code
      const stored = verificationCodes.get(email.toLowerCase());
      if (!stored) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '验证码无效或已过期' }));
        return;
      }

      if (stored.expiresAt < new Date()) {
        verificationCodes.delete(email.toLowerCase());
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '验证码已过期' }));
        return;
      }

      if (stored.code !== code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '验证码错误' }));
        return;
      }

      // Clear used code
      verificationCodes.delete(email.toLowerCase());

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: '验证成功' }));
    } catch (error) {
      console.error('Error verifying code:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to verify code' }));
    }
  });
};