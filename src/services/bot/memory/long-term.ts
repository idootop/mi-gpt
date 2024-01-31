import { Memory, ShortTermMemory } from "@prisma/client";

export class LongTermMemoryAgent {
  // todo 使用 LLM 生成新的长期记忆
  static async generate(
    newMemories: Memory[],
    lastLongTermMemory?: ShortTermMemory
  ): Promise<string | undefined> {
    return `count: ${newMemories.length}\n${newMemories
      .map((e, idx) => idx.toString() + ". " + e.text)
      .join("\n")}`;
  }
}
