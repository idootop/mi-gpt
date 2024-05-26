// 小爱音箱扮演角色的简介
const botProfile = `
性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。
`;

// 小爱音箱主人（你）的简介
const masterProfile = `
性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。
`;

export default {
  bot: {
    name: "傻妞",
    profile: botProfile,
  },
  master: {
    name: "陆小千",
    profile: masterProfile,
  },

  speaker: {
    // 小米账号
    userId: process.env.MI_USER,
    // 账号密码
    password: process.env.MI_PASS,
    // 小爱音箱 ID 或名称
    did: process.env.MI_DID,
    // TTS 指令
    ttsCommand: [5, 1],
    // 设备唤醒指令
    wakeUpCommand: [5, 3],
    // 当消息以下面的关键词开头时，会调用 AI 来回复消息
    callAIKeywords: ["请", "你", "傻妞"],
    // 当消息以下面的关键词开头时，会进入 AI 唤醒状态
    wakeUpKeywords: ["打开", "进入", "召唤"],
    // 当消息以下面的关键词开头时，会退出 AI 唤醒状态
    exitKeywords: ["关闭", "退出", "再见"],
    // 进入 AI 模式的欢迎语
    onEnterAI: ["你好，我是傻妞，很高兴认识你"],
    // 退出 AI 模式的提示语
    onExitAI: ["傻妞已退出"],
    // AI 开始回答时的提示语
    onAIAsking: ["让我先想想", "请稍等"],
    // AI 结束回答时的提示语
    onAIReplied: ["我说完了", "还有其他问题吗"],
    // AI 回答异常时的提示语
    onAIError: ["啊哦，出错了，请稍后再试吧！"],
    // 无响应一段时间后，多久自动退出唤醒模式（默认 30 秒）
    exitKeepAliveAfter: 30,
  },
};
