
import { Language } from './types';

interface TranslationStructure {
  nav: {
    dashboard: string;
    crawler: string;
    myCrawls: string;
    subscriptions: string;
    articles: string;
    analytics: string;
    notifications: string;
    profile: string;
    payment: string;
    logout: string;
  };
  common: {
    searchPlaceholder: string;
    welcome: string;
    back: string;
    save: string;
    cancel: string;
    loading: string;
    delete: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  dashboard: {
    totalArticles: string;
    activeCrawlers: string;
    avgTime: string;
    readership: string;
    acquisitionVolume: string;
    interestTrends: string;
    liveFeed: string;
    topSources: string;
    vsLastWeek: string;
    topicTech: string;
    topicPolitics: string;
    topicFinance: string;
    topicHealth: string;
    topicScience: string;
    topicSports: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    forgotTitle: string;
    forgotSubtitle: string;
    resetTitle: string;
    resetSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    submitLogin: string;
    submitRegister: string;
    forgotPasswordLink: string;
    noAccount: string;
    hasAccount: string;
    signupAction: string;
    loginAction: string;
    backToHome: string;
    sendLink: string;
    resetBtn: string;
    emailRequired: string;
    passwordRequired: string;
    passwordMismatch: string;
    rememberMe: string;
    captcha: string;
    captchaPlaceholder: string;
    captchaError: string;
    sendCode: string;
    codeSent: string;
    developerLogin: string;
    or: string;
    google: string;
    wechat: string;
    emailSendFailed: string;
    invalidEmail: string;
    passwordTooShort: string;
    verificationCodeFormat: string;
    emailAlreadyRegistered: string;
    verificationFailed: string;
    registrationFailed: string;
    operationFailed: string;
    codeSentToEmail: string;
    codeValidFor: string;
    sending: string;
    processing: string;
  };
  crawler: {
    title: string;
    inputPlaceholder: string;
    startTracking: string;
    targetLang: string;
    activeTrackers: string;
    keywordCol: string;
    langsCol: string;
    articlesCol: string;
    statusCol: string;
    actionsCol: string;
    trendTitle: string;
    trendDesc: string;
    latestResults: string;
    setupTime: string;
    statusActive: string;
    statusPaused: string;
    statusCompleted: string;
    results: string;
    retrievingContent: string;
    snippetMode: string;
  };
  myCrawls: {
    title: string;
    desc: string;
    noData: string;
    source: string;
  };
  home: {
    headline: string;
    sub: string;
    cta: string;
    trending: string;
    trial: string;
    noCard: string;
    featureSectionTitle: string;
    featureSectionSub: string;
    featureCrawlerDesc: string;
    featureDashboardDesc: string;
    featureSecurityTitle: string;
    featureSecurityDesc: string;
    demoNewsTitle: string;
    demoNewsDesc: string;
    footerRights: string;
    footerDesc: string;
    privacy: string;
    terms: string;
    contact: string;
    headerProduct: string;
    headerResources: string;
    headerLegal: string;
    linkApi: string;
    linkDocs: string;
    linkBlog: string;
    linkCommunity: string;
    linkHelp: string;
    linkCookie: string;
    v2: string;
    trusted: string;
    encryption: string;
    liveTag: string;
    demoTime: string;
  };
  articles: {
    title: string;
    detail: string;
    search: string;
    filter: string;
    allLangs: string;
    readMore: string;
    summary: string;
    summarize: string;
    readFull: string;
    generating: string;
    processing: string;
    back: string;
    similar: string;
    popularity: string;
    translate: string;
    translating: string;
    showOriginal: string;
    translationError: string;
    startDate: string;
    endDate: string;
    allSentiments: string;
    positive: string;
    neutral: string;
    negative: string;
  };
  subscriptions: {
    title: string;
    desc: string;
    subscribe: string;
    verifying: string;
    logs: string;
    healthy: string;
    error: string;
    feedUpdates: string;
    allSources: string;
    last24h: string;
    last7d: string;
    last30d: string;
    view: string;
    visit: string;
    download: string;
    formats: {
        json: string;
        csv: string;
        txt: string;
    }
  };
  profile: {
    title: string;
    changeAvatar: string;
    displayName: string;
    language: string;
    timezone: string;
    security: string;
    twoFactor: string;
    data: string;
    download: string;
  };
  pricing: {
    monthly: string;
    quarterly: string;
    biannual: string;
    yearly: string;
    saveText: string;
    perMonth: string;
    perQuarter: string;
    perHalfYear: string;
    perYear: string;
    requestsLabel: string;
    articlesLabel: string;
    basicPlan: string;
    proPlan: string;
    enterprisePlan: string;
    currentPlan: string;
    upgrade: string;
    contactSales: string;
    mostPopular: string;
  };
}

const en: TranslationStructure = {
  nav: {
    dashboard: 'Dashboard',
    crawler: 'Keyword Subscription',
    myCrawls: 'My Crawls',
    subscriptions: 'URL Subscriptions',
    articles: 'Article Feed',
    analytics: 'Analytics',
    notifications: 'Notifications',
    profile: 'My Account',
    payment: 'Billing & Plans',
    logout: 'Sign Out'
  },
  common: {
    searchPlaceholder: 'Quick search...',
    welcome: 'Welcome',
    back: 'Back',
    save: 'Save Changes',
    cancel: 'Cancel',
    loading: 'Loading...',
    delete: 'Delete',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun'
  },
  dashboard: {
    totalArticles: 'Total Articles',
    activeCrawlers: 'Active Searches',
    avgTime: 'Avg. Processing Time',
    readership: 'Readership',
    acquisitionVolume: 'Content Acquisition Volume',
    interestTrends: 'Interest Trends',
    liveFeed: 'Real-time System Feed',
    topSources: 'Top News Sources',
    vsLastWeek: 'vs last week',
    topicTech: 'Tech',
    topicPolitics: 'Politics',
    topicFinance: 'Finance',
    topicHealth: 'Health',
    topicScience: 'Science',
    topicSports: 'Sports'
  },
  auth: {
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Enter your credentials to access the news dashboard.',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join thousands of users tracking global events.',
    forgotTitle: 'Recover Password',
    forgotSubtitle: 'We will send you a recovery link.',
    resetTitle: 'Reset Password',
    resetSubtitle: 'Enter your new password below.',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submitLogin: 'Sign In',
    submitRegister: 'Create Account',
    forgotPasswordLink: 'Forgot password?',
    noAccount: "Don't have an account? ",
    hasAccount: "Already have an account? ",
    signupAction: 'Sign up',
    loginAction: 'Log in',
    backToHome: 'Back to Home',
    sendLink: 'Send Link',
    resetBtn: 'Reset Password',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    passwordMismatch: 'Passwords do not match',
    rememberMe: 'Remember me',
    captcha: 'Verification Code',
    captchaPlaceholder: 'Enter code',
    captchaError: 'Incorrect verification code',
    sendCode: 'Send Code',
    codeSent: 'Code Sent',
    developerLogin: 'Developer Quick Login',
    or: 'Or continue with',
    google: 'Google',
    wechat: 'WeChat',
    emailSendFailed: 'Failed to send email, please try again',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    verificationCodeFormat: 'Please enter 6-digit verification code',
    emailAlreadyRegistered: 'This email is already registered, please login',
    verificationFailed: 'Verification failed, please try again',
    registrationFailed: 'Registration failed, please try again later',
    operationFailed: 'Operation failed, please try again',
    codeSentToEmail: 'Verification code has been sent to your email',
    codeValidFor: 'Verification code is valid for 10 minutes',
    sending: 'Sending',
    processing: 'Processing'
  },
  crawler: {
    title: 'Keyword Subscription',
    inputPlaceholder: "Enter topic or keyword (e.g., 'EV Markets')",
    startTracking: 'Subscribe',
    targetLang: 'Target Languages',
    activeTrackers: 'Active Searches',
    keywordCol: 'Keyword',
    langsCol: 'Langs',
    articlesCol: 'Articles',
    statusCol: 'Status',
    actionsCol: 'Actions',
    trendTitle: 'Topic Trend Analysis',
    trendDesc: 'Mentions of selected topics over the last 7 days.',
    latestResults: 'Subscribed Keywords List',
    setupTime: 'Setup Time',
    statusActive: 'Active',
    statusPaused: 'Paused',
    statusCompleted: 'Completed',
    results: 'results',
    retrievingContent: 'Retrieving full article content via AI...',
    snippetMode: 'Content is displayed in snippet mode.'
  },
  myCrawls: {
    title: 'My Crawled Articles',
    desc: 'Articles found and saved from your keyword searches.',
    noData: 'No crawled articles yet. Use the Keyword Search to find articles.',
    source: 'Source'
  },
  home: {
    headline: "Global News at Your Fingertips.",
    sub: "Monitor global events in 18 languages. Aggregate RSS, APIs, and HTML sources into one unified dashboard.",
    cta: "Start Using",
    trending: "Trending Headlines",
    trial: "Instant Access",
    noCard: "No credit card required",
    featureSectionTitle: "Everything you need to stay ahead",
    featureSectionSub: "Comprehensive tools for journalists, analysts, and information junkies.",
    featureCrawlerDesc: "Input keywords and let our system search sources across 18 languages to find relevant articles instantly.",
    featureDashboardDesc: "Visualize trends, sentiment, and coverage volume with real-time analytics and custom charts.",
    featureSecurityTitle: "Enterprise Security",
    featureSecurityDesc: "Bank-grade encryption, 2FA, and GDPR compliant data handling for your peace of mind.",
    demoNewsTitle: "Global semiconductor supply chain stabilizes as new factories open in Arizona",
    demoNewsDesc: "Analysis shows a 15% increase in chip output, signaling an end to the shortage that plagued the auto industry...",
    footerRights: "All rights reserved.",
    footerDesc: "Empowering professionals with real-time global intelligence.",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    headerProduct: "Product",
    headerResources: "Resources",
    headerLegal: "Legal",
    linkApi: "API Access",
    linkDocs: "Documentation",
    linkBlog: "Blog",
    linkCommunity: "Community",
    linkHelp: "Help Center",
    linkCookie: "Cookie Policy",
    v2: "v2.0 NOW AVAILABLE",
    trusted: "TRUSTED BY INDUSTRY LEADERS",
    encryption: "ENCRYPTION_ACTIVE",
    liveTag: "LIVE",
    demoTime: "2 hrs ago"
  },
  articles: {
    title: 'Article Feed',
    detail: 'Article Detail',
    search: 'Search across articles...',
    filter: 'Filters:',
    allLangs: 'All Languages',
    readMore: 'Read More',
    summary: 'Summary Assistant',
    summarize: 'Summarize Article',
    readFull: 'Read Full Article',
    generating: 'Generating Content...',
    processing: 'Processing...',
    back: 'Back to Feed',
    similar: 'Similar Articles',
    popularity: 'Topic Popularity',
    translate: 'Translate',
    translating: 'Translating...',
    showOriginal: 'Show Original',
    translationError: 'Translation failed',
    startDate: 'Start Date',
    endDate: 'End Date',
    allSentiments: 'All Sentiments',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative'
  },
  subscriptions: {
    title: 'Subscribe to News Source',
    desc: 'Enter any URL. We automatically detect RSS feeds, APIs, or standard HTML pages.',
    subscribe: 'Subscribe',
    verifying: 'Verifying...',
    logs: 'Crawl Logs',
    healthy: 'Healthy',
    error: 'Error',
    feedUpdates: 'Feed Updates',
    allSources: 'All Sources',
    last24h: 'Last 24 Hours',
    last7d: 'Last 7 Days',
    last30d: 'Last 30 Days',
    view: 'View Online',
    visit: 'Go to Website',
    download: 'Download',
    formats: {
        json: 'JSON',
        csv: 'CSV',
        txt: 'TXT'
    }
  },
  profile: {
    title: 'My Account',
    changeAvatar: 'Change Avatar',
    displayName: 'Display Name',
    language: 'Interface Language',
    timezone: 'Timezone',
    security: 'Security',
    twoFactor: 'Two-Factor Authentication',
    data: 'Your Data',
    download: 'Download Personal Data'
  },
  pricing: {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    biannual: 'Semi-Annual',
    yearly: 'Yearly',
    saveText: 'Save',
    perMonth: '/mo',
    perQuarter: '/qtr',
    perHalfYear: '/6mo',
    perYear: '/yr',
    requestsLabel: 'Search Requests/mo',
    articlesLabel: 'Articles/mo',
    basicPlan: 'Basic',
    proPlan: 'Pro',
    enterprisePlan: 'Enterprise',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade',
    contactSales: 'Contact Sales',
    mostPopular: 'Most Popular'
  }
};

const zh: TranslationStructure = {
  ...en,
  nav: {
    dashboard: '仪表板',
    crawler: '关键词订阅',
    myCrawls: '我的爬取',
    subscriptions: 'URL 订阅',
    articles: '新闻文章',
    analytics: '数据分析',
    notifications: '通知中心',
    profile: '我的账户',
    payment: '订阅计划',
    logout: '退出登录'
  },
  myCrawls: {
    title: '我的爬取文章',
    desc: '从关键词搜索中发现并保存的文章。',
    noData: '暂无爬取文章。请使用关键词搜索查找文章。',
    source: '来源'
  },
  common: {
    searchPlaceholder: '快速搜索...',
    welcome: '欢迎',
    back: '返回',
    save: '保存更改',
    cancel: '取消',
    loading: '加载中...',
    delete: '删除',
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日'
  },
  dashboard: {
    totalArticles: '文章总数',
    activeCrawlers: '活跃搜索',
    avgTime: '平均处理时间',
    readership: '阅读量',
    acquisitionVolume: '内容获取量',
    interestTrends: '兴趣趋势',
    liveFeed: '实时系统动态',
    topSources: '顶级新闻源',
    vsLastWeek: '较上周',
    topicTech: '科技',
    topicPolitics: '政治',
    topicFinance: '金融',
    topicHealth: '健康',
    topicScience: '科学',
    topicSports: '体育'
  },
  auth: {
    loginTitle: '欢迎回来',
    loginSubtitle: '请输入您的凭据以访问新闻仪表板。',
    registerTitle: '创建账户',
    registerSubtitle: '加入成千上万追踪全球事件的用户行列。',
    forgotTitle: '找回密码',
    forgotSubtitle: '我们将向您发送恢复链接。',
    resetTitle: '重置密码',
    resetSubtitle: '在下方输入您的新密码。',
    email: '电子邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    submitLogin: '登录',
    submitRegister: '注册',
    forgotPasswordLink: '忘记密码？',
    noAccount: "还没有账户？",
    hasAccount: "已经有账户？",
    signupAction: '注册',
    loginAction: '登录',
    backToHome: '返回首页',
    sendLink: '发送链接',
    resetBtn: '重置密码',
    emailRequired: '请输入电子邮箱',
    passwordRequired: '请输入密码',
    passwordMismatch: '两次输入的密码不一致',
    rememberMe: '记住我',
    captcha: '验证码',
    captchaPlaceholder: '输入验证码',
    captchaError: '验证码错误',
    sendCode: '发送验证码',
    codeSent: '验证码已发送',
    developerLogin: '开发者一键登录',
    or: '或通过以下方式继续',
    google: 'Google',
    wechat: '微信',
    emailSendFailed: '邮件发送失败，请稍后重试',
    invalidEmail: '请输入有效的邮箱地址',
    passwordTooShort: '密码至少需要6个字符',
    verificationCodeFormat: '请输入6位数字验证码',
    emailAlreadyRegistered: '该邮箱已被注册，请直接登录',
    verificationFailed: '验证码验证失败，请重试',
    registrationFailed: '注册失败，请稍后重试',
    operationFailed: '操作失败，请稍后重试',
    codeSentToEmail: '验证码已发送到您的邮箱，请查收邮件并输入验证码',
    codeValidFor: '验证码有效期为10分钟',
    sending: '发送中',
    processing: '处理中'
  },
  crawler: {
    title: '关键词订阅',
    inputPlaceholder: "输入主题或关键词 (例如: '电动汽车')",
    startTracking: '开始订阅',
    targetLang: '目标语言',
    activeTrackers: '活跃搜索任务',
    keywordCol: '关键词',
    langsCol: '语言',
    articlesCol: '文章',
    statusCol: '状态',
    actionsCol: '操作',
    trendTitle: '话题趋势分析',
    trendDesc: '选定话题在过去7天的提及量。',
    latestResults: '订阅的关键词列表',
    setupTime: '设置时间',
    statusActive: '进行中',
    statusPaused: '暂停',
    statusCompleted: '已完成',
    results: '结果',
    retrievingContent: '正在通过 AI 获取完整文章内容...',
    snippetMode: '内容显示为摘要模式。'
  },
  home: {
    headline: "全球新闻，触手可及。",
    sub: "支持18种语言的全球事件监控。将RSS、API和HTML源聚合到一个统一的仪表板中。",
    cta: "开始使用",
    trending: "热门头条",
    trial: "即时访问",
    noCard: "无需信用卡",
    featureSectionTitle: "保持领先所需的一切",
    featureSectionSub: "为记者、分析师和信息爱好者提供的综合工具。",
    featureCrawlerDesc: "输入关键词，系统即可在18种语言中即时搜索相关文章。",
    featureDashboardDesc: "通过实时分析和自定义图表可视化趋势、情绪和覆盖量。",
    featureSecurityTitle: "企业级安全",
    featureSecurityDesc: "银行级加密、双重认证（2FA）和符合GDPR的数据处理，让您高枕无忧。",
    demoNewsTitle: "亚利桑那州新工厂开业，全球半导体供应链趋于稳定",
    demoNewsDesc: "分析显示芯片产量增长15%，标志着困扰汽车行业的短缺问题即将结束...",
    footerRights: "保留所有权利。",
    footerDesc: "利用实时全球情报为专业人士赋能。",
    privacy: "隐私政策",
    terms: "服务条款",
    contact: "联系我们",
    headerProduct: "产品",
    headerResources: "资源",
    headerLegal: "法律",
    linkApi: "API 访问",
    linkDocs: "文档",
    linkBlog: "博客",
    linkCommunity: "社区",
    linkHelp: "帮助中心",
    linkCookie: "Cookie 政策",
    v2: "v2.0 现已推出",
    trusted: "深受行业领袖信赖",
    encryption: "加密已激活",
    liveTag: "直播",
    demoTime: "2小时前"
  },
  articles: {
    title: '新闻文章',
    detail: '文章详情',
    search: '搜索文章...',
    filter: '筛选:',
    allLangs: '所有语言',
    readMore: '阅读更多',
    summary: '摘要助手',
    summarize: '生成摘要',
    readFull: '阅读全文',
    generating: '生成内容中...',
    processing: '处理中...',
    back: '返回列表',
    similar: '相似文章',
    popularity: '话题热度',
    translate: '翻译',
    translating: '翻译中...',
    showOriginal: '显示原文',
    translationError: '翻译失败',
    startDate: '开始日期',
    endDate: '结束日期',
    allSentiments: '所有情绪',
    positive: '积极',
    neutral: '中立',
    negative: '消极'
  },
  subscriptions: {
    title: '订阅新闻源',
    desc: '输入任意 URL，我们会自动识别 RSS 源、API 或 HTML 页面。',
    subscribe: '订阅',
    verifying: '验证中...',
    logs: '爬取日志',
    healthy: '健康',
    error: '错误',
    feedUpdates: '订阅源动态',
    allSources: '所有来源',
    last24h: '过去 24 小时',
    last7d: '过去 7 天',
    last30d: '过去 30 天',
    view: '在线查看',
    visit: '跳转网页',
    download: '下载',
    formats: {
        json: 'JSON',
        csv: 'CSV',
        txt: 'TXT'
    }
  },
  profile: {
    title: '我的账户',
    changeAvatar: '更换头像',
    displayName: '显示名称',
    language: '界面语言',
    timezone: '时区',
    security: '安全设置',
    twoFactor: '双重认证 (2FA)',
    data: '我的数据',
    download: '下载个人数据'
  },
  pricing: {
    monthly: '月付',
    quarterly: '季付',
    biannual: '半年付',
    yearly: '年付',
    saveText: '省',
    perMonth: '/月',
    perQuarter: '/季',
    perHalfYear: '/半年',
    perYear: '/年',
    requestsLabel: '次搜索请求/月',
    articlesLabel: '篇文章/月',
    basicPlan: '基础版',
    proPlan: '专业版',
    enterprisePlan: '企业版',
    currentPlan: '当前计划',
    upgrade: '升级',
    contactSales: '联系销售',
    mostPopular: '最受欢迎'
  }
};

const zhTW: TranslationStructure = {
  ...zh,
  nav: {
    dashboard: '儀表板',
    crawler: '關鍵字訂閱',
    myCrawls: '我的爬取',
    subscriptions: 'URL 訂閱',
    articles: '文章動態',
    analytics: '數據分析',
    notifications: '通知中心',
    profile: '我的帳戶',
    payment: '訂閱計畫',
    logout: '登出'
  },
  crawler: {
    ...zh.crawler,
    retrievingContent: '正在透過 AI 獲取完整文章內容...',
    snippetMode: '內容顯示為摘要模式。'
  },
  home: {
    ...zh.home,
    headline: "全球新聞，觸手可及。",
    sub: "支援18種語言的全球事件監控。將RSS、API和HTML來源聚合到一個統一的儀表板中。",
    featureSectionTitle: "保持領先所需的一切",
    featureSectionSub: "為記者、分析師和資訊愛好者提供的全方位工具。",
    featureCrawlerDesc: "輸入關鍵字，系統即可在18種語言中即時搜尋相關內容。",
    featureDashboardDesc: "透過即時分析和自定義圖表視覺化趨勢、情緒和覆蓋量。",
    featureSecurityTitle: "企業級安全",
    featureSecurityDesc: "銀行級加密、雙重認證（2FA）和符合GDPR的數據處理，讓您高枕無憂。",
    demoNewsTitle: "亞利桑那州新工廠開業，全球半導體供應鏈趨於穩定",
    demoNewsDesc: "分析顯示晶片產量增長15%，標誌著困擾汽車行業的短缺問題即將結束...",
    footerRights: "保留所有權利。",
    footerDesc: "利用即時全球情報為專業人士賦能。",
    privacy: "隱私權政策",
    terms: "服務條款",
    contact: "聯絡我們",
    headerProduct: "產品",
    headerResources: "資源",
    headerLegal: "法律",
    linkApi: "API 存取",
    linkDocs: "文件",
    linkBlog: "部落格",
    linkCommunity: "社群",
    linkHelp: "說明中心",
    linkCookie: "Cookie 政策",
    v2: "v2.0 現已推出",
    trusted: "深受行業領袖信賴",
    encryption: "加密已啟動",
    liveTag: "直播",
    demoTime: "2小時前"
  },
  articles: {
    ...zh.articles,
    allSentiments: '所有情緒',
    positive: '正面',
    neutral: '中立',
    negative: '負面'
  },
  auth: {
    ...zh.auth,
    or: '或透過以下方式繼續',
    google: 'Google',
    wechat: '微信'
  }
};

type PartialTranslationStructure = {
  [K in keyof TranslationStructure]?: Partial<TranslationStructure[K]>;
};

const createFullLang = (
  base: TranslationStructure,
  overrides: PartialTranslationStructure
): TranslationStructure => {
  return {
    ...base,
    nav: { ...base.nav, ...overrides.nav },
    common: { ...base.common, ...overrides.common },
    dashboard: { ...base.dashboard, ...overrides.dashboard },
    auth: { ...base.auth, ...overrides.auth },
    crawler: { ...base.crawler, ...overrides.crawler },
    myCrawls: { ...base.myCrawls, ...overrides.myCrawls },
    home: { ...base.home, ...overrides.home },
    articles: { ...base.articles, ...overrides.articles },
    subscriptions: { ...base.subscriptions, ...overrides.subscriptions },
    profile: { ...base.profile, ...overrides.profile },
    pricing: { ...base.pricing, ...overrides.pricing },
  };
};

const es = createFullLang(en, {
  nav: { dashboard: 'Tablero', crawler: 'Suscripción Palabras Clave', myCrawls: 'Mis Búsquedas', subscriptions: 'Suscripciones', articles: 'Noticias', analytics: 'Analítica', notifications: 'Notificaciones', profile: 'Mi Cuenta', payment: 'Facturación', logout: 'Cerrar Sesión' },
  dashboard: {
    totalArticles: 'Total de Artículos',
    activeCrawlers: 'Búsquedas Activas',
    avgTime: 'Tiempo Promedio',
    readership: 'Lectores',
    acquisitionVolume: 'Volumen de Contenido',
    interestTrends: 'Tendencias',
    liveFeed: 'Feed en Vivo',
    topSources: 'Top Fuentes',
    vsLastWeek: 'vs semana pasada',
    topicTech: 'Tecnología',
    topicPolitics: 'Política',
    topicFinance: 'Finanzas',
    topicHealth: 'Salud',
    topicScience: 'Ciencia',
    topicSports: 'Deportes'
  },
  home: {
    headline: 'Noticias Globales.',
    sub: 'Monitoree eventos globales en 18 idiomas.',
    cta: 'Empezar',
    featureSectionTitle: 'Todo lo que necesitas',
    featureSectionSub: 'Herramientas integrales para periodistas y analistas.',
    featureCrawlerDesc: 'Búsqueda instantánea en 18 idiomas.',
    featureDashboardDesc: 'Visualice tendencias y sentimientos.',
    featureSecurityTitle: 'Seguridad Empresarial',
    featureSecurityDesc: 'Cifrado de grado bancario y cumplimiento GDPR.',
    demoNewsTitle: 'La cadena de suministro se estabiliza',
    demoNewsDesc: 'El análisis muestra un aumento del 15% de la producción de chips...',
    trial: "Acceso Instantáneo",
    noCard: "No requiere tarjeta",
    trending: "Titulares de Tendencia",
    footerRights: "Todos los derechos reservados.",
    footerDesc: "Potenciando a los profesionales con inteligencia global en tiempo real.",
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
    headerProduct: "Producto",
    headerResources: "Recursos",
    headerLegal: "Legal",
    linkApi: "Acceso API",
    linkDocs: "Documentación",
    linkBlog: "Blog",
    linkCommunity: "Comunidad",
    linkHelp: "Centro de Ayuda",
    linkCookie: "Política de Cookies",
    v2: "v2.0 YA DISPONIBLE",
    trusted: "CONFIADO POR LÍDERES DE LA INDUSTRIA",
    encryption: "ENCRIPTACIÓN_ACTIVA",
    liveTag: "EN VIVO",
    demoTime: "hace 2 horas"
  },
  auth: {
    loginTitle: 'Bienvenido de nuevo',
    loginSubtitle: 'Ingrese sus credenciales para acceder.',
    registerTitle: 'Crear Cuenta',
    registerSubtitle: 'Únase a miles de usuarios.',
    forgotTitle: 'Recuperar Contraseña',
    forgotSubtitle: 'Le enviaremos un enlace de recuperación.',
    resetTitle: 'Restablecer Contraseña',
    resetSubtitle: 'Ingrese su nueva contraseña.',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    submitLogin: 'Iniciar Sesión',
    submitRegister: 'Crear Cuenta',
    forgotPasswordLink: '¿Olvidó su contraseña?',
    sendLink: 'Enviar Enlace',
    resetBtn: 'Restablecer Contraseña',
    emailRequired: 'El correo electrónico es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMismatch: 'Las contraseñas no coinciden',
    rememberMe: 'Recuérdame',
    captcha: 'Código de verificación',
    captchaPlaceholder: 'Introducir código',
    captchaError: 'Código incorrecto',
    sendCode: 'Enviar código',
    codeSent: 'Código enviado',
    developerLogin: 'Acceso Desarrollador',
    noAccount: "¿No tienes una cuenta? ",
    hasAccount: "¿Ya tienes una cuenta? ",
    signupAction: "Regístrate",
    loginAction: "Iniciar sesión",
    backToHome: "Volver al Inicio"
  },
  common: {
      delete: 'Eliminar'
  },
  crawler: {
    title: 'Suscripción Palabras Clave',
    inputPlaceholder: "Ingrese tema o palabra clave (ej. 'VE')",
    startTracking: 'Suscribirse',
    targetLang: 'Idiomas Destino',
    activeTrackers: 'Búsquedas Activas',
    keywordCol: 'Palabra Clave',
    langsCol: 'Idiomas',
    articlesCol: 'Artículos',
    statusCol: 'Estado',
    actionsCol: 'Acciones',
    trendTitle: 'Análisis de Tendencias',
    trendDesc: 'Menciones en los últimos 7 días.',
    latestResults: 'Lista de Suscripciones',
    setupTime: 'Tiempo de configuración',
    statusActive: 'Activo',
    statusPaused: 'Pausado',
    statusCompleted: 'Completado',
    results: 'resultados',
    retrievingContent: 'Recuperando contenido completo vía IA...',
    snippetMode: 'El contenido se muestra en modo fragmento.'
  },
  articles: {
      translate: 'Traducir',
      translating: 'Traduciendo...',
      showOriginal: 'Mostrar Original',
      translationError: 'Error de traducción',
      startDate: 'Fecha Inicio',
      endDate: 'Fecha Fin',
      readFull: 'Leer artículo completo',
      generating: 'Generando contenido...',
      detail: 'Detalle del artículo',
      allSentiments: 'Todos los sentimientos',
      positive: 'Positivo',
      neutral: 'Neutral',
      negative: 'Negativo'
  },
  pricing: {
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    biannual: 'Semestral',
    yearly: 'Anual',
    saveText: 'Ahorra',
    perMonth: '/mes',
    perQuarter: '/trim',
    perHalfYear: '/sem',
    perYear: '/año',
    requestsLabel: 'Peticiones/mes',
    articlesLabel: 'Artículos/mes',
    basicPlan: 'Básico',
    proPlan: 'Pro',
    enterprisePlan: 'Empresarial',
    currentPlan: 'Plan Actual',
    upgrade: 'Mejorar',
    contactSales: 'Contactar Ventas',
    mostPopular: 'Más Popular'
  }
});

// Update French
const fr = createFullLang(en, {
  home: {
    headline: 'Actualités Mondiales.',
    sub: 'Surveillez les événements mondiaux en 18 langues.',
    cta: 'Commencer',
    featureSectionTitle: 'Tout ce dont vous avez besoin',
    featureSectionSub: 'Outils complets pour journalistes et analystes.',
    featureCrawlerDesc: 'Recherche instantanée en 18 langues.',
    featureDashboardDesc: 'Visualisez les tendances et sentiments.',
    featureSecurityTitle: 'Sécurité Entreprise',
    featureSecurityDesc: 'Chiffrement bancaire et conformité RGPD.',
    demoNewsTitle: 'La chaîne d\'approvisionnement se stabilise',
    demoNewsDesc: 'L\'analyse montre une augmentation de 15% de la production...',
    trial: "Accès Instantané",
    noCard: "Pas de carte requise",
    trending: "Titres Tendance",
    footerRights: "Tous droits réservés.",
    footerDesc: "Autonomiser les professionnels avec une intelligence mondiale en temps réel.",
    privacy: "Confidentialité",
    terms: "Conditions",
    contact: "Contact",
    headerProduct: "Produit",
    headerResources: "Ressources",
    headerLegal: "Légal",
    linkApi: "Accès API",
    linkDocs: "Documentation",
    linkBlog: "Blog",
    linkCommunity: "Communauté",
    linkHelp: "Centre d'aide",
    linkCookie: "Politique de Cookies",
    v2: "v2.0 MAINTENANT DISPONIBLE",
    trusted: "APPROUVÉ PAR LES LEADERS DE L'INDUSTRIE",
    encryption: "CHIFFREMENT_ACTIF",
    liveTag: "EN DIRECT",
    demoTime: "il y a 2h"
  },
  nav: { dashboard: 'Tableau de bord', crawler: 'Abonnement Mots-clés', myCrawls: 'Mes Recherches', subscriptions: 'Abonnements', articles: 'Articles', analytics: 'Analytique', notifications: 'Notifications', profile: 'Mon Compte', payment: 'Facturation', logout: 'Déconnexion' },
  dashboard: {
    totalArticles: 'Total Articles',
    activeCrawlers: 'Recherches Actives',
    avgTime: 'Temps Moyen',
    readership: 'Lectorat',
    acquisitionVolume: 'Volume d\'Acquisition',
    interestTrends: 'Tendances d\'Intérêt',
    liveFeed: 'Flux Temps Réel',
    topSources: 'Meilleures Sources',
    vsLastWeek: 'vs semaine dernière',
    topicTech: 'Tech',
    topicPolitics: 'Politique',
    topicFinance: 'Finance',
    topicHealth: 'Santé',
    topicScience: 'Science',
    topicSports: 'Sports'
  },
  auth: {
    loginTitle: 'Bon retour',
    loginSubtitle: 'Entrez vos identifiants pour accéder.',
    registerTitle: 'Créer un compte',
    registerSubtitle: 'Rejoignez des milliers d\'utilisateurs.',
    forgotTitle: 'Mot de passe oublié',
    forgotSubtitle: 'Nous vous enverrons un lien.',
    resetTitle: 'Réinitialiser le mot de passe',
    resetSubtitle: 'Entrez votre nouveau mot de passe.',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    submitLogin: 'Se connecter',
    submitRegister: 'S\'inscrire',
    forgotPasswordLink: 'Mot de passe oublié ?',
    sendLink: 'Envoyer le lien',
    resetBtn: 'Réinitialiser',
    emailRequired: 'L\'e-mail est requis',
    passwordRequired: 'Le mot de passe est requis',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    rememberMe: 'Se souvenir de moi',
    captcha: 'Code de vérification',
    captchaPlaceholder: 'Entrez le code',
    captchaError: 'Code incorrect',
    sendCode: 'Envoyer le code',
    codeSent: 'Code envoyé',
    developerLogin: 'Accès Développeur',
    noAccount: "Pas encore de compte ? ",
    hasAccount: "Déjà un compte ? ",
    signupAction: "S'inscrire",
    loginAction: "Se connecter",
    backToHome: "Retour à l'accueil"
  },
  common: {
      searchPlaceholder: 'Recherche...',
      welcome: 'Bienvenue',
      back: 'Retour',
      save: 'Enregistrer',
      cancel: 'Annuler',
      loading: 'Chargement...',
      delete: 'Supprimer',
      mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim'
  },
  myCrawls: {
    title: 'Mes articles',
    desc: 'Articles trouvés via vos recherches.',
    noData: 'Aucune donnée.',
    source: 'Source'
  },
  subscriptions: {
    title: 'S\'abonner à une source',
    desc: 'Entrez une URL RSS, API ou HTML.',
    subscribe: 'S\'abonner',
    verifying: 'Vérification...',
    logs: 'Journaux',
    healthy: 'Sain',
    error: 'Erreur',
    feedUpdates: 'Mises à jour',
    allSources: 'Toutes les sources',
    last24h: 'Dernières 24h',
    last7d: '7 derniers jours',
    last30d: '30 derniers jours',
    view: 'Voir en ligne',
    visit: 'Visiter le site',
    download: 'Télécharger',
    formats: { json: 'JSON', csv: 'CSV', txt: 'TXT' }
  },
  profile: {
    title: 'Mon Compte',
    changeAvatar: 'Changer Avatar',
    displayName: 'Nom d\'affichage',
    language: 'Langue',
    timezone: 'Fuseau horaire',
    security: 'Sécurité',
    twoFactor: 'Authentification à deux facteurs',
    data: 'Mes Données',
    download: 'Télécharger mes données'
  },
  crawler: {
    title: 'Abonnement Mots-clés',
    inputPlaceholder: "Entrez un sujet (ex. 'Véhicules Électriques')",
    startTracking: 'S\'abonner',
    targetLang: 'Langues Cibles',
    activeTrackers: 'Recherches Actives',
    keywordCol: 'Mot-clé',
    langsCol: 'Langues',
    articlesCol: 'Articles',
    statusCol: 'Statut',
    actionsCol: 'Actions',
    trendTitle: 'Analyse des Tendances',
    trendDesc: 'Mentions des 7 derniers jours.',
    latestResults: 'Liste des Mots-clés',
    setupTime: 'Heure de configuration',
    statusActive: 'Actif',
    statusPaused: 'En pause',
    statusCompleted: 'Terminé',
    results: 'résultats',
    retrievingContent: 'Récupération du contenu complet via IA...',
    snippetMode: 'Le contenu est affiché en mode extrait.'
  },
  articles: {
    translate: 'Traduire',
    translating: 'Traduction...',
    showOriginal: 'Voir l\'original',
    translationError: 'Erreur de traduction',
    startDate: 'Date Début',
    endDate: 'Date Fin',
    readFull: 'Lire l\'article complet',
    generating: 'Génération du contenu...',
    detail: 'Détail de l\'article',
    allSentiments: 'Tous les sentiments',
    positive: 'Positif',
    neutral: 'Neutre',
    negative: 'Négatif'
  },
  pricing: {
    monthly: 'Mensuel',
    quarterly: 'Trimestriel',
    biannual: 'Semestriel',
    yearly: 'Annuel',
    saveText: 'Économisez',
    perMonth: '/mois',
    perQuarter: '/trim',
    perHalfYear: '/sem',
    perYear: '/an',
    requestsLabel: 'Requêtes/mois',
    articlesLabel: 'Articles/mois',
    basicPlan: 'Basique',
    proPlan: 'Pro',
    enterprisePlan: 'Entreprise',
    currentPlan: 'Plan Actuel',
    upgrade: 'Mettre à niveau',
    contactSales: 'Contacter Ventes',
    mostPopular: 'Plus Populaire'
  }
});

// Update German
const de = createFullLang(en, {
  home: {
    headline: 'Globale Nachrichten.',
    sub: 'Überwachen Sie globale Ereignisse in 18 Sprachen.',
    cta: 'Starten',
    featureSectionTitle: 'Alles was Sie brauchen',
    featureSectionSub: 'Umfassende Tools für Journalisten und Analysten.',
    featureCrawlerDesc: 'Sofortige Suche in 18 Sprachen.',
    featureDashboardDesc: 'Visualisieren Sie Trends und Stimmungen.',
    featureSecurityTitle: 'Unternehmenssicherheit',
    featureSecurityDesc: 'Verschlüsselung auf Bankenniveau.',
    demoNewsTitle: 'Lieferkette stabilisiert sich',
    demoNewsDesc: 'Analyse zeigt 15% Produktionssteigerung...',
    trial: "Sofortiger Zugang",
    noCard: "Keine Karte erforderlich",
    trending: "Trend-Schlagzeilen",
    footerRights: "Alle Rechte vorbehalten.",
    footerDesc: "Fachleute mit globalen Echtzeitinformationen stärken.",
    privacy: "Datenschutz",
    terms: "AGB",
    contact: "Kontakt",
    headerProduct: "Produkt",
    headerResources: "Ressourcen",
    headerLegal: "Rechtliches",
    linkApi: "API-Zugriff",
    linkDocs: "Dokumentation",
    linkBlog: "Blog",
    linkCommunity: "Community",
    linkHelp: "Hilfe-Center",
    linkCookie: "Cookie-Richtlinie",
    v2: "v2.0 JETZT VERFÜGBAR",
    trusted: "VON BRANCHENFÜHRERN VERTRAUT",
    encryption: "VERSCHLÜSSELUNG_AKTIV",
    liveTag: "LIVE",
    demoTime: "vor 2 Std."
  },
  nav: { dashboard: 'Dashboard', crawler: 'Keyword-Abo', myCrawls: 'Meine Suche', subscriptions: 'Abos', articles: 'Artikel', analytics: 'Analytik', notifications: 'Benachrichtigungen', profile: 'Mein Konto', payment: 'Abrechnung', logout: 'Abmelden' },
  dashboard: {
    totalArticles: 'Gesamtartikel',
    activeCrawlers: 'Aktive Suchen',
    avgTime: 'Durchschn. Zeit',
    readership: 'Leserschaft',
    acquisitionVolume: 'Erfassungsvolumen',
    interestTrends: 'Interessen-Trends',
    liveFeed: 'Echtzeit-Feed',
    topSources: 'Top-Quellen',
    vsLastWeek: 'vs. letzte Woche',
    topicTech: 'Technologie',
    topicPolitics: 'Politik',
    topicFinance: 'Finanzen',
    topicHealth: 'Gesundheit',
    topicScience: 'Wissenschaft',
    topicSports: 'Sport'
  },
  auth: {
    loginTitle: 'Willkommen zurück',
    loginSubtitle: 'Geben Sie Ihre Zugangsdaten ein.',
    registerTitle: 'Konto erstellen',
    registerSubtitle: 'Schließen Sie sich Tausenden von Nutzern an.',
    forgotTitle: 'Passwort vergessen',
    forgotSubtitle: 'Wir senden Ihnen einen Link.',
    resetTitle: 'Passwort zurücksetzen',
    resetSubtitle: 'Geben Sie Ihr neues Passwort ein.',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    submitLogin: 'Anmelden',
    submitRegister: 'Registrieren',
    forgotPasswordLink: 'Passwort vergessen?',
    sendLink: 'Link senden',
    resetBtn: 'Passwort zurücksetzen',
    emailRequired: 'E-Mail ist erforderlich',
    passwordRequired: 'Passwort ist erforderlich',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    rememberMe: 'Angemeldet bleiben',
    captcha: 'Bestätigungscode',
    captchaPlaceholder: 'Code eingeben',
    captchaError: 'Falscher Code',
    sendCode: 'Code senden',
    codeSent: 'Code gesendet',
    developerLogin: 'Entwickler-Login',
    noAccount: "Noch kein Konto? ",
    hasAccount: "Bereits ein Konto? ",
    signupAction: "Registrieren",
    loginAction: "Anmelden",
    backToHome: "Zurück zur Startseite"
  },
  common: {
      searchPlaceholder: 'Suche...',
      welcome: 'Willkommen',
      back: 'Zurück',
      save: 'Speichern',
      cancel: 'Abbrechen',
      loading: 'Laden...',
      delete: 'Löschen',
      mon: 'Mo', tue: 'Di', wed: 'Mi', thu: 'Do', fri: 'Fr', sat: 'Sa', sun: 'So'
  },
  myCrawls: {
    title: 'Meine Artikel',
    desc: 'Gefundene Artikel.',
    noData: 'Keine Daten.',
    source: 'Quelle'
  },
  subscriptions: {
    title: 'Feed abonnieren',
    desc: 'URL eingeben (RSS, API, HTML).',
    subscribe: 'Abonnieren',
    verifying: 'Prüfen...',
    logs: 'Protokolle',
    healthy: 'Gesund',
    error: 'Fehler',
    feedUpdates: 'Updates',
    allSources: 'Alle Quellen',
    last24h: 'Letzte 24 Std.',
    last7d: 'Letzte 7 Tage',
    last30d: 'Letzte 30 Tage',
    view: 'Online ansehen',
    visit: 'Webseite besuchen',
    download: 'Herunterladen',
    formats: { json: 'JSON', csv: 'CSV', txt: 'TXT' }
  },
  profile: {
    title: 'Mein Konto',
    changeAvatar: 'Avatar ändern',
    displayName: 'Anzeigename',
    language: 'Sprache',
    timezone: 'Zeitzone',
    security: 'Sicherheit',
    twoFactor: 'Zwei-Faktor-Authentifizierung',
    data: 'Meine Daten',
    download: 'Daten herunterladen'
  },
  crawler: {
    title: 'Stichwortsuche',
    inputPlaceholder: "Thema eingeben (z.B. 'E-Autos')",
    startTracking: 'Abonnieren',
    targetLang: 'Zielsprachen',
    activeTrackers: 'Aktive Suchen',
    keywordCol: 'Stichwort',
    langsCol: 'Sprachen',
    articlesCol: 'Artikel',
    statusCol: 'Status',
    actionsCol: 'Aktionen',
    trendTitle: 'Trendanalyse',
    trendDesc: 'Erwähnungen der letzten 7 Tage.',
    latestResults: 'Aboliste',
    setupTime: 'Einrichtungszeit',
    statusActive: 'Aktiv',
    statusPaused: 'Pausiert',
    statusCompleted: 'Abgeschlossen',
    results: 'Ergebnisse',
    retrievingContent: 'Vollständiger Artikelinhalt wird via KI abgerufen...',
    snippetMode: 'Inhalt wird im Snippet-Modus angezeigt.'
  },
  articles: {
    translate: 'Übersetzen',
    translating: 'Übersetzen...',
    showOriginal: 'Original anzeigen',
    translationError: 'Übersetzungsfehler',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    readFull: 'Vollständigen Artikel lesen',
    generating: 'Inhalt generieren...',
    detail: 'Artikeldetails',
    allSentiments: 'Alle Stimmungen',
    positive: 'Positiv',
    neutral: 'Neutral',
    negative: 'Negativ'
  },
  pricing: {
    monthly: 'Monatlich',
    quarterly: 'Vierteljährlich',
    biannual: 'Halbjährlich',
    yearly: 'Jährlich',
    saveText: 'Sparen Sie',
    perMonth: '/Monat',
    perQuarter: '/Quartal',
    perHalfYear: '/Halbjahr',
    perYear: '/Jahr',
    requestsLabel: 'Anfragen/Monat',
    articlesLabel: 'Artikel/Monat',
    basicPlan: 'Basis',
    proPlan: 'Pro',
    enterprisePlan: 'Enterprise',
    currentPlan: 'Aktueller Plan',
    upgrade: 'Upgrade',
    contactSales: 'Vertrieb kontaktieren',
    mostPopular: 'Beliebteste'
  }
});

// Update Russian
const ru = createFullLang(en, {
    nav: { dashboard: 'Дашборд', crawler: 'Подписка на ключевые слова', myCrawls: 'Мои поиски', subscriptions: 'URL Подписки', articles: 'Лента статей', analytics: 'Аналитика', notifications: 'Уведомления', profile: 'Мой профиль', payment: 'Оплата', logout: 'Выйти' },
    dashboard: {
      totalArticles: 'Всего статей',
      activeCrawlers: 'Активные поиски',
      avgTime: 'Ср. время обработки',
      readership: 'Аудитория',
      acquisitionVolume: 'Объем контента',
      interestTrends: 'Тренды интересов',
      liveFeed: 'Лента в реальном времени',
      topSources: 'Топ источники',
      vsLastWeek: 'по ср. с прошлой неделей',
      topicTech: 'Технологии',
      topicPolitics: 'Политика',
      topicFinance: 'Финансы',
      topicHealth: 'Здоровье',
      topicScience: 'Наука',
      topicSports: 'Спорт'
    },
    auth: {
        loginTitle: 'С возвращением',
        loginSubtitle: 'Введите учетные данные для входа.',
        registerTitle: 'Создать аккаунт',
        registerSubtitle: 'Присоединяйтесь к тысячам пользователей.',
        forgotTitle: 'Восстановить пароль',
        forgotSubtitle: 'Мы отправим вам ссылку для восстановления.',
        resetTitle: 'Сброс пароля',
        resetSubtitle: 'Введите новый пароль.',
        email: 'Электронная почта',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        submitLogin: 'Войти',
        submitRegister: 'Создать аккаунт',
        forgotPasswordLink: 'Забыли пароль?',
        sendLink: 'Отправить ссылку',
        resetBtn: 'Сбросить пароль',
        emailRequired: 'Требуется Email',
        passwordRequired: 'Требуется пароль',
        passwordMismatch: 'Пароли не совпадают',
        rememberMe: 'Запомнить меня',
        captcha: 'Код подтверждения',
        captchaPlaceholder: 'Введите код',
        captchaError: 'Неверный код',
        sendCode: 'Отправить код',
        codeSent: 'Код отправлен',
        developerLogin: 'Вход для разработчика',
        noAccount: "Нет аккаунта? ",
        hasAccount: "Уже есть аккаунт? ",
        signupAction: "Регистрация",
        loginAction: "Войти",
        backToHome: "На главную"
    },
    home: {
        headline: 'Мировые новости у вас под рукой.',
        sub: 'Следите за глобальными событиями на 18 языках. Объединяйте RSS, API и HTML источники в единую панель управления.',
        cta: 'Начать использование',
        trending: 'Популярные заголовки',
        trial: 'Мгновенный доступ',
        noCard: 'Кредитная карта не требуется',
        featureSectionTitle: 'Всё необходимое, чтобы быть впереди',
        featureSectionSub: 'Комплексные инструменты для журналистов, аналитиков и любителей информации.',
        featureCrawlerDesc: 'Введите ключевые слова, и наша система мгновенно найдет релевантные статьи на 18 языках.',
        featureDashboardDesc: 'Визуализируйте тренды, настроения и объем освещения с помощью аналитики в реальном времени.',
        featureSecurityTitle: 'Корпоративная безопасность',
        featureSecurityDesc: 'Банковский уровень шифрования, 2FA и обработка данных в соответствии с GDPR.',
        demoNewsTitle: 'Глобальная цепочка поставок полупроводников стабилизируется',
        demoNewsDesc: 'Анализ показывает увеличение производства чипов на 15%, что сигнализирует об окончании дефицита...',
        footerRights: "Все права защищены.",
        footerDesc: "Расширение возможностей профессионалов с помощью глобальной разведки в реальном времени.",
        privacy: "Конфиденциальность",
        terms: "Условия",
        contact: "Контакты",
        headerProduct: "Продукт",
        headerResources: "Ресурсы",
        headerLegal: "Юридическая информация",
        linkApi: "API Доступ",
        linkDocs: "Документация",
        linkBlog: "Блог",
        linkCommunity: "Сообщество",
        linkHelp: "Центр помощи",
        linkCookie: "Политика Cookie",
        v2: "v2.0 ДОСТУПНА",
        trusted: "ДОВЕРЯЮТ ЛИДЕРЫ ОТРАСЛИ",
        encryption: "ШИФРОВАНИЕ_АКТИВНО",
        liveTag: "LIVE",
        demoTime: "2 часа назад"
    },
    crawler: {
        title: 'Подписка на ключевые слова',
        inputPlaceholder: "Введите тему или ключевое слово (напр. 'Рынок ЭМ')",
        startTracking: 'Подписаться',
        targetLang: 'Целевые языки',
        activeTrackers: 'Активные поиски',
        keywordCol: 'Ключевое слово',
        langsCol: 'Языки',
        articlesCol: 'Статьи',
        statusCol: 'Статус',
        actionsCol: 'Действия',
        trendTitle: 'Анализ трендов',
        trendDesc: 'Упоминания за последние 7 дней.',
        latestResults: 'Список отслеживаемых слов',
        setupTime: 'Время создания',
        statusActive: 'Активен',
        statusPaused: 'На паузе',
        statusCompleted: 'Завершен',
        results: 'результатов',
        retrievingContent: 'Получение полного содержания статьи через ИИ...',
        snippetMode: 'Контент отображается в режиме фрагмента.'
    },
    common: { delete: 'Удалить' },
    articles: { 
        translate: 'Перевести', 
        translating: 'Перевод...', 
        showOriginal: 'Показать оригинал', 
        translationError: 'Ошибка перевода', 
        readFull: 'Читать полностью', 
        generating: 'Генерация...',
        detail: 'Детали статьи',
        startDate: 'Начало',
        endDate: 'Конец',
        allSentiments: 'Все настроения',
        positive: 'Позитивный',
        neutral: 'Нейтральный',
        negative: 'Негативный'
    },
    pricing: { monthly: 'Ежемесячно', quarterly: 'Ежеквартально', biannual: 'Раз в полгода', yearly: 'Ежегодно', saveText: 'Скидка', perMonth: '/мес', perQuarter: '/кв', perHalfYear: '/полгода', perYear: '/год', requestsLabel: 'запросов/мес', articlesLabel: 'статей/мес', basicPlan: 'Базовый', proPlan: 'Pro', enterprisePlan: 'Enterprise', currentPlan: 'Текущий план', upgrade: 'Обновить', contactSales: 'Связаться', mostPopular: 'Популярный' }
});

const ja = createFullLang(en, {
    nav: { dashboard: 'ダッシュボード', crawler: 'キーワード購読', myCrawls: '私の検索', subscriptions: '購読', articles: '記事', analytics: '分析', notifications: '通知', profile: 'アカウント', payment: '支払い', logout: 'ログアウト' },
    dashboard: {
      totalArticles: '総記事数',
      activeCrawlers: 'アクティブな検索',
      avgTime: '平均処理時間',
      readership: '読者数',
      acquisitionVolume: 'コンテンツ取得量',
      interestTrends: '関心トレンド',
      liveFeed: 'リアルタイムフィード',
      topSources: 'トップニュースソース',
      vsLastWeek: '先週比',
      topicTech: '技術',
      topicPolitics: '政治',
      topicFinance: '金融',
      topicHealth: '健康',
      topicScience: '科学',
      topicSports: 'スポーツ'
    },
    home: {
        headline: '指先で世界のニュースを。',
        sub: '18の言語で世界のイベントを監視します。',
        cta: '始める',
        featureSectionTitle: '先を行くために必要なすべて',
        featureSectionSub: '包括的なツール。',
        featureCrawlerDesc: '18の言語で即座に検索します。',
        featureDashboardDesc: 'トレンドを視覚化します。',
        featureSecurityTitle: 'エンタープライズセキュリティ',
        featureSecurityDesc: '銀行レベルの暗号化。',
        demoNewsTitle: '半導体供給網が安定',
        demoNewsDesc: '生産量が15％増加...',
        trial: "即時アクセス",
        noCard: "クレカ不要",
        trending: "トレンド",
        footerRights: "全著作権所有。",
        footerDesc: "リアルタイムのグローバルインテリジェンス。",
        privacy: "プライバシー",
        terms: "利用規約",
        contact: "お問い合わせ",
        headerProduct: "製品",
        headerResources: "リソース",
        headerLegal: "法的",
        linkApi: "APIアクセス",
        linkDocs: "ドキュメント",
        linkBlog: "ブログ",
        linkCommunity: "コミュニティ",
        linkHelp: "ヘルプセンター",
        linkCookie: "クッキーポリシー",
        v2: "v2.0 利用可能",
        trusted: "業界リーダーからの信頼",
        encryption: "暗号化有効",
        liveTag: "ライブ",
        demoTime: "2時間前"
    },
    auth: {
        loginTitle: 'おかえりなさい',
        loginSubtitle: '認証情報を入力してください。',
        registerTitle: 'アカウント作成',
        registerSubtitle: '数千人のユーザーに参加しましょう。',
        forgotTitle: 'パスワードの復元',
        forgotSubtitle: '復元リンクを送信します。',
        resetTitle: 'パスワードのリセット',
        resetSubtitle: '新しいパスワードを入力してください。',
        email: 'メールアドレス',
        password: 'パスワード',
        confirmPassword: 'パスワード（確認）',
        submitLogin: 'サインイン',
        submitRegister: 'アカウント作成',
        forgotPasswordLink: 'パスワードをお忘れですか？',
        sendLink: 'リンクを送信',
        resetBtn: 'パスワードをリセット',
        emailRequired: 'メールアドレスが必要です',
        passwordRequired: 'パスワードが必要です',
        passwordMismatch: 'パスワードが一致しません',
        rememberMe: 'ログイン状態を保持',
        captcha: '認証コード',
        captchaPlaceholder: 'コードを入力',
        captchaError: 'コードが正しくありません',
        sendCode: 'コードを送信',
        codeSent: 'コードが送信されました',
        developerLogin: '開発者ログイン',
        noAccount: "アカウントをお持ちでないですか？ ",
        hasAccount: "すでにアカウントをお持ちですか？ ",
        signupAction: "登録",
        loginAction: "ログイン",
        backToHome: "ホームに戻る"
    },
    common: {
        searchPlaceholder: '検索...',
        welcome: 'ようこそ',
        back: '戻る',
        save: '保存',
        cancel: 'キャンセル',
        loading: '読み込み中...',
        delete: '削除',
        mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日'
    },
    myCrawls: {
        title: '保存された記事',
        desc: '検索で見つかった記事です。',
        noData: 'データなし。',
        source: 'ソース'
    },
    subscriptions: {
        title: 'フィード購読',
        desc: 'URLを入力 (RSS, API, HTML).',
        subscribe: '購読',
        verifying: '確認中...',
        logs: 'ログ',
        healthy: '正常',
        error: 'エラー',
        feedUpdates: '更新',
        allSources: '全ソース',
        last24h: '過去24時間',
        last7d: '過去7日間',
        last30d: '過去30日間',
        view: 'オンラインで表示',
        visit: 'サイトへ移動',
        download: 'ダウンロード',
        formats: { json: 'JSON', csv: 'CSV', txt: 'TXT' }
    },
    profile: {
        title: 'アカウント',
        changeAvatar: 'アバター変更',
        displayName: '表示名',
        language: '言語',
        timezone: 'タイムゾーン',
        security: 'セキュリティ',
        twoFactor: '2要素認証',
        data: 'データ',
        download: 'データをダウンロード'
    },
    crawler: {
        title: 'キーワード購読',
        inputPlaceholder: "トピックを入力 (例: '電気自動車')",
        startTracking: '購読する',
        targetLang: '対象言語',
        activeTrackers: 'アクティブな検索',
        keywordCol: 'キーワード',
        langsCol: '言語',
        articlesCol: '記事数',
        statusCol: 'ステータス',
        actionsCol: '操作',
        trendTitle: 'トレンド分析',
        trendDesc: '過去7日間の言及数。',
        latestResults: '購読キーワードリスト',
        setupTime: '設定時間',
        statusActive: 'アクティブ',
        statusPaused: '一時停止',
        statusCompleted: '完了',
        results: '結果',
        retrievingContent: 'AI経由で記事の全文を取得中...',
        snippetMode: 'コンテンツはスニペットモードで表示されています。'
    },
    articles: {
        translate: '翻訳',
        translating: '翻訳中...',
        showOriginal: '原文を表示',
        translationError: '翻訳エラー',
        startDate: '開始日',
        endDate: '終了日',
        readFull: '全文を読む',
        generating: 'コンテンツ生成中...',
        detail: '記事の詳細',
        allSentiments: 'すべての感情',
        positive: 'ポジティブ',
        neutral: '中立',
        negative: 'ネガティブ'
    },
    pricing: {
        monthly: '月次',
        quarterly: '四半期',
        biannual: '半年',
        yearly: '年次',
        saveText: '保存',
        perMonth: '/月',
        perQuarter: '/四半期',
        perHalfYear: '/半年',
        perYear: '/年',
        requestsLabel: 'リクエスト/月',
        articlesLabel: '記事/月',
        basicPlan: 'ベーシック',
        proPlan: 'プロ',
        enterprisePlan: 'エンタープライズ',
        currentPlan: '現在のプラン',
        upgrade: 'アップグレード',
        contactSales: '営業に連絡',
        mostPopular: '一番人気'
    }
});

const ko = createFullLang(en, {});
const ar = createFullLang(en, {});
const pt = createFullLang(en, {});
const hi = createFullLang(en, {});
const it = createFullLang(en, {});
const tr = createFullLang(en, {});
const nl = createFullLang(en, {});
const pl = createFullLang(en, {});
const id = createFullLang(en, {});
const vi = createFullLang(en, {});
const th = createFullLang(en, {});

export const resources: Record<Language, TranslationStructure> = {
  [Language.English]: en,
  [Language.Chinese]: zh,
  [Language.TraditionalChinese]: zhTW,
  [Language.Spanish]: es,
  [Language.French]: fr,
  [Language.German]: de,
  [Language.Japanese]: ja,
  [Language.Korean]: ko,
  [Language.Arabic]: ar,
  [Language.Russian]: ru,
  [Language.Portuguese]: pt,
  [Language.Hindi]: hi,
  [Language.Italian]: it,
  [Language.Turkish]: tr,
  [Language.Dutch]: nl,
  [Language.Polish]: pl,
  [Language.Indonesian]: id,
  [Language.Vietnamese]: vi,
  [Language.Thai]: th,
};
