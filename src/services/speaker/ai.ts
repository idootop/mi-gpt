import { pickOne } from "../../utils/base";
import {
  Speaker,
  SpeakerCommand,
  SpeakerConfig,
  QueryMessage,
  SpeakerAnswer,
} from "./speaker";

export type AISpeakerConfig = SpeakerConfig & {
  askAI?: (msg: QueryMessage) => Promise<SpeakerAnswer>;
  /**
   * 切换音色前缀
   *
   * 比如：音色切换到（文静毛毛）
   */
  switchSpeakerPrefix?: string;
  /**
   * AI 开始回答时的提示语
   *
   * 比如：请稍等，让我想想
   */
  onAIAsking?: string[];
  /**
   * AI 回答异常时的提示语
   *
   * 比如：出错了，请稍后再试吧！
   */
  onAIError?: string[];
  /**
   * 设备名称，用来唤醒/退出对话模式等
   *
   * 建议使用常见词语，避免使用多音字和容易混淆读音的词语
   */
  name?: string;
  /**
   * 召唤关键词
   *
   * 当消息中包含召唤关键词时，会调用 AI 来响应用户消息
   *
   * 比如：打开/进入/召唤豆包
   */
  callAIPrefix?: string[];
  /**
   * 唤醒关键词
   *
   * 当消息中包含唤醒关键词时，会进入 AI 唤醒状态
   *
   * 比如：关闭/退出/再见豆包
   */
  wakeUpKeyWords?: string[];
  /**
   * 退出关键词
   *
   * 当消息中包含退出关键词时，会退出 AI 唤醒状态
   */
  exitKeywords?: string[];
  /**
   * 进入 AI 模式的欢迎语
   *
   * 比如：你好，我是豆包，请问有什么能够帮你的吗？
   */
  onEnterAI?: string[];
  /**
   * 退出 AI 模式的提示语
   *
   * 比如：豆包已退出
   */
  onExitAI?: string[];
};

type AnswerStep = (
  msg: any,
  data: any
) => Promise<{ stop?: boolean; data?: any } | void>;

export class AISpeaker extends Speaker {
  askAI: AISpeakerConfig["askAI"];
  name: string;
  switchSpeakerPrefix: string;
  onEnterAI: string[];
  onExitAI: string[];
  callAIPrefix: string[];
  wakeUpKeyWords: string[];
  exitKeywords: string[];
  onAIAsking: string[];
  onAIError: string[];

  constructor(config: AISpeakerConfig) {
    super(config);
    const {
      askAI,
      name = "豆包",
      switchSpeakerPrefix = "音色切换到",
      wakeUpKeyWords = ["打开", "进入", "召唤"],
      exitKeywords = ["关闭", "退出", "再见"],
      onAIAsking = ["让我先想想", "请稍等"],
      onAIError = ["啊哦，出错了，请稍后再试吧！"],
    } = config;
    this.askAI = askAI;
    this.switchSpeakerPrefix = switchSpeakerPrefix;
    this.name = name;
    this.onAIError = onAIError;
    this.onAIAsking = onAIAsking;
    this.wakeUpKeyWords = wakeUpKeyWords.map((e) => e + this.name);
    this.exitKeywords = exitKeywords.map((e) => e + this.name);
    this.onEnterAI = config.onEnterAI ?? [
      `你好，我是${this.name}，很高兴为你服务！`,
    ];
    this.onExitAI = config.onExitAI ?? [`${this.name}已关闭！`];
    this.callAIPrefix = config.callAIPrefix ?? [
      "请",
      "你",
      this.name,
      "问问" + this.name,
    ];
  }

  async enterKeepAlive() {
    // 回应
    await this.response({ text: pickOne(this.onEnterAI)!, keepAlive: true });
    // 唤醒
    await super.enterKeepAlive();
  }

  async exitKeepAlive() {
    // 退出唤醒状态
    await super.exitKeepAlive();
    // 回应
    await this.response({
      text: pickOne(this.onExitAI)!,
      keepAlive: false,
      playSFX: false,
    });
    await this.unWakeUp();
  }

  get commands() {
    return [
      {
        match: (msg) => this.wakeUpKeyWords.some((e) => msg.text.includes(e)),
        run: async (msg) => {
          await this.enterKeepAlive();
        },
      },
      {
        match: (msg) => this.exitKeywords.some((e) => msg.text.includes(e)),
        run: async (msg) => {
          await this.exitKeepAlive();
        },
      },
      {
        match: (msg) => msg.text.startsWith(this.switchSpeakerPrefix),
        run: async (msg) => {
          await this.response({
            text: "正在切换音色，请稍等...",
          });
          const speaker = msg.text.replace(this.switchSpeakerPrefix, "");
          const success = await this.switchDefaultSpeaker(speaker);
          await this.response({
            text: success ? "音色已切换！" : "音色切换失败！",
            keepAlive: this.keepAlive,
          });
        },
      },
      ...this._commands,
      {
        match: (msg) =>
          this.keepAlive ||
          this.callAIPrefix.some((e) => msg.text.startsWith(e)),
        run: (msg) => this.askAIForAnswer(msg),
      },
    ] as SpeakerCommand[];
  }

  private _askAIForAnswerSteps: AnswerStep[] = [
    async (msg, data) => {
      // 思考中
      await this.response({
        audio: process.env.AUDIO_ACTIVE,
        text: pickOne(this.onAIAsking)!,
      });
    },
    async (msg, data) => {
      // 调用 AI 获取回复
      let answer = await this.askAI?.(msg);
      return { data: { answer } };
    },
    async (msg, data) => {
      if (!data.answer) {
        // 回答异常
        await this.response({
          audio: process.env.AUDIO_ERROR,
          text: pickOne(this.onAIError)!,
          keepAlive: this.keepAlive,
        });
      }
    },
  ];

  async askAIForAnswer(msg: QueryMessage) {
    let data: { answer?: SpeakerAnswer } = {};
    const { hasNewMsg } = this.checkIfHasNewMsg(msg);
    for (const action of this._askAIForAnswerSteps) {
      const res = await action(msg, data);
      if (hasNewMsg()) {
        // 收到新的用户请求消息，终止后续操作和响应
        return;
      }
      if (res?.data) {
        data = { ...data, ...res.data };
      }
      if (res?.stop) {
        break;
      }
    }
    return data.answer;
  }
}
