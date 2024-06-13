import { randomUUID } from "crypto";
import { buildPrompt, formatMsg } from "../../utils/string";
import { DeepPartial } from "../../utils/type";
import { ChatOptions, openai } from "../openai";
import { AISpeaker } from "../speaker/ai";
import { QueryMessage, SpeakerAnswer } from "../speaker/speaker";
import { StreamResponse } from "../speaker/stream";
import { IBotConfig } from "./config";
import { ConversationManager, MessageContext } from "./conversation";

const kDefaultSystemTemplate = `
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

const userTemplate = `
{{message}}
`.trim();

export type MyBotConfig = DeepPartial<IBotConfig> & {
  speaker: AISpeaker;
  systemTemplate?: string;
};

export class MyBot {
  speaker: AISpeaker;
  manager: ConversationManager;
  systemTemplate?: string;
  constructor(config: MyBotConfig) {
    this.speaker = config.speaker;
    this.systemTemplate = config.systemTemplate;
    this.manager = new ConversationManager(config);
    // 更新 bot 人设命令
    // 比如：你是蔡徐坤，你喜欢唱跳rap。
    this.speaker.addCommand({
      match: (msg) =>
        /.*你是(?<name>[^你]*)你(?<profile>.*)/.exec(msg.text) != null,
      run: async (msg) => {
        const res = /.*你是(?<name>[^你]*)你(?<profile>.*)/.exec(msg.text)!;
        const name = res[1];
        const profile = res[2];
        const config = await this.manager.update({
          bot: { name, profile },
        });
        if (config) {
          this.speaker.name = config?.bot.name;
          await this.speaker.response({
            text: `你好，我是${name}，很高兴认识你！`,
            keepAlive: this.speaker.keepAlive,
          });
        } else {
          await this.speaker.response({
            text: `召唤${name}失败，请稍后再试吧！`,
            keepAlive: this.speaker.keepAlive,
          });
        }
      },
    });
    this.speaker.addCommand({
      match: (msg) =>
        /.*我是(?<name>[^我]*)我(?<profile>.*)/.exec(msg.text) != null,
      run: async (msg) => {
        const res = /.*我是(?<name>[^我]*)我(?<profile>.*)/.exec(msg.text)!;
        const name = res[1];
        const profile = res[2];
        const config = await this.manager.update({
          bot: { name, profile },
        });
        if (config) {
          this.speaker.name = config?.bot.name;
          await this.speaker.response({
            text: `好的主人，我记住了！`,
            keepAlive: this.speaker.keepAlive,
          });
        } else {
          await this.speaker.response({
            text: `哎呀出错了，请稍后再试吧！`,
            keepAlive: this.speaker.keepAlive,
          });
        }
      },
    });
  }

  stop() {
    return this.speaker.stop();
  }

  async run() {
    this.speaker.askAI = (msg) => this.ask(msg);
    const { bot } = await this.manager.init();
    if (bot) {
      this.speaker.name = bot.name;
    }
    return this.speaker.run();
  }

  async ask(msg: QueryMessage): Promise<SpeakerAnswer> {
    const { bot, master, room, memory } = await this.manager.get();
    if (!memory) {
      return {};
    }
    const ctx = { bot, master, room } as MessageContext;
    const lastMessages = await this.manager.getMessages({ take: 10 });
    const shortTermMemories = await memory.getShortTermMemories({ take: 1 });
    const shortTermMemory = shortTermMemories[0]?.text ?? "短期记忆为空";
    const longTermMemories = await memory.getLongTermMemories({ take: 1 });
    const longTermMemory = longTermMemories[0]?.text ?? "长期记忆为空";
    const systemPrompt = buildPrompt(
      this.systemTemplate ?? kDefaultSystemTemplate,
      {
        shortTermMemory,
        longTermMemory,
        botName: bot!.name,
        botProfile: bot!.profile.trim(),
        masterName: master!.name,
        masterProfile: master!.profile.trim(),
        roomName: room!.name,
        roomIntroduction: room!.description.trim(),
        messages:
          lastMessages.length < 1
            ? "暂无历史消息"
            : lastMessages
                .map((e) =>
                  formatMsg({
                    name: e.sender.name,
                    text: e.text,
                    timestamp: e.createdAt.getTime(),
                  })
                )
                .join("\n"),
      }
    );
    const userPrompt = buildPrompt(userTemplate, {
      message: formatMsg({
        name: master!.name,
        text: msg.text,
        timestamp: msg.timestamp,
      }),
    });
    // 添加请求消息到 DB
    await this.manager.onMessage(ctx, { ...msg, sender: master! });
    const stream = await MyBot.chatWithStreamResponse({
      system: systemPrompt,
      user: userPrompt,
      onFinished: async (text) => {
        if (text) {
          // 添加响应消息到 DB
          await this.manager.onMessage(ctx, {
            text,
            sender: bot!,
            timestamp: Date.now(),
          });
        }
      },
    });
    return { stream };
  }

  static async chatWithStreamResponse(
    options: ChatOptions & {
      onFinished?: (text: string) => void;
    }
  ) {
    const requestId = randomUUID();
    const stream = new StreamResponse({ firstSubmitTimeout: 3 * 1000 });
    openai
      .chatStream({
        ...options,
        requestId,
        trace: true,
        onStream: (text) => {
          if (stream.status === "canceled") {
            return openai.cancel(requestId);
          }
          stream.addResponse(text);
        },
      })
      .then((answer) => {
        if (answer) {
          stream.finish(answer);
          options.onFinished?.(answer);
        } else {
          stream.finish(answer);
          stream.cancel();
        }
      });
    return stream;
  }
}
