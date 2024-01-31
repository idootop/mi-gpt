import { Memory, Room, User } from "@prisma/client";
import { getSkipWithCursor, k404, kPrisma } from "./index";
import { removeEmpty } from "../../utils/base";

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

  async get(id: number) {
    return kPrisma.memory.findFirst({ where: { id } }).catch((e) => {
      console.error("❌ get memory failed", id, e);
      return undefined;
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
        where: removeEmpty({ roomId: room?.id, ownerId: owner?.id }),
        take,
        orderBy: { createdAt: order },
        ...getSkipWithCursor(skip, cursorId),
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
      room: { connect: { id: roomId } },
      owner: ownerId ? { connect: { id: ownerId } } : undefined,
    };
    return kPrisma.memory
      .upsert({
        where: { id: memory.id || k404 },
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
