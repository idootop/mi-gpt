import { Prisma, User } from "@prisma/client";
import { getSkipWithCursor, k404, kDBLogger, kPrisma } from "./index";

class _UserCRUD {
  async count() {
    return kPrisma.user.count().catch((e) => {
      kDBLogger.error("get user count failed", e);
      return -1;
    });
  }

  async get(
    id: string,
    options?: {
      include?: Prisma.UserInclude;
    }
  ) {
    const { include = { rooms: false } } = options ?? {};
    return kPrisma.user.findFirst({ where: { id }, include }).catch((e) => {
      kDBLogger.error("get user failed", id, e);
      return undefined;
    });
  }

  async gets(options?: {
    take?: number;
    skip?: number;
    cursorId?: string;
    include?: Prisma.UserInclude;
    /**
     * 查询顺序（返回按从旧到新排序）
     */
    order?: "asc" | "desc";
  }) {
    const {
      take = 10,
      skip = 0,
      cursorId,
      include = { rooms: false },
      order = "desc",
    } = options ?? {};
    const users = await kPrisma.user
      .findMany({
        take,
        include,
        orderBy: { createdAt: order },
        ...getSkipWithCursor(skip, cursorId),
      })
      .catch((e) => {
        kDBLogger.error("get users failed", options, e);
        return [];
      });
    return order === "desc" ? users.reverse() : users;
  }

  async addOrUpdate(
    user: Partial<User> & {
      name: string;
      profile: string;
    }
  ) {
    user.name = user.name.trim();
    user.profile = user.profile.trim();
    return kPrisma.user
      .upsert({
        where: { id: user.id || k404.toString() },
        create: user,
        update: user,
      })
      .catch((e) => {
        kDBLogger.error("add user to db failed", user, e);
        return undefined;
      });
  }
}

export const UserCRUD = new _UserCRUD();
