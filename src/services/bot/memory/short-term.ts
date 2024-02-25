import { Memory, ShortTermMemory } from "@prisma/client";
import { openai } from "../../openai";

export class ShortTermMemoryAgent {
  // todo 使用 LLM 生成新的短期记忆
  static async generate(options: {
    currentMemory: Memory;
    newMemories: Memory[];
    lastMemory?: ShortTermMemory;
  }): Promise<string | undefined> {
    const { currentMemory, newMemories, lastMemory } = options;
    const res = await openai.chat({
      user: "todo", // todo prompt
      requestId: `update-short-memory-${currentMemory.id}`,
    });
    return res?.content?.trim();
  }
}
