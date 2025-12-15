import { sendEmail } from './emailService';

// 存储验证码的内存缓存（生产环境应使用 Redis 或数据库）
const verificationCache = new Map<string, { code: string; expiresAt: number }>();

// 验证码有效期（10分钟）
const VERIFICATION_CODE_EXPIRY = 10 * 60 * 1000; // 10分钟

/**
 * 生成6位数字验证码
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * 存储验证码
 */
export const storeVerificationCode = (email: string, code: string): void => {
  const expiresAt = Date.now() + VERIFICATION_CODE_EXPIRY;
  verificationCache.set(email, { code, expiresAt });

  // 定期清理过期验证码
  setTimeout(() => {
    const cached = verificationCache.get(email);
    if (cached && cached.expiresAt < Date.now()) {
      verificationCache.delete(email);
    }
  }, VERIFICATION_CODE_EXPIRY + 1000); // 额外1秒延迟
};

/**
 * 验证验证码
 */
export const verifyCode = (email: string, code: string): { valid: boolean; reason?: string } => {
  const cached = verificationCache.get(email);

  if (!cached) {
    return { valid: false, reason: '验证码不存在或已过期' };
  }

  if (cached.expiresAt < Date.now()) {
    verificationCache.delete(email);
    return { valid: false, reason: '验证码已过期' };
  }

  if (cached.code !== code) {
    return { valid: false, reason: '验证码不正确' };
  }

  // 验证成功后删除验证码，防止重复使用
  verificationCache.delete(email);
  return { valid: true };
};

/**
 * 发送验证码邮件
 */
export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const result = await sendEmail({
      from: 'NewsNexus <hi@veyronix.asia>',
      to: email,
      subject: 'NewsNexus 验证码',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>NewsNexus 验证码</title>
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
              background-color: #000;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .code-container {
              background-color: #f3f4f6;
              padding: 30px;
              text-align: center;
              margin: 20px 0;
              border-radius: 8px;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              color: #000;
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
            <h1>NewsNexus</h1>
            <p>您的验证码</p>
          </div>

          <div class="content">
            <p>您好，</p>
            <p>您正在注册 NewsNexus 账户，请使用以下验证码完成注册：</p>

            <div class="code-container">
              <div class="code">${code}</div>
            </div>

            <p><strong>注意事项：</strong></p>
            <ul>
              <li>此验证码有效期为 10 分钟</li>
              <li>请勿将验证码告诉他人</li>
              <li>如果您没有注册账户，请忽略此邮件</li>
            </ul>
          </div>

          <div class="footer">
            <p>© 2024 NewsNexus. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (result.success) {
      storeVerificationCode(email, code);
      return { success: true, messageId: result.messageId };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('发送验证码邮件时出错:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
};

/**
 * 发送密码重置邮件
 */
export const sendPasswordResetVerification = async (
  email: string,
  resetToken: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

  try {
    const result = await sendEmail({
      from: 'NewsNexus <security@veyronix.asia>',
      to: email,
      subject: '重置您的 NewsNexus 密码',
      html: `
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
      `,
    });

    return result.success
      ? { success: true, messageId: result.messageId }
      : { success: false, error: result.error };
  } catch (error) {
    console.error('发送密码重置邮件时出错:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
};

/**
 * 获取验证码状态
 */
export const getVerificationStatus = (email: string): {
  exists: boolean;
  expiresIn?: number; // 剩余秒数
} => {
  const cached = verificationCache.get(email);

  if (!cached) {
    return { exists: false };
  }

  const expiresIn = Math.max(0, Math.floor((cached.expiresAt - Date.now()) / 1000));

  if (expiresIn <= 0) {
    verificationCache.delete(email);
    return { exists: false };
  }

  return { exists: true, expiresIn };
};

/**
 * 清理所有过期验证码
 */
export const cleanupExpiredCodes = (): number => {
  let removedCount = 0;
  const now = Date.now();

  for (const [email, { expiresAt }] of verificationCache.entries()) {
    if (expiresAt < now) {
      verificationCache.delete(email);
      removedCount++;
    }
  }

  return removedCount;
};