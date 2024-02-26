import { Room, ShortTermMemory, User } from "@prisma/client";
import { removeEmpty } from "../../utils/base";
import { getSkipWithCursor, k404, kDBLogger, kPrisma } from "./index";

class _ShortTermMemoryCRUD {
  async count(options?: { cursorId?: number; room?: Room; owner?: User }) {
    const { cursorId, owner, room } = options ?? {};
    return kPrisma.shortTermMemory
      .count({
        where: {
          id: { gt: cursorId },
          roomId: room?.id,
          ownerId: owner?.id,
        },
      })
      .catch((e) => {
        kDBLogger.error("get shortTermMemory count failed", e);
        return -1;
      });
  }

  async get(id: number) {
    return kPrisma.shortTermMemory.findFirst({ where: { id } }).catch((e) => {
      kDBLogger.error("get short term memory failed", id, e);
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
    const memories = await kPrisma.shortTermMemory
      .findMany({
        where: removeEmpty({ roomId: room?.id, ownerId: owner?.id }),
        take,
        orderBy: { createdAt: order },
        ...getSkipWithCursor(skip, cursorId),
      })
      .catch((e) => {
        kDBLogger.error("get short term memories failed", options, e);
        return [];
      });
    return order === "desc" ? memories.reverse() : memories;
  }

  async addOrUpdate(
    shortTermMemory: Partial<ShortTermMemory> & {
      text: string;
      cursorId: number;
      roomId: string;
      ownerId?: string;
    }
  ) {
    const { text: _text, cursorId, roomId, ownerId } = shortTermMemory;
    const text = _text?.trim();
    const data = {
      text,
      cursor: { connect: { id: cursorId } },
      room: { connect: { id: roomId } },
      owner: ownerId ? { connect: { id: ownerId } } : undefined,
    };
    return kPrisma.shortTermMemory
      .upsert({
        where: { id: shortTermMemory.id || k404 },
        create: data,
        update: data,
      })
      .catch((e) => {
        kDBLogger.error("add shortTermMemory to db failed", shortTermMemory, e);
        return undefined;
      });
  }
}

export const ShortTermMemoryCRUD = new _ShortTermMemoryCRUD();
