// 服务器端代理，用于解决CORS问题
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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
const resend = new Resend(process.env.RESEND_API_KEY);

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
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
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
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
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

// 文章内容获取代理接口
app.post('/api/fetch-article-content', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Fetching article content for: ${url}`);

    // 使用fetch获取网页内容
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000 // 10秒超时
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: `Failed to fetch article: ${response.statusText}`
      });
    }

    const html = await response.text();
    console.log(`Successfully fetched ${html.length} characters from ${url}`);

    // 提取文章内容
    let extractedContent = '';

    try {
      // 尝试提取标题
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';

      // 尝试提取主要内容区域
      // 优先尝试常见的文章容器
      const articleSelectors = [
        /<article[^>]*>([\s\S]*?)<\/article>/i,
        /<main[^>]*>([\s\S]*?)<\/main>/i,
        /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
      ];

      let articleContent = '';
      for (const selector of articleSelectors) {
        const match = html.match(selector);
        if (match && match[1].length > 200) {
          articleContent = match[1];
          break;
        }
      }

      // 如果没找到文章容器，尝试提取body内容
      if (!articleContent) {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        articleContent = bodyMatch ? bodyMatch[1] : '';
      }

      // 清理HTML标签和多余空白
      let cleanContent = articleContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // 移除脚本
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // 移除样式
        .replace(/<[^>]*>/g, ' ') // 移除HTML标签
        .replace(/\s+/g, ' ') // 合并空白字符
        .replace(/\n\s*\n/g, '\n') // 移除空行
        .trim();

      // 提取前几个段落作为内容预览
      const paragraphs = cleanContent.split('\n').filter(p => p.length > 20);
      if (paragraphs.length > 0) {
        extractedContent = paragraphs.slice(0, 3).join('\n\n');
      } else {
        extractedContent = cleanContent.substring(0, 1000);
      }

      // 限制内容长度
      if (extractedContent.length > 2000) {
        extractedContent = extractedContent.substring(0, 2000) + '...';
      }

      res.json({
        success: true,
        title: title,
        content: extractedContent || '无法提取文章内容',
        originalLength: html.length,
        extractedLength: extractedContent.length
      });

    } catch (extractionError) {
      console.error('Error extracting content:', extractionError);
      // 如果提取失败，返回原始HTML的清理版本
      const cleanedHtml = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500);

      res.json({
        success: true,
        title: '文章内容',
        content: cleanedHtml || '无法提取文章内容',
        error: 'Content extraction failed'
      });
    }

  } catch (error) {
    console.error('Error in /api/fetch-article-content:', error);
    res.status(500).json({
      error: 'Failed to fetch article content',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Email proxy server running on port ${port}`);
});
