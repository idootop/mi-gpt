import { Memory, Prisma, Room, User } from "@prisma/client";
import { removeEmpty } from "../../utils/base";
import { getSkipWithCursor, k404, kDBLogger, kPrisma } from "./index";

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
        kDBLogger.error("get memory count failed", e);
        return -1;
      });
  }

  async get(
    id: number,
    options?: {
      include?: Prisma.MemoryInclude;
    }
  ) {
    const {
      include = {
        msg: {
          include: { sender: true },
        },
      },
    } = options ?? {};
    return kPrisma.memory.findFirst({ where: { id }, include }).catch((e) => {
      kDBLogger.error("get memory failed", id, e);
      return undefined;
    });
  }

  async gets(options?: {
    room?: Room;
    owner?: User;
    take?: number;
    skip?: number;
    cursorId?: number;
    include?: Prisma.MemoryInclude;
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
      include = {
        msg: {
          include: { sender: true },
        },
      },
      order = "desc",
    } = options ?? {};
    const memories = await kPrisma.memory
      .findMany({
        where: removeEmpty({ roomId: room?.id, ownerId: owner?.id }),
        take,
        include,
        orderBy: { createdAt: order },
        ...getSkipWithCursor(skip, cursorId),
      })
      .catch((e) => {
        kDBLogger.error("get memories failed", options, e);
        return [];
      });
    return order === "desc" ? memories.reverse() : memories;
  }

  async addOrUpdate(
    memory: Partial<Memory> & {
      msgId: number;
      roomId: string;
      ownerId?: string;
    }
  ) {
    const { msgId, roomId, ownerId } = memory;
    const data = {
      msg: { connect: { id: msgId } },
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
        kDBLogger.error("add memory to db failed", memory, e);
        return undefined;
      });
  }
}

export const MemoryCRUD = new _MemoryCRUD();
