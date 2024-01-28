import { Memory, ShortTermMemory } from "@prisma/client";

export class LongTermMemoryAgent {
  // todo 使用 LLM 生成新的长期记忆
  static async generate(
    newMemories: Memory[],
    lastLongTermMemory?: ShortTermMemory
  ): Promise<string | undefined> {
    return "";
  }
}
