import { createClient } from '@supabase/supabase-js';

// 从环境变量获取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 如果没有配置 Supabase，警告用户
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured. Please check your environment variables.');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Edge Functions URL
export const EDGE_FUNCTIONS_BASE_URL = `${supabaseUrl}/functions/v1`;

// Edge Function 调用函数
export const callEdgeFunction = async <T = any>(
  functionName: string,
  body: any,
  options?: {
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
  }
): Promise<{ data: T | null; error: any }> => {
  try {
    const response = await fetch(
      `${EDGE_FUNCTIONS_BASE_URL}/${functionName}`,
      {
        method: options?.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          ...options?.headers,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: null,
        error: {
          status: response.status,
          message: errorText,
        },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

// 邮件服务相关的 Edge Function 调用
export const emailService = {
  // 发送验证码邮件
  sendVerificationEmail: async (email: string) => {
    try {
      // 优先尝试使用 Edge Function
      const response = await fetch(
        `${EDGE_FUNCTIONS_BASE_URL}/send-verification-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return { data, error: null };
      }

      // 如果 Edge Function 失败，使用备用方案
      console.warn('Edge Function failed, using fallback method');
      const { sendVerificationEmail: fallbackSend } = await import('../email-service.js');
      return await fallbackSend(email);
    } catch (error) {
      console.error('Error calling send-verification-email function:', error);

      // 使用备用方案
      try {
        const { sendVerificationEmail: fallbackSend } = await import('../email-service.js');
        return await fallbackSend(email);
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        return {
          data: null,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    }
  },

  // 验证验证码
  verifyCode: async (email: string, code: string) => {
    try {
      // 优先尝试使用 Edge Function
      const response = await fetch(
        `${EDGE_FUNCTIONS_BASE_URL}/verify-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email, code }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return { data, error: null };
      }

      // 如果 Edge Function 失败，直接查询数据库
      console.warn('Edge Function failed, verifying directly from database');
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
        return {
          data: { success: false, error: '验证码无效或已过期' },
          error: null
        };
      }

      // 标记为已使用
      await supabase
        .from('verification_codes')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', verificationRecord.id);

      return {
        data: { success: true, message: '验证成功' },
        error: null
      };
    } catch (error) {
      console.error('Error in verifyCode:', error);

      // 直接查询数据库作为备用方案
      try {
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
          return {
            data: { success: false, error: '验证码无效或已过期' },
            error: null
          };
        }

        // 标记为已使用
        await supabase
          .from('verification_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', verificationRecord.id);

        return {
          data: { success: true, message: '验证成功' },
          error: null
        };
      } catch (dbError) {
        return {
          data: null,
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    }
  },

  // 发送欢迎邮件
  sendWelcomeEmail: async (email: string, userName: string) => {
    try {
      const response = await fetch(
        `${EDGE_FUNCTIONS_BASE_URL}/send-welcome-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email, userName }),
        }
      );

      const data = await response.json();
      return { data, error: response.ok ? null : data };
    } catch (error) {
      console.error('Error calling send-welcome-email function:', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },

  // 发送密码重置邮件
  sendPasswordResetEmail: async (email: string, resetToken: string) => {
    try {
      const response = await fetch(
        `${EDGE_FUNCTIONS_BASE_URL}/send-password-reset-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email, resetToken }),
        }
      );

      const data = await response.json();
      return { data, error: response.ok ? null : data };
    } catch (error) {
      console.error('Error calling send-password-reset-email function:', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
};

// 数据库操作相关函数
export const dbService = {
  // 创建用户
  createUser: async (userData: {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
  }) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    return { data, error };
  },

  // 获取用户
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  },

  // 通过邮箱获取用户
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    return { data, error };
  },

  // 更新用户
  updateUser: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    return { data, error };
  },

  // 检查验证码状态
  checkVerificationStatus: async (email: string) => {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('expires_at')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { data, error };
  },

  // 清理过期验证码
  cleanupExpiredCodes: async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('verification_codes')
      .delete()
      .lt('expires_at', now);

    return { data, error };
  },
};