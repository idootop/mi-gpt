import { Memory, Room, User } from "@prisma/client";
import { kPrisma } from ".";

class _MemoryCRUD {
  async count(options?: { cursorId?: number; room?: Room; owner?: User }) {
    const { cursorId, owner, room } = options ?? {};
    return kPrisma.memory
      .count({
        where: {
          id: { gt: cursorId },
          roomId: room?.id,
          ownerId: owner?.id,
        },
      })
      .catch((e) => {
        console.error("❌ get memory count failed", e);
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
    const memories = await kPrisma.memory
      .findMany({
        where: { roomId: room?.id, ownerId: owner?.id },
        take,
        skip,
        cursor: { id: cursorId },
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get memories failed", options, e);
        return [];
      });
    return order === "desc" ? memories.reverse() : memories;
  }

  async addOrUpdate(
    memory: Partial<Memory> & {
      text: string;
      roomId: string;
      ownerId?: string;
    }
  ) {
    const { text: _text, roomId, ownerId } = memory;
    const text = _text?.trim();
    const data = {
      text,
      room: {
        connect: { id: roomId },
      },
      owner: {
        connect: { id: ownerId },
      },
    };
    return kPrisma.memory
      .upsert({
        where: { id: memory.id },
        create: data,
        update: data,
      })
      .catch((e) => {
        console.error("❌ add memory to db failed", memory, e);
        return undefined;
      });
  }
}

export const MemoryCRUD = new _MemoryCRUD();
