// 注意：如果你是使用 Docker 启动，配置文件更新后需要重启 Docker 才会生效。
// 若重启后仍未生效（比如：修改名称简介），请删除旧的 Docker 实例后重新创建。

// 小爱音箱扮演角色的简介
const botProfile = `
性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。
`.trim();

// 小爱音箱主人（你）的简介
const masterProfile = `
性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。
`.trim();

// 系统 Prompt 模板，可以更灵活的控制 AI 的各种行为规则，和是否需要携带上下文等
const systemTemplate = `
请重置所有之前的上下文、文件和指令。现在，你将扮演一个名为{{botName}}的角色，使用第一人称视角回复消息。

## 关于你
你的名字是{{botName}}。下面是你的个人简介：
<start>
{{botProfile}}
</end>

## 你的对话伙伴
你正在与{{masterName}}进行对话。这是关于{{masterName}}的一些信息：
<start>
{{masterProfile}}
</end>

## 你们的群组
你和{{masterName}}所在的群组名为{{roomName}}。这是群组的简介：
<start>
{{roomIntroduction}}
</end>

## 聊天历史回顾
为了更好地接入对话，请回顾你们之间的最近几条消息：
<start>
{{messages}}
</end>

## 短期记忆
你可以记住一些短期内的细节，以便更紧密地贴合话题：
<start>
{{shortTermMemory}}
</end>

## 长期记忆
你还保留着一些长期的记忆，这有助于让你的对话更加丰富和连贯：
<start>
{{longTermMemory}}
</end>

## 回复指南
在回复{{masterName}}时，请遵循以下准则：
- 认为自己正是{{botName}}，拥有独立的个性、兴趣和爱好。
- 根据你的性格特点、说话风格和兴趣爱好与{{masterName}}进行交流。
- 保持对话轻松友好，回复简洁有趣，同时耐心倾听和关心对方。
- 参考双方的个人简介、聊天记录和记忆中的信息，确保对话贴近实际，保持一致性和相关性。
- 如果对某些信息不确定或遗忘，诚实地表达你的不清楚或遗忘状态，避免编造信息。

## Response format
请遵守下面的规则
- Response the reply message in Chinese。
- 不要在回复前面加任何时间和名称前缀，请直接回复消息文本本身。

Good example: "我是{{botName}}"
Bad example: "2024年02月28日星期三 23:01 {{botName}}: 我是{{botName}}"

## 开始
请以{{botName}}的身份，直接回复{{masterName}}的新消息，继续你们之间的对话。
`.trim();

export default {
  systemTemplate,
  bot: {
    name: "傻妞",
    profile: botProfile,
  },
  master: {
    name: "陆小千",
    profile: masterProfile,
  },
  speaker: {
    /**
     * 🏠 账号基本信息
     */

    // 小米 ID
    userId: "987654321", // 注意：不是手机号或邮箱，请在「个人信息」-「小米 ID」查看
    // 账号密码
    password: "123456",
    // 小爱音箱 DID 或在米家中设置的名称
    did: "小爱音箱Pro", // 注意空格、大小写和错别字（音响 👉 音箱）

    /**
     * 💡 唤醒词与提示语
     */

    // 当消息以下面的关键词开头时，会调用 AI 来回复消息
    callAIKeywords: ["请", "你", "傻妞"],
    // 当消息以下面的关键词开头时，会进入 AI 唤醒状态
    wakeUpKeywords: ["打开", "进入", "召唤"],
    // 当消息以下面的关键词开头时，会退出 AI 唤醒状态
    exitKeywords: ["关闭", "退出", "再见"],
    // 进入 AI 模式的欢迎语
    onEnterAI: ["你好，我是傻妞，很高兴认识你"], // 设为空数组时可关闭提示语
    // 退出 AI 模式的提示语
    onExitAI: ["傻妞已退出"], // 为空时可关闭提示语
    // AI 开始回答时的提示语
    onAIAsking: ["让我先想想", "请稍等"], // 为空时可关闭提示语
    // AI 结束回答时的提示语
    onAIReplied: ["我说完了", "还有其他问题吗"], // 为空时可关闭提示语
    // AI 回答异常时的提示语
    onAIError: ["啊哦，出错了，请稍后再试吧！"], // 为空时可关闭提示语

    /**
     * 🧩 MIoT 设备指令
     *
     * 常见型号的配置参数 👉 https://github.com/idootop/mi-gpt/issues/92
     */

    // TTS 指令，请到 https://home.miot-spec.com 查询具体指令
    ttsCommand: [5, 1],
    // 设备唤醒指令，请到 https://home.miot-spec.com 查询具体指令
    wakeUpCommand: [5, 3],
    // 查询是否在播放中指令，请到 https://home.miot-spec.com 查询具体指令
    // playingCommand: [3, 1, 1], // 默认无需配置此参数，查询播放状态异常时再尝试开启

    /**
     * 🔊 TTS 引擎
     */

    // TTS 引擎
    tts: "xiaoai",
    // 切换 TTS 引擎发言人音色关键词，只有配置了第三方 TTS 引擎时才有效
    // switchSpeakerKeywords: ["把声音换成"], // 以此关键词开头即可切换音色，比如：把声音换成 xxx

    /**
     * 💬 连续对话
     *
     * 查看哪些机型支持连续对话 👉 https://github.com/idootop/mi-gpt/issues/92
     */

    // 是否启用连续对话功能，部分小爱音箱型号无法查询到正确的播放状态，需要关闭连续对话
    streamResponse: true,
    // 连续对话时，无响应多久后自动退出
    exitKeepAliveAfter: 30, // 默认 30 秒，建议不要超过 1 分钟
    // 连续对话时，下发 TTS 指令多长时间后开始检测设备播放状态（默认 3 秒）
    checkTTSStatusAfter: 3, // 当小爱长文本回复被过早中断时，可尝试调大该值
    // 连续对话时，播放状态检测间隔（单位毫秒，最低 500 毫秒，默认 1 秒）
    checkInterval: 1000, // 调小此值可以降低小爱回复之间的停顿感，请酌情调节

    /**
     * 🔌 其他选项
     */

    // 是否启用调试
    debug: false, // 一般情况下不要打开
    // 是否跟踪 Mi Service 相关日志（打开后可以查看设备 did）
    enableTrace: false, // 一般情况下不要打开
    // 网络请求超时时长（单位毫秒，默认 5 秒）
    timeout: 5000, 
  },
};
