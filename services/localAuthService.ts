export interface User {
  id: string;
  email: string;
  password: string; // 实际项目中应该存储哈希值
  username?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class LocalAuthService {
  private static instance: LocalAuthService;
  private users: User[] = [];
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'newsnexus_users';
  private readonly CURRENT_USER_KEY = 'newsnexus_current_user';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): LocalAuthService {
    if (!LocalAuthService.instance) {
      LocalAuthService.instance = new LocalAuthService();
    }
    return LocalAuthService.instance;
  }

  private loadFromStorage() {
    try {
      // 加载用户列表
      const usersData = localStorage.getItem(this.STORAGE_KEY);
      if (usersData) {
        this.users = JSON.parse(usersData);
      }

      // 加载当前用户
      const currentUserData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (currentUserData) {
        this.currentUser = JSON.parse(currentUserData);
      }
    } catch (error) {
      console.error('Failed to load auth data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
      if (this.currentUser) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    } catch (error) {
      console.error('Failed to save auth data to storage:', error);
    }
  }

  // 注册新用户
  async register(email: string, password: string, username?: string): Promise<{ success: boolean; error?: string }> {
    // 检查邮箱是否已存在
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: '该邮箱已被注册' };
    }

    // 创建新用户
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password, // 实际项目中应该加密存储
      username: username || email.split('@')[0],
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveToStorage();

    return { success: true };
  }

  // 登录
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    const user = this.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: '邮箱或密码错误' };
    }

    // 更新最后登录时间
    user.last_login = new Date().toISOString();
    this.currentUser = user;
    this.saveToStorage();

    return { success: true, user };
  }

  // 登出
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // 获取当前用户
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // 发送验证码（模拟）
  async sendVerificationCode(email: string): Promise<{ success: boolean; error?: string }> {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在实际项目中，这里会调用邮件服务
    console.log(`模拟发送验证码到: ${email}`);

    return { success: true };
  }

  // 验证验证码（模拟）
  async verifyCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    // 模拟验证码验证
    // 在演示中，任何6位数字都视为有效
    if (/^\d{6}$/.test(code)) {
      return { success: true };
    }
    return { success: false, error: '验证码错误' };
  }

  // 重置密码
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: '用户不存在' };
    }

    user.password = newPassword;
    this.saveToStorage();

    return { success: true };
  }

  // 获取所有用户（管理功能）
  getAllUsers(): User[] {
    return this.users;
  }

  // 删除用户（管理功能）
  deleteUser(userId: string): boolean {
    const index = this.users.findIndex(u => u.id === userId);
    if (index > -1) {
      this.users.splice(index, 1);
      if (this.currentUser?.id === userId) {
        this.logout();
      }
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // 更新用户信息
  updateUser(userId: string, updates: Partial<User>): { success: boolean; error?: string } {
    const user = this.users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: '用户不存在' };
    }

    Object.assign(user, updates);

    if (this.currentUser?.id === userId) {
      this.currentUser = user;
    }

    this.saveToStorage();
    return { success: true };
  }
}

// 导出单例实例
const authService = LocalAuthService.getInstance();

// 导出服务函数
export const registerUser = authService.register.bind(authService);
export const loginUser = authService.login.bind(authService);
export const logoutUser = authService.logout.bind(authService);
export const getCurrentUser = authService.getCurrentUser.bind(authService);
export const isAuthenticated = authService.isAuthenticated.bind(authService);
export const sendVerificationCode = authService.sendVerificationCode.bind(authService);
export const verifyCode = authService.verifyCode.bind(authService);
export const resetPassword = authService.resetPassword.bind(authService);
export const updateUserProfile = authService.updateUser.bind(authService);

// 为了兼容性，创建一个 emailService 对象
export const emailService = {
  sendVerificationEmail: async (email: string) => {
    const result = await authService.sendVerificationCode(email);
    if (result.success) {
      return { data: { success: true }, error: null };
    }
    return { data: null, error: result.error };
  },
  verifyCode: async (email: string, code: string) => {
    const result = await authService.verifyCode(email, code);
    if (result.success) {
      return { data: { success: true }, error: null };
    }
    return { data: null, error: result.error };
  },
  sendPasswordResetEmail: async (email: string, resetToken: string) => {
    // 模拟发送密码重置邮件
    console.log(`模拟发送密码重置邮件到: ${email}, token: ${resetToken}`);
    return { data: { success: true }, error: null };
  },
  sendWelcomeEmail: async (email: string, userName: string) => {
    // 模拟发送欢迎邮件
    console.log(`模拟发送欢迎邮件到: ${email}, 用户名: ${userName}`);
    return { data: { success: true }, error: null };
  }
};