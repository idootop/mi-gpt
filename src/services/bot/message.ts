import { Message, User } from "@prisma/client";
import { kPrisma } from "../db";
import { UserMemory } from "./memory";

class _MessageHistory {
  async count(options?: { cursor?: Message; sender?: User }) {
    const { sender, cursor } = options ?? {};
    return kPrisma.message
      .count({
        where: {
          senderId: sender?.id,
          id: {
            gt: cursor?.id,
          },
        },
      })
      .catch((e) => {
        console.error("❌ get msg count failed", e);
        return -1;
      });
  }

  /**
   * 查询历史消息，消息从旧到新排序
   */
  async gets(options?: {
    sender?: User;
    limit?: number;
    offset?: number;
    cursor?: Message;
    order?: "asc" | "desc";
  }) {
    const {
      limit = 10,
      offset = 0,
      order = "desc",
      sender,
      cursor,
    } = options ?? {};
    const msgs = await kPrisma.message
      .findMany({
        cursor,
        where: { senderId: sender?.id },
        take: limit,
        skip: offset,
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get msgs failed", options, e);
        return [];
      });
    return order === "desc" ? msgs.reverse() : msgs;
  }

  async addOrUpdate(
    msg: Partial<Message> & {
      text: string;
      sender: User;
    }
  ) {
    const data = {
      text: msg.text,
      senderId: msg.sender?.id,
    };
    const message = await kPrisma.message
      .upsert({
        where: { id: msg.id },
        create: data,
        update: data,
      })
      .catch((e) => {
        console.error("❌ add msg to db failed", msg, e);
        return undefined;
      });
    if (message) {
      // 异步更新记忆
      new UserMemory(msg.sender).add(message);
    }
    return message;
  }
}

export const MessageHistory = new _MessageHistory();
