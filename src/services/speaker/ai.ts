import { pickOne, toSet } from "../../utils/base";
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
   * AI 开始回答时的提示语
   *
   * 比如：请稍等，让我想想
   */
  onAIAsking?: string[];
  /**
   * AI 结束回答时的提示语
   *
   * 比如：我说完了，还有替他问题吗？
   */
  onAIReplied?: string[];
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
   * 当消息以召唤关键词开头时，会调用 AI 来响应用户消息
   *
   * 比如：请，你，问问傻妞
   */
  callAIKeywords?: string[];
  /**
   * 切换音色前缀
   *
   * 比如：音色切换到（文静毛毛）
   */
  switchSpeakerKeywords?: string[];
  /**
   * 唤醒关键词
   *
   * 当消息中包含唤醒关键词时，会进入 AI 唤醒状态
   *
   * 比如：打开/进入/召唤傻妞
   */
  wakeUpKeywords?: string[];
  /**
   * 退出关键词
   *
   * 当消息中包含退出关键词时，会退出 AI 唤醒状态
   *
   * 比如：关闭/退出/再见傻妞
   */
  exitKeywords?: string[];
  /**
   * 进入 AI 模式的欢迎语
   *
   * 比如：你好，我是傻妞，很高兴认识你
   */
  onEnterAI?: string[];
  /**
   * 退出 AI 模式的提示语
   *
   * 比如：傻妞已退出
   */
  onExitAI?: string[];
  /**
   * AI 回答开始提示音
   */
  audioActive?: string;
  /**
   * AI 回答异常提示音
   */
  audioError?: string;
};

type AnswerStep = (
  msg: any,
  data: any
) => Promise<{ stop?: boolean; data?: any } | void>;

export class AISpeaker extends Speaker {
  askAI: AISpeakerConfig["askAI"];
  name: string;
  switchSpeakerKeywords: string[];
  onEnterAI: string[];
  onExitAI: string[];
  callAIKeywords: string[];
  wakeUpKeywords: string[];
  exitKeywords: string[];
  onAIAsking: string[];
  onAIReplied: string[];
  onAIError: string[];
  audioActive?: string;
  audioError?: string;

  constructor(config: AISpeakerConfig) {
    super(config);
    const {
      askAI,
      name = "傻妞",
      switchSpeakerKeywords,
      callAIKeywords = ["请", "你", "傻妞"],
      wakeUpKeywords = ["打开", "进入", "召唤"],
      exitKeywords = ["关闭", "退出", "再见"],
      onEnterAI = ["你好，我是傻妞，很高兴认识你"],
      onExitAI = ["傻妞已退出"],
      onAIAsking = ["让我先想想", "请稍等"],
      onAIReplied = ["我说完了", "还有其他问题吗"],
      onAIError = ["啊哦，出错了，请稍后再试吧！"],
      audioActive = process.env.AUDIO_ACTIVE,
      audioError = process.env.AUDIO_ERROR,
    } = config;
    this.askAI = askAI;
    this.name = name;
    this.callAIKeywords = callAIKeywords;
    this.wakeUpKeywords = wakeUpKeywords;
    this.exitKeywords = exitKeywords;
    this.onEnterAI = onEnterAI;
    this.onExitAI = onExitAI;
    this.onAIError = onAIError;
    this.onAIAsking = onAIAsking;
    this.onAIReplied = onAIReplied;
    this.audioActive = audioActive;
    this.audioError = audioError;
    this.switchSpeakerKeywords =
      switchSpeakerKeywords ?? getDefaultSwitchSpeakerPrefix();
  }

  async enterKeepAlive() {
    if (!this.streamResponse) {
      await this.response({ text: "您已关闭流式响应(streamResponse)，无法使用连续对话模式" });
      return;
    }
    // 回应
    const text = pickOne(this.onEnterAI);
    if (text) {
      await this.response({ text, keepAlive: true });
    }
    // 唤醒
    await super.enterKeepAlive();
  }

  async exitKeepAlive() {
    // 退出唤醒状态
    await super.exitKeepAlive();
    // 回应
    const text = pickOne(this.onExitAI);
    if (text) {
      await this.response({ text, keepAlive: false, playSFX: false });
    }
    await this.unWakeUp();
  }

  get commands() {
    return [
      {
        match: (msg) =>
          !this.keepAlive &&
          this.wakeUpKeywords.some((e) => msg.text.startsWith(e)),
        run: async (msg) => {
          await this.enterKeepAlive();
        },
      },
      {
        match: (msg) =>
          this.keepAlive &&
          this.exitKeywords.some((e) => msg.text.startsWith(e)),
        run: async (msg) => {
          await this.exitKeepAlive();
        },
      },
      {
        match: (msg) =>
          this.switchSpeakerKeywords.some((e) => msg.text.startsWith(e)),
        run: async (msg) => {
          await this.response({
            text: "正在切换音色，请稍等...",
          });
          const prefix = this.switchSpeakerKeywords.find((e) =>
            msg.text.startsWith(e)
          )!;
          const speaker = msg.text.replace(prefix, "");
          const success = await this.switchSpeaker(speaker);
          await this.response({
            text: success ? "音色已切换！" : "音色切换失败！",
            keepAlive: this.keepAlive,
          });
        },
      },
      // todo 考虑添加清除上下文指令
      ...this._commands,
      {
        match: (msg) =>
          this.keepAlive ||
          this.callAIKeywords.some((e) => msg.text.startsWith(e)),
        run: (msg) => this.askAIForAnswer(msg),
      },
    ] as SpeakerCommand[];
  }

  private _askAIForAnswerSteps: AnswerStep[] = [
    async (msg, data) => {
      // 思考中
      const text = pickOne(this.onAIAsking);
      if (text) {
        await this.response({ text, audio: this.audioActive });
      }
    },
    async (msg, data) => {
      // 调用 AI 获取回复
      let answer = await this.askAI?.(msg);
      return { data: { answer } };
    },
    async (msg, data) => {
      // 开始回复
      if (data.answer) {
        const res = await this.response({ ...data.answer });
        return { data: { ...data, res } };
      }
    },
    async (msg, data) => {
      if (
        data.answer &&
        data.res == null &&
        !this.audioBeep &&
        this.streamResponse
      ) {
        // 回复完毕
        const text = pickOne(this.onAIReplied);
        if (text) {
          await this.response({ text });
        }
      }
    },
    async (msg, data) => {
      if (data.res === "error") {
        // 回答异常
        const text = pickOne(this.onAIError);
        if (text) {
          await this.response({ text, audio: this.audioError });
        }
      }
    },
    async (msg, data) => {
      if (this.keepAlive) {
        // 重新唤醒
        await this.wakeUp();
      }
    },
  ];

  async askAIForAnswer(msg: QueryMessage) {
    let data: { answer?: SpeakerAnswer } = {};
    const { hasNewMsg } = this.checkIfHasNewMsg(msg);
    for (const action of this._askAIForAnswerSteps) {
      const res = await action(msg, data);
      if (hasNewMsg() || this.status !== "running") {
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
  }
}

const getDefaultSwitchSpeakerPrefix = () => {
  const words = [
    ["把", ""],
    ["音色", "声音"],
    ["切换", "换", "调"],
    ["到", "为", "成"],
  ];

  const generateSentences = (words: string[][]) => {
    const results: string[] = [];
    const generate = (currentSentence: string[], index: number) => {
      if (index === words.length) {
        results.push(currentSentence.join(""));
        return;
      }
      for (const word of words[index]) {
        currentSentence.push(word);
        generate(currentSentence, index + 1);
        currentSentence.pop();
      }
    };
    generate([], 0);
    return results;
  };

  return generateSentences(words);
};
