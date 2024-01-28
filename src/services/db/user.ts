import { Prisma, User } from "@prisma/client";
import { kPrisma } from ".";

class _UserCRUD {
  async count() {
    return kPrisma.user.count().catch((e) => {
      console.error("❌ get user count failed", e);
      return -1;
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
      include = { members: true },
      order = "desc",
    } = options ?? {};
    const users = await kPrisma.user
      .findMany({
        take,
        skip,
        cursor: { id: cursorId },
        orderBy: { createdAt: order },
      })
      .catch((e) => {
        console.error("❌ get users failed", options, e);
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
        where: { id: user.id },
        create: user,
        update: user,
      })
      .catch((e) => {
        console.error("❌ add user to db failed", user, e);
        return undefined;
      });
  }
}

export const UserCRUD = new _UserCRUD();
