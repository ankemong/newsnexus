import { Resend } from 'resend';

// 初始化 Resend 客户端
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || '');

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 发送基础 HTML 邮件
 */
export const sendEmail = async (options: EmailOptions): Promise<EmailResult> => {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });

    if (error) {
      console.error('邮件发送失败:', error);
      return { success: false, error: error.message };
    }

    console.log('邮件发送成功:', data);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('邮件发送异常:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : '未知错误'
    };
  }
};

/**
 * 发送新闻订阅邮件
 */
export const sendNewsSubscriptionEmail = async (
  recipientEmail: string,
  articles: Array<{
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
  }>
): Promise<EmailResult> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>NewsNexus 每日新闻摘要</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .article {
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 0;
        }
        .article:last-child {
          border-bottom: none;
        }
        .article-title {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .article-title a {
          color: #2563eb;
          text-decoration: none;
        }
        .article-title a:hover {
          text-decoration: underline;
        }
        .article-meta {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NewsNexus 每日新闻摘要</h1>
        <p>为您精选的最新资讯</p>
      </div>

      ${articles.map((article, index) => `
        <div class="article">
          <h2 class="article-title">
            <a href="${article.url}" target="_blank">${article.title}</a>
          </h2>
          <div class="article-meta">
            发布于: ${new Date(article.publishedAt).toLocaleDateString('zh-CN')}
          </div>
          <div class="article-summary">
            ${article.summary}
          </div>
        </div>
      `).join('')}

      <div class="footer">
        <p>您收到此邮件是因为您订阅了 NewsNexus 新闻服务</p>
        <p>如需取消订阅，请访问您的账户设置</p>
        <p>© 2024 NewsNexus. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    from: 'NewsNexus <hi@veyronix.asia>',
    to: recipientEmail,
    subject: `NewsNexus 每日新闻摘要 - ${new Date().toLocaleDateString('zh-CN')}`,
    html: htmlContent,
  });
};

/**
 * 发送欢迎邮件
 */
export const sendWelcomeEmail = async (
  recipientEmail: string,
  userName: string
): Promise<EmailResult> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>欢迎加入 NewsNexus</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #10b981;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>欢迎加入 NewsNexus!</h1>
        <p>您好，${userName}！</p>
      </div>

      <div class="content">
        <p>感谢您注册 NewsNexus，您的智能新闻聚合平台。</p>

        <p>通过 NewsNexus，您可以：</p>
        <ul>
          <li>实时追踪全球新闻动态</li>
          <li>个性化新闻推荐</li>
          <li>多语言内容支持</li>
          <li>智能摘要和翻译</li>
        </ul>

        <div style="text-align: center;">
          <a href="http://localhost:3000" class="button">开始使用 NewsNexus</a>
        </div>

        <p>如果您有任何问题，请随时联系我们的支持团队。</p>
      </div>

      <div class="footer">
        <p>© 2024 NewsNexus. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    from: 'NewsNexus <hi@veyronix.asia>',
    to: recipientEmail,
    subject: '欢迎加入 NewsNexus！',
    html: htmlContent,
  });
};

/**
 * 发送密码重置邮件
 */
export const sendPasswordResetEmail = async (
  recipientEmail: string,
  resetToken: string
): Promise<EmailResult> => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>重置您的 NewsNexus 密码</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #ef4444;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .alert {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #dc2626;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>密码重置请求</h1>
      </div>

      <div class="alert">
        <strong>安全提醒：</strong>如果您没有请求重置密码，请忽略此邮件。
      </div>

      <div class="content">
        <p>我们收到了重置您的 NewsNexus 账户密码的请求。</p>

        <p>点击下面的按钮重置您的密码：</p>

        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">重置密码</a>
        </div>

        <p>或者，您也可以复制以下链接到浏览器：</p>
        <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
          ${resetUrl}
        </p>

        <p><strong>此链接将在 1 小时后失效。</strong></p>
      </div>

      <div class="footer">
        <p>© 2024 NewsNexus. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    from: 'NewsNexus <hi@veyronix.asia>',
    to: recipientEmail,
    subject: '重置您的 NewsNexus 密码',
    html: htmlContent,
  });
};