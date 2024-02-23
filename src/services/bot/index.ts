import { jsonDecode, jsonEncode } from "../../utils/base";
import { buildPrompt, toUTC8Time } from "../../utils/string";
import { openai } from "../openai";
import { IBotConfig } from "./config";
import { ConversationManager } from "./conversation";

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

export class MyBot {
  private manager: ConversationManager;
  constructor(config: IBotConfig) {
    this.manager = new ConversationManager(config);
  }

  async ask(msg: string) {
    const { bot, master, room, memory } = await this.manager.get();
    if (!memory) {
      return;
    }
    const lastMessages = await this.manager.getMessages({
      take: 10,
    });
    const result = await openai.chat({
      system: buildPrompt(systemTemplate, {
        bot_name: bot!.name,
        bot_profile: bot!.profile,
        master_name: master!.name,
        master_profile: master!.profile,
        history:
          lastMessages.length < 1
            ? "暂无"
            : lastMessages
                .map((e) =>
                  jsonEncode({
                    time: toUTC8Time(e.createdAt),
                    user: e.sender.name,
                    message: e.text,
                  })
                )
                .join("\n"),
      }),
      user: buildPrompt(userTemplate, {
        message: jsonEncode({
          time: toUTC8Time(new Date()),
          user: master!.name,
          message: msg,
        })!,
      }),
    });
    return jsonDecode(result?.content)?.message;
  }
}
