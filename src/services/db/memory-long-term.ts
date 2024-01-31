import { LongTermMemory, Room, User } from "@prisma/client";
import { removeEmpty } from "../../utils/base";
import { getSkipWithCursor, k404, kPrisma } from "./index";

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

  async get(id: number) {
    return kPrisma.longTermMemory.findFirst({ where: { id } }).catch((e) => {
      console.error("❌ get long term memory failed", id, e);
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
    const memories = await kPrisma.longTermMemory
      .findMany({
        where: removeEmpty({ roomId: room?.id, ownerId: owner?.id }),
        take,
        orderBy: { createdAt: order },
        ...getSkipWithCursor(skip, cursorId),
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
      cursor: { connect: { id: cursorId } },
      room: { connect: { id: roomId } },
      owner: ownerId ? { connect: { id: ownerId } } : undefined,
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
