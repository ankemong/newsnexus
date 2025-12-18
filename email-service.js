// 临时的邮件服务模拟
// 使用 Resend API 直接发送验证码邮件

import { Resend } from 'resend';

const resend = new Resend('re_hqp1vt2N_nsaqF4uc7uSBf7MuxZ4harvr');

export async function sendVerificationEmail(email) {
  try {
    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: 'NewsNexus <hi@veyronix.asia>',
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
      return { data: null, error };
    }

    // 将验证码保存到数据库
    const { supabase } = await import('./lib/supabaseClient.js');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
    }

    return {
      data: {
        success: true,
        message: '验证码已发送',
        code: code // 仅用于调试，生产环境中应删除
      },
      error: null
    };
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    return { data: null, error };
  }
}