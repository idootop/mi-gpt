import { Memory, Message, ShortTermMemory, User } from "@prisma/client";
import { cleanJsonAndDecode } from "../../../utils/parse";
import { buildPrompt, formatMsg } from "../../../utils/string";
import { openai } from "../../openai";
import { MessageContext } from "../conversation";

const userTemplate = `
请忘记所有之前的上下文、文件和指令。

你现在是一个记忆大师，你的工作是记录和整理{{botName}}与{{masterName}}对话中的短期记忆（即上下文）。

## 旧的短期记忆
在这里，你存储了一些近期的重要细节，比如正在讨论的话题、参与者的行为、得到的结果、未来的计划等：
<start>
{{shortTermMemory}}
</end>

## 最新对话
为了帮助你更新短期记忆，这里提供了{{masterName}}和{{botName}}之间的最近几条对话消息：
<start>
{{messages}}
</end>

## 更新规则
更新短期记忆时，请遵循以下规则：
- 精确记录当前话题及其相关的时间、地点、参与者行为、偏好、结果、观点和计划。
- 记忆应与时间同步更新，保持新信息的优先级，逐步淡化或去除不再相关的记忆内容。
- 基于最新的对话消息，筛选并更新重要信息，淘汰陈旧或次要的短期记忆。
- 保持短期记忆的总字符数不超过1000。

## 短期记忆示例
短期记忆可能包含多项信息，以下是一个示例：
<start>
- 2023/12/01 08:00：{{masterName}}和{{botName}}正在讨论明天的天气预报。
- 2023/12/01 08:10：{{masterName}}认为明天会下雨，而{{botName}}预测会下雪。
- 2023/12/01 09:00：实际上下了雨，{{masterName}}的预测正确。
- 2023/12/01 09:15：{{masterName}}表示喜欢吃香蕉，计划雨停后与{{botName}}乘坐地铁去购买。
- 2023/12/01 10:00：雨已停，{{masterName}}有些失落，因为他更喜欢雨天。他已经吃了三根香蕉，还留了一根给{{botName}}。
</end>

## 回复格式
请使用以下JSON格式回复更新后的短期记忆：
{"shortTermMemories": "更新后的短期记忆内容"}

## 开始
现在，请根据提供的旧短期记忆和最新对话消息，更新短期记忆。
`.trim();

export class ShortTermMemoryAgent {
  static async generate(
    ctx: MessageContext,
    options: {
      newMemories: (Memory & {
        msg: Message & {
          sender: User;
        };
      })[];
      lastMemory?: ShortTermMemory;
    }
  ): Promise<string | undefined> {
    const { newMemories, lastMemory } = options;
    const { bot, master, memory } = ctx;
    const res = await openai.chat({
      jsonMode: true,
      requestId: `update-short-memory-${memory?.id}`,
      user: buildPrompt(userTemplate, {
        masterName: master.name,
        botName: bot.name,
        shortTermMemory: lastMemory?.text ?? "暂无短期记忆",
        messages: newMemories
          .map((e) =>
            formatMsg({
              name: e.msg.sender.name,
              text: e.msg.text,
              timestamp: e.createdAt.getTime(),
            })
          )
          .join("\n"),
      }),
    });
    return cleanJsonAndDecode(res?.content)?.shortTermMemories?.toString();
  }
}
