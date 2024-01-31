import { Prisma, Room, User } from "@prisma/client";
import { k404, kPrisma } from ".";

export function getRoomID(users: User[]) {
  return users
    .map((e) => e.id)
    .sort()
    .join("_");
}

class _RoomCRUD {
  async count(options?: { user?: User }) {
    const { user } = options ?? {};
    return kPrisma.room
      .count({
        where: {
          members: {
            some: {
              id: user?.id,
            },
          },
        },
      })
      .catch((e) => {
        console.error("❌ get room count failed", e);
        return -1;
      });
  }

  async get(id: string) {
    return kPrisma.room.findFirst({ where: { id } }).catch((e) => {
      console.error("❌ get room failed", id, e);
      return undefined;
    });
  }

  async gets(options?: {
    user?: User;
    take?: number;
    skip?: number;
    cursorId?: string;
    include?: Prisma.RoomInclude;
    /**
     * 查询顺序（返回按从旧到新排序）
     */
    order?: "asc" | "desc";
  }) {
    const {
      user,
      take = 10,
      skip = 0,
      cursorId,
      include = { members: true },
      order = "desc",
    } = options ?? {};
    const rooms = await kPrisma.room
      .findMany({
        where: { members: { some: { id: user?.id } } },
        take,
        skip,
        cursor: { id: cursorId },
        include,
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get rooms failed", options, e);
        return [];
      });
    return order === "desc" ? rooms.reverse() : rooms;
  }

  async addOrUpdate(
    room: Partial<Room> & {
      name: string;
      description: string;
    }
  ) {
    room.name = room.name.trim();
    room.description = room.description.trim();
    return kPrisma.room
      .upsert({
        where: { id: room.id || k404.toString() },
        create: room,
        update: room,
      })
      .catch((e) => {
        console.error("❌ add room to db failed", room, e);
        return undefined;
      });
  }
}

export const RoomCRUD = new _RoomCRUD();
