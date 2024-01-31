import { Message, Prisma, Room, User } from "@prisma/client";
import { k404, kPrisma } from ".";

class _MessageCRUD {
  async count(options?: { cursorId?: number; room?: Room; sender?: User }) {
    const { cursorId, sender, room } = options ?? {};
    return kPrisma.message
      .count({
        where: {
          id: { gt: cursorId },
          roomId: room?.id,
          senderId: sender?.id,
        },
      })
      .catch((e) => {
        console.error("❌ get message count failed", e);
        return -1;
      });
  }

  async get(id: number) {
    return kPrisma.message.findFirst({ where: { id } }).catch((e) => {
      console.error("❌ get message failed", id, e);
      return undefined;
    });
  }

  async gets(options?: {
    room?: Room;
    sender?: User;
    take?: number;
    skip?: number;
    cursorId?: number;
    include?: Prisma.MessageInclude;
    /**
     * 查询顺序（返回按从旧到新排序）
     */
    order?: "asc" | "desc";
  }) {
    const {
      room,
      sender,
      take = 10,
      skip = 0,
      cursorId,
      include = { sender: true },
      order = "desc",
    } = options ?? {};
    const messages = await kPrisma.message
      .findMany({
        where: { roomId: room?.id, senderId: sender?.id },
        take,
        skip,
        include,
        cursor: { id: cursorId },
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get messages failed", options, e);
        return [];
      });
    return order === "desc" ? messages.reverse() : messages;
  }

  async addOrUpdate(
    message: Partial<Message> & {
      text: string;
      roomId: string;
      senderId: string;
    }
  ) {
    const { text: _text, roomId, senderId } = message;
    const text = _text?.trim();
    const data = {
      text,
      room: {
        connect: { id: roomId },
      },
      sender: {
        connect: { id: senderId },
      },
    };
    return kPrisma.message
      .upsert({
        where: { id: message.id || k404 },
        create: data,
        update: data,
      })
      .catch((e) => {
        console.error("❌ add message to db failed", message, e);
        return undefined;
      });
  }
}

export const MessageCRUD = new _MessageCRUD();
