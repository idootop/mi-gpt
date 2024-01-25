import { Memory, Message, User } from "@prisma/client";
import { kPrisma } from "../../db";
import { MemoryHelper, UserMemory } from "./base";
import { lastOf } from "../../../utils/base";
import { ShortTermMemory } from "./long-term";

export class LongTermMemory {
  static async get(user: User) {
    return kPrisma.longTermMemory
      .findFirst({
        include: { cursor: true },
        where: { ownerId: user.id },
      })
      .catch((e) => {
        console.error("❌ get long memory failed", user, e);
        return undefined;
      });
  }

  static async update(
    user: User,
    message: Message,
    memory: Memory,
    shortTermMemory: ShortTermMemory,
    threshold = 10 // 每隔 10 条记忆更新一次短期记忆
  ) {
    const current = await LongTermMemory.get(user);
    const newMemories = await new ShortTermMemory(user).gets({
      ownerId: "all",
      cursor: current?.cursor,
      order: "asc", // 从旧到新排序
    });
    if (newMemories.length < threshold) {
      return undefined;
    }
    // todo update memory
    const content = "todo";
    const data = {
      ownerId: user.id,
      content,
      cursorId: lastOf(newMemories)!.id,
    };
    // 直接插入新的长期记忆，不更新旧的长期记忆记录
    const longTermMemory = await kPrisma.longTermMemory
      .create({ data })
      .catch((e) => {
        console.error(
          "❌ add or update longTermMemory failed",
          current,
          data,
          e
        );
        return undefined;
      });
    if (longTermMemory) {
      // 异步更新
      MemoryHelper.updateAndConnectRelations({
        user,
        message,
        memory,
        shortTermMemory,
        longTermMemory,
      });
    }
    return memory;
  }
}
