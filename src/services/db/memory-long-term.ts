import { LongTermMemory, Room, User } from "@prisma/client";
import { k404, kPrisma } from ".";

class _LongTermMemoryCRUD {
  async count(options?: { cursorId?: number; room?: Room; owner?: User }) {
    const { cursorId, owner, room } = options ?? {};
    return kPrisma.longTermMemory
      .count({
        where: {
          id: { gt: cursorId },
          roomId: room?.id,
          ownerId: owner?.id,
        },
      })
      .catch((e) => {
        console.error("❌ get longTermMemory count failed", e);
        return -1;
      });
  }

  async gets(options?: {
    room?: Room;
    owner?: User;
    take?: number;
    skip?: number;
    cursorId?: number;
    /**
     * 查询顺序（返回按从旧到新排序）
     */
    order?: "asc" | "desc";
  }) {
    const {
      room,
      owner,
      take = 10,
      skip = 0,
      cursorId,
      order = "desc",
    } = options ?? {};
    const memories = await kPrisma.longTermMemory
      .findMany({
        where: { roomId: room?.id, ownerId: owner?.id },
        take,
        skip,
        cursor: { id: cursorId },
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get long term memories failed", options, e);
        return [];
      });
    return order === "desc" ? memories.reverse() : memories;
  }

  async addOrUpdate(
    longTermMemory: Partial<LongTermMemory> & {
      text: string;
      cursorId: number;
      roomId: string;
      ownerId?: string;
    }
  ) {
    const { text: _text, cursorId, roomId, ownerId } = longTermMemory;
    const text = _text?.trim();
    const data = {
      text,
      cursor: {
        connect: { id: cursorId },
      },
      room: {
        connect: { id: roomId },
      },
      owner: {
        connect: { id: ownerId },
      },
    };
    return kPrisma.longTermMemory
      .upsert({
        where: { id: longTermMemory.id || k404 },
        create: data,
        update: data,
      })
      .catch((e) => {
        console.error("❌ add longTermMemory to db failed", longTermMemory, e);
        return undefined;
      });
  }
}

export const LongTermMemoryCRUD = new _LongTermMemoryCRUD();
