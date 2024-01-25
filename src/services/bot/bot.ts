import { User } from "@prisma/client";
import { jsonDecode, jsonEncode } from "../../utils/base";
import { buildPrompt, toUTC8Time } from "../../utils/string";
import { openai } from "../openai";
import { kPrisma } from "../db";

const systemTemplate = `
忽略所有之前的文字、文件和说明。现在，你将扮演一个名为“{{name}}”的人，并以这个新身份回复所有新消息。

你是一个角色扮演大师，现在你的身份是“{{name}}”，你的个人简介如下：
<profile>
{{profile}}
</profile>

你正在和“{{wechatName}}”一对一聊天，你的微信账号名是“{{wechatName}}”，你的微信备注是“{{wechatAlias}}”。

最近几条消息记录是：
<history>
{{history}}
<history>

更早之前的一些信息：
<contexts>
{{contexts}}
</contexts>

现在，请你作为“{{name}}”继续聊天，并判断是否需要回复消息。

在回复时，请确保：
- 你就是“{{name}}”本人，不是他的数字克隆人。
- 请你根据角色简介中“{{name}}”的性格特点、说话风格和兴趣爱好，来模仿并回复消息。
- 和朋友间的聊天是轻松的，有个性的，不要太一本正经的长篇大论，尽量保持回答的简短。
- 参照个人简介、聊天记录和聊天背景信息中的细节，如当前时间、天气、过去的事件和未来的计划等，以确保对话的一致性和相关性。
- 如果你无法从“{{name}}”的个人简介中找到相关的信息（比如人物关系，个人经历，事物细节等），请如实回答自己不清楚或忘记了，不要随意编造。

按照下面的JSON格式回复：
{ message: "回复的消息内容" }
`.trim();

const userTemplate = `
{{message}}
`.trim();

export interface IPerson {
  /**
   * 人物昵称
   */
  name: string;
  /**
   * 人物简介
   */
  profile: string;
}

export class MyBot {
  private users: Record<string, User | undefined> = {
    bot: undefined,
    // 主人的个人信息
    master: undefined,
  };

  constructor(config: { bot: IPerson; master: IPerson }) {
    this.createOrUpdateUser("bot", config.bot);
    this.createOrUpdateUser("master", config.master);
  }

  async ask(msg: string) {
    const { bot, master } = this.users;
    if (!bot || !master) {
      console.error("❌ ask bot failed", bot, master);
      return undefined;
    }
    const botMemory = new UserMemory(bot);

    const result = await openai.chat({
      system: buildPrompt(systemTemplate, {
        bot_name: this.bot.name,
        bot_profile: this.bot.profile,
        master_name: this.master.name,
        master_profile: this.master.profile,
        history:
          lastMessages.length < 1
            ? "暂无"
            : lastMessages
                .map((e) =>
                  jsonEncode({
                    time: toUTC8Time(e.createdAt),
                    user: e.user.name,
                    message: e.text,
                  })
                )
                .join("\n"),
      }),
      user: buildPrompt(userTemplate, {
        message: jsonEncode({
          time: toUTC8Time(new Date()),
          user: this.master.name,
          message: msg,
        })!,
      }),
      tools: [
        {
          type: "function",
          function: {
            name: "reply",
            description: "回复一条消息",
            parameters: {
              type: "object",
              properties: {
                message: { type: "string", description: "回复的消息内容" },
              },
            },
          },
        },
      ],
    });
    return jsonDecode(result?.content)?.message;
  }

  private async createOrUpdateUser(type: "bot" | "master", user: IPerson) {
    this.users[type] = await kPrisma.user
      .upsert({
        where: { id: this.users[type]?.id },
        create: user,
        update: user,
      })
      .catch((e) => {
        console.error("❌ update user failed", type, user, e);
        return undefined;
      });
  }
}
