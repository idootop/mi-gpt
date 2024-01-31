import { Memory } from "@prisma/client";

export class ShortTermMemoryAgent {
  // todo 使用 LLM 生成新的短期记忆
  static async generate(
    newMemories: Memory[],
    lastShortTermMemory?: Memory
  ): Promise<string | undefined> {
    return `count: ${newMemories.length}\n${newMemories
      .map((e, idx) => idx.toString() + ". " + e.text)
      .join("\n")}`;
  }
}
