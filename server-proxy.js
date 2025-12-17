// 服务器端代理，用于解决CORS问题
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3006;

// 配置CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON
app.use(express.json());

// 初始化Resend
const resend = new Resend('re_hqp1vt2N_nsaqF4uc7uSBf7MuxZ4harvr');

// 验证码发送接口
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 保存到数据库
    const supabase = createClient(
      'https://nzrorivjkehhhuomgkbo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cm9yaXZqa2VoaGh1b21na2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDkwODUsImV4cCI6MjA4MDQyNTA4NX0.237_P7wQnvobBKTe2C-goHScYrUba_eZNfALdrZE2l4'
    );

    // 检查60秒内是否已发送
    const { data: recentRequest } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('email', email.toLowerCase())
      .gt('created_at', new Date(Date.now() - 60000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentRequest) {
      return res.status(429).json({ error: '请稍后再试，验证码已发送' });
    }

    // 插入验证码
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: email.toLowerCase(),
        code,
        purpose: 'registration',
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('Error saving verification code:', insertError);
      return res.status(500).json({ error: 'Failed to generate verification code' });
    }

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: 'NewsNexus <noreply@veyronix.asia>',
      to: [email],
      subject: 'NewsNexus - 验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin: 0; font-size: 28px;">NewsNexus</h1>
            <p style="color: #666; margin: 5px 0 0; font-size: 14px;">全球新闻聚合平台</p>
          </div>

          <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">邮箱验证码</h2>

          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            您好！您正在注册 NewsNexus 账户，请使用以下验证码完成注册：
          </p>

          <div style="background: #f8f9fa; border: 2px solid #e9ecef; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #007bff; font-family: monospace;">${code}</span>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>重要提示：</strong><br>
              • 验证码有效期为 <strong>10 分钟</strong><br>
              • 请勿将验证码泄露给他人<br>
              • 如果这不是您的操作，请忽略此邮件
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 40px 0;">

          <div style="color: #6c757d; font-size: 12px; text-align: center;">
            <p style="margin: 0 0 10px;">
              此邮件由 NewsNexus 系统自动发送，请勿回复。
            </p>
            <p style="margin: 0;">
              如需帮助，请联系我们：<a href="mailto:support@veyronix.asia" style="color: #007bff;">support@veyronix.asia</a>
            </p>
            <p style="margin: 10px 0 0;">
              © 2024 NewsNexus. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      // 清理验证码
      await supabase
        .from('verification_codes')
        .delete()
        .eq('email', email.toLowerCase())
        .eq('code', code);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    console.log('Email sent successfully to:', email);

    res.json({
      success: true,
      message: '验证码已发送',
      expiresAt: expiresAt.toISOString(),
      code: code // 仅用于调试
    });
  } catch (error) {
    console.error('Error in /api/send-verification-email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 验证验证码接口
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const supabase = createClient(
      'https://nzrorivjkehhhuomgkbo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cm9yaXZqa2VoaGh1b21na2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDkwODUsImV4cCI6MjA4MDQyNTA4NX0.237_P7wQnvobBKTe2C-goHScYrUba_eZNfALdrZE2l4'
    );

    // 查询验证码
    const { data: verificationRecord } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!verificationRecord) {
      return res.status(400).json({ success: false, error: '验证码无效或已过期' });
    }

    // 标记为已使用
    await supabase
      .from('verification_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', verificationRecord.id);

    res.json({
      success: true,
      message: '验证成功'
    });
  } catch (error) {
    console.error('Error in /api/verify-code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Email proxy server running on port ${port}`);
});