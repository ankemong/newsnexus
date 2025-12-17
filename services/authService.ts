import { supabase } from '../lib/supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
}

export class AuthService {
  // 登录
  static async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // 使用 Supabase Auth 进行登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { user: null, error: error.message };
      }

      if (data.user) {
        // 获取用户资料信息
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          username: profile?.username,
          avatar_url: profile?.avatar_url,
        };

        return { user, error: null };
      }

      return { user: null, error: '登录失败' };
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return { user: null, error: '登录时发生错误' };
    }
  }

  // 注册（需要验证码）
  static async signUp(email: string, password: string, verificationCode: string, username?: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      // 验证码已在Auth.tsx中验证过，直接进行注册
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error: error.message };
      }

      if (data.user) {
        // 创建用户资料记录
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            username: username || email.split('@')[0],
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          username: username || email.split('@')[0],
        };

        return { user, error: null };
      }

      return { user: null, error: '注册失败' };
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { user: null, error: '注册时发生错误' };
    }
  }

  // 登出
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return { error: '登出时发生错误' };
    }
  }

  // 获取当前用户
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      // 获取用户资料信息
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        username: profile?.username,
        avatar_url: profile?.avatar_url,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // 重置密码
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      return { error: '重置密码时发生错误' };
    }
  }

  // 更新密码
  static async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Update password error:', error);
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during password update:', error);
      return { error: '更新密码时发生错误' };
    }
  }

  // 监听认证状态变化
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}