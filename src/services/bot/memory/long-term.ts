import { LongTermMemory, Memory, ShortTermMemory } from "@prisma/client";
import { openai } from "../../openai";

export class LongTermMemoryAgent {
  // todo 使用 LLM 生成新的长期记忆
  static async generate(options: {
    currentMemory: Memory;
    newMemories: ShortTermMemory[];
    lastMemory?: LongTermMemory;
  }): Promise<string | undefined> {
    const { currentMemory, newMemories, lastMemory } = options;
    const res = await openai.chat({
      user: "todo", // todo prompt
      requestId: `update-long-memory-${currentMemory.id}`,
    });
    return res?.content?.trim();
  }
}
