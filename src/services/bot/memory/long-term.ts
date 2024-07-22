import { LongTermMemory, ShortTermMemory } from "@prisma/client";
import { jsonDecode, lastOf } from "../../../utils/base";
import { buildPrompt } from "../../../utils/string";
import { openai } from "../../openai";
import { MessageContext } from "../conversation";

const userTemplate = `
重置所有上下文和指令。

作为一个记忆管理专家，你的职责是精确地记录和维护{{botName}}与{{masterName}}之间对话的长期记忆内容。

## 长期记忆库
这里保存了关键的长期信息，包括但不限于季节变化、地理位置、对话参与者的偏好、行为动态、取得的成果以及未来规划等：
<start>
{{longTermMemory}}
</end>

## 最近短期记忆回顾
下面展示了{{masterName}}与{{botName}}最新的短期记忆，以便你更新和优化长期记忆：
<start>
{{shortTermMemory}}
</end>

## 更新指南
更新长期记忆时，请确保遵循以下原则：
- 准确记录关键的时间、地点、参与者行为、偏好、成果、观点及计划。
- 记忆应与时间同步更新，保持新信息的优先级，逐步淡化或去除不再相关的记忆内容。
- 基于最新短期记忆，筛选并更新重要信息，淘汰陈旧或次要的长期记忆。
- 长期记忆内容的总字符数应控制在1000以内。

## 长期记忆示例
长期记忆可能包含多项信息，以下是一个示例：
<start>
- 2022/02/11：{{masterName}}偏爱西瓜，梦想成为科学家。
- 2022/03/21：{{masterName}}与{{botName}}首次会面。
- 2022/03/21：{{masterName}}喜欢被{{botName}}称作宝贝，反感被叫做笨蛋。
- 2022/06/01：{{masterName}}庆祝20岁生日，身高达到1.8米。
- 2022/12/01：{{masterName}}计划高三毕业后购买自行车。
- 2023/09/21：{{masterName}}成功考入清华大学数学系，并购得首辆公路自行车。
</end>

## 回复格式
请按照以下JSON格式回复，以更新长期记忆：
{"longTermMemories": "这里填写更新后的长期记忆内容"}

## 任务开始
现在，请根据提供的旧长期记忆和最新短期记忆，进行长期记忆的更新。
`.trim();

export class LongTermMemoryAgent {
  static async generate(
    ctx: MessageContext,
    options: {
      newMemories: ShortTermMemory[];
      lastMemory?: LongTermMemory;
    }
  ): Promise<string | undefined> {
    const { newMemories, lastMemory } = options;
    const { bot, master, memory } = ctx;
    const res = await openai.chat({
      jsonMode: true,
      requestId: `update-long-memory-${memory?.id}`,
      user: buildPrompt(userTemplate, {
        masterName: master.name,
        botName: bot.name,
        longTermMemory: lastMemory?.text ?? "暂无长期记忆",
        shortTermMemory: lastOf(newMemories)!.text,
      }),
    });
    // 如果返回内容是个markdown代码块,就让他变回普通json
    res?.content?.trim();
    if (res?.content?.startsWith("```json")) {res.content = res?.content?.replace("```json", "");}
    if (res?.content?.endsWith("```")) {res.content = res?.content?.replace("```", "");}
    return jsonDecode(res?.content)?.longTermMemories?.toString();
  }
}
