import { kPrisma } from "../../db";
import { Memory, Message, User } from "@prisma/client";
import { jsonDecode, jsonEncode, lastOf } from "../../../utils/base";
import { ShortTermMemory } from "./short-term";
import { LongTermMemory } from "./long-term";

// todo 在会话中，向会话的参与者分发消息（记忆），公共记忆，个人记忆
export class UserMemory {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  async getRelatedMemories(limit: number): Promise<Memory[]> {
    // todo search memory embeddings
    return [];
  }

  async count(options?: { cursor?: Memory; ownerId?: "all" | string }) {
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

  async gets(options?: {
    ownerId?: "all" | string;
    limit?: number;
    offset?: number;
    cursor?: Memory;
    order?: "asc" | "desc";
  }) {
    const {
      cursor,
      limit = 10,
      offset = 0,
      order = "desc",
      ownerId = this.user.id,
    } = options ?? {};
    const memories = await kPrisma.memory
      .findMany({
        cursor,
        where: {
          ownerId: ownerId.toLowerCase() === "all" ? undefined : ownerId,
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get memories failed", options, e);
        return [];
      });
    const orderedMemories = order === "desc" ? memories.reverse() : memories;
    return orderedMemories.map((e) => {
      return { ...e, content: jsonDecode(e.content)!.data };
    });
  }

  async add(message: Message) {
    // todo create memory embedding
    const data = {
      ownerId: this.user.id,
      type: "message",
      content: jsonEncode({ data: message.text })!,
    };
    const memory = await kPrisma.memory.create({ data }).catch((e) => {
      console.error("❌ add memory to db failed", data, e);
      return undefined;
    });
    if (memory) {
      // 异步更新
      new ShortTermMemory(this.user).update(message, memory);
    }
    return memory;
  }
}

export class MemoryHelper {
  static async updateAndConnectRelations(config: {
    user: User;
    message?: Message;
    memory?: Memory;
    shortTermMemory?: ShortTermMemory;
    longTermMemory?: LongTermMemory;
  }) {
    const { user, message, memory, shortTermMemory, longTermMemory } = config;
    const connect = (key: any, value: any) => {
      if (value) {
        return {
          [key]: {
            connect: [{ id: value.id }],
          },
        };
      }
      return {};
    };
    await kPrisma.user
      .update({
        where: { id: user.id },
        data: {
          ...connect("messages", message),
          ...connect("memories", memory),
          ...connect("shortTermMemories", shortTermMemory),
          ...connect("longTermMemories", longTermMemory),
        },
      })
      .catch((e) => {
        console.error("❌ updateAndConnectRelations failed: user", e);
      });
    if (memory && shortTermMemory) {
      await kPrisma.memory
        .update({
          where: { id: memory.id },
          data: {
            shortTermMemories: {
              connect: [{ id: shortTermMemory.id }],
            },
          },
        })
        .catch((e) => {
          console.error("❌ updateAndConnectRelations failed: memory", e);
        });
    }
    if (shortTermMemory && longTermMemory) {
      await kPrisma.shortTermMemory
        .update({
          where: { id: shortTermMemory?.id },
          data: {
            longTermMemories: {
              connect: [{ id: longTermMemory?.id }],
            },
          },
        })
        .catch((e) => {
          console.error(
            "❌ updateAndConnectRelations failed: shortTermMemory",
            e
          );
        });
    }
  }
}
