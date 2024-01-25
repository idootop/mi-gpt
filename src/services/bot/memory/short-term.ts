import {
  Memory,
  Message,
  User,
  ShortTermMemory as _ShortTermMemory,
} from "@prisma/client";
import { kPrisma } from "../../db";
import { UserMemory } from "./base";
import { lastOf } from "../../../utils/base";
import { LongTermMemory } from "./long-term";

export class ShortTermMemory {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  async getRelatedMemories(limit: number): Promise<_ShortTermMemory[]> {
    // todo search memory embeddings
    return [];
  }

  async count(options?: {
    cursor?: _ShortTermMemory;
    ownerId?: "all" | string;
  }) {
    const { cursor, ownerId = this.user.id } = options ?? {};
    return kPrisma.memory
      .count({
        where: {
          ownerId: ownerId.toLowerCase() === "all" ? undefined : ownerId,
          id: {
            gt: cursor?.id,
          },
        },
      })
      .catch((e) => {
        console.error("❌ get memory count failed", e);
        return -1;
      });
  }

  async get() {
    return kPrisma.shortTermMemory
      .findFirst({
        include: { cursor: true },
        where: { ownerId: this.user.id },
        orderBy: { createdAt: "desc" },
      })
      .catch((e) => {
        console.error("❌ get short memory failed", this.user, e);
        return undefined;
      });
  }

  async gets() {
    return kPrisma.shortTermMemory
      .findFirst({
        include: { cursor: true },
        where: { ownerId: this.user.id },
        orderBy: { createdAt: "desc" },
      })
      .catch((e) => {
        console.error("❌ get short memory failed", this.user, e);
        return undefined;
      });
  }

  async update(
    message: Message,
    memory: Memory,
    threshold = 10 // 每隔 10 条记忆更新一次短期记忆
  ) {
    const current = await this.get();
    const newMemories = await new UserMemory(this.user).gets({
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
      ownerId: this.user.id,
      content,
      cursorId: lastOf(newMemories)!.id,
    };
    // 直接插入新的短期记忆，不更新旧的短期记忆记录
    const shortTermMemory = await kPrisma.shortTermMemory
      .create({ data })
      .catch((e) => {
        console.error(
          "❌ add or update shortTermMemory failed",
          current,
          data,
          e
        );
        return undefined;
      });
    if (shortTermMemory) {
      // 异步更新
      LongTermMemory.update(this.user, message, memory, shortTermMemory);
    }
    return memory;
  }
}
