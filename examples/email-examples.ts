/**
 * NewsNexus 邮件服务使用示例
 *
 * 这些示例展示了如何在项目中使用邮件服务
 */

import {
  sendEmail,
  sendNewsSubscriptionEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from '../services/emailService';
import { Article } from '../types';

// 示例 1: 发送基础 HTML 邮件
export const sendBasicEmailExample = async () => {
  const result = await sendEmail({
    from: 'NewsNexus <hi@veyronix.asia>',
    to: 'user@example.com',
    subject: '测试邮件',
    html: `
      <h1>这是一封测试邮件</h1>
      <p>邮件内容支持 <strong>HTML 格式</strong>。</p>
      <p>发送时间: ${new Date().toLocaleString('zh-CN')}</p>
    `,
  });

  if (result.success) {
    console.log('邮件发送成功，ID:', result.messageId);
  } else {
    console.error('邮件发送失败:', result.error);
  }
};

// 示例 2: 发送新闻订阅邮件
export const sendNewsEmailExample = async () => {
  // 模拟新闻数据
  const articles: Article[] = [
    {
      id: '1',
      title: '人工智能技术取得重大突破',
      source: '科技日报',
      publishedAt: '2024-01-15T10:00:00Z',
      url: 'https://example.com/news/1',
      content: '最新研究显示，AI 在自然语言处理领域...',
      summary: 'AI 技术在自然语言处理方面取得重大进展，新模型性能提升了 30%。',
      language: 'zh',
      category: 'Technology',
      sentiment: 'positive',
    },
    {
      id: '2',
      title: '全球气候峰会达成新协议',
      source: '环球新闻',
      publishedAt: '2024-01-15T09:30:00Z',
      url: 'https://example.com/news/2',
      content: '在为期三天的气候峰会上，各国代表...',
      summary: '全球气候峰会达成减排新协议，承诺 2030 年前碳排放减少 45%。',
      language: 'zh',
      category: 'Environment',
      sentiment: 'neutral',
    },
  ];

  const result = await sendNewsSubscriptionEmail('subscriber@example.com', articles);

  if (result.success) {
    console.log('新闻订阅邮件发送成功');
  } else {
    console.error('发送失败:', result.error);
  }
};

// 示例 3: 发送欢迎邮件
export const sendWelcomeEmailExample = async () => {
  const result = await sendWelcomeEmail('newuser@example.com', '张三');

  if (result.success) {
    console.log('欢迎邮件发送成功');
  } else {
    console.error('发送失败:', result.error);
  }
};

// 示例 4: 发送密码重置邮件
export const sendPasswordResetExample = async () => {
  // 在实际应用中，resetToken 应该是随机生成的唯一标识
  const resetToken = 'reset_' + Math.random().toString(36).substring(2);

  const result = await sendPasswordResetEmail('user@example.com', resetToken);

  if (result.success) {
    console.log('密码重置邮件发送成功');
  } else {
    console.error('发送失败:', result.error);
  }
};

// 示例 5: 批量发送邮件
export const sendBulkEmailsExample = async () => {
  const recipients = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
  ];

  const promises = recipients.map(email =>
    sendEmail({
      from: 'NewsNexus <hi@veyronix.asia>',
      to: email,
      subject: '批量邮件测试',
      html: `<p>这是一封批量发送的测试邮件。</p><p>发送时间: ${new Date().toLocaleString('zh-CN')}</p>`,
    })
  );

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      console.log(`发送到 ${recipients[index]} 成功`);
    } else {
      console.error(`发送到 ${recipients[index]} 失败`);
    }
  });
};

// 示例 6: 发送带附件的邮件
export const sendEmailWithAttachmentExample = async () => {
  const result = await sendEmail({
    from: 'NewsNexus <hi@veyronix.asia>',
    to: 'user@example.com',
    subject: '带附件的邮件',
    html: '<p>请查收附件中的文件。</p>',
    attachments: [
      {
        filename: 'example.txt',
        content: '这是一个文本文件的内容',
        contentType: 'text/plain',
      },
      {
        filename: 'report.pdf',
        content: Buffer.from('PDF 文件内容'), // 实际使用时应该是真实的 PDF 文件内容
        contentType: 'application/pdf',
      },
    ],
  });

  if (result.success) {
    console.log('带附件的邮件发送成功');
  } else {
    console.error('发送失败:', result.error);
  }
};

// 运行所有示例
export const runAllEmailExamples = async () => {
  console.log('开始运行邮件示例...\n');

  try {
    await sendBasicEmailExample();
    console.log('✓ 基础邮件示例完成\n');

    await sendNewsEmailExample();
    console.log('✓ 新闻订阅邮件示例完成\n');

    await sendWelcomeEmailExample();
    console.log('✓ 欢迎邮件示例完成\n');

    await sendPasswordResetExample();
    console.log('✓ 密码重置邮件示例完成\n');

    await sendBulkEmailsExample();
    console.log('✓ 批量邮件示例完成\n');

    await sendEmailWithAttachmentExample();
    console.log('✓ 带附件邮件示例完成\n');

    console.log('所有邮件示例运行完成！');
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
};