// 服务器端代理，用于解决CORS问题
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3006;

// 配置CORS
app.use(cors({
  origin: ['http://localhost:3000' 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005'],
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

    // 发送邮件 - 使用纯文本避免垃圾邮件过滤
    const { data, error } = await resend.emails.send({
      from: 'NewsNexus <hi@veyronix.asia>',
      to: [email],
      subject: 'NewsNexus验证码',
      text: `NewsNexus 邮箱验证码

验证码：${code}

此验证码10分钟内有效。

如果这不是您的操作，请忽略此邮件。

---
NewsNexus
全球新闻聚合平台
support@veyronix.asia`
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));

      // 删除已插入的验证码记录，因为邮件发送失败
      await supabase
        .from('verification_codes')
        .delete()
        .eq('email', email.toLowerCase())
        .eq('code', code);

      return res.status(500).json({
        error: 'Failed to send verification email',
        details: error.message
      });
    }

    console.log('Email sent successfully to:', email);

    res.json({
      success: true,
      message: '验证码已发送',
      expiresAt: expiresAt.toISOString()
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
