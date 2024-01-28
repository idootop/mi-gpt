import { Message, Prisma, Room, User } from "@prisma/client";
import { UserCRUD } from "../db/user";
import { RoomCRUD, getRoomID } from "../db/room";
import { MemoryManager } from "./memory";
import { MessageCRUD } from "../db/message";

export interface IPerson {
  /**
   * 人物昵称
   */
  name: string;
  /**
   * 人物简介
   */
  profile: string;
}

const kDefaultBot: IPerson = {
  name: "用户",
  profile: "",
};
const kDefaultMaster: IPerson = {
  name: "小爱同学",
  profile: "",
};

export type IBotConfig = {
  bot?: IPerson;
  master?: IPerson;
  room?: {
    name: string;
    description: string;
  };
};

export class ConversationManager {
  private config: IBotConfig;
  constructor(config: IBotConfig) {
    this.config = config;
  }

  async getMemory() {
    const isReady = await this.loadConfig();
    if (!isReady) {
      return undefined;
    }
    return this.memory;
  }

  async getRoom() {
    const isReady = await this.loadConfig();
    if (!isReady) {
      return undefined;
    }
    return this.room;
  }

  async getUser(key: "bot" | "master") {
    const isReady = await this.loadConfig();
    if (!isReady) {
      return undefined;
    }
    return this.users[key];
  }

  async getMessages(options?: {
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
    const isReady = await this.loadConfig();
    if (!isReady) {
      return [];
    }
    return MessageCRUD.gets({
      room: this.room,
      ...options,
    });
  }

  async onMessage(message: Message) {
    const memory = await this.getMemory();
    return memory?.addMessage2Memory(message);
  }

  private users: Record<string, User> = {};
  private room?: Room;
  private memory?: MemoryManager;

  get ready() {
    const { bot, master } = this.users;
    return bot && master && this.room && this.memory;
  }

  private async loadConfig() {
    if (this.ready) {
      return true;
    }
    let { bot, master } = this.users;
    if (!bot) {
      await this.addOrUpdateUser("bot", this.config.bot ?? kDefaultBot);
    }
    if (!master) {
      await this.addOrUpdateUser(
        "master",
        this.config.master ?? kDefaultMaster
      );
    }
    if (!this.room && bot && master) {
      const defaultRoomName = `${master.name}和${bot.name}的私聊`;
      this.room = await RoomCRUD.addOrUpdate({
        id: getRoomID([bot, master]),
        name: this.config.room?.name ?? defaultRoomName,
        description: this.config.room?.description ?? defaultRoomName,
      });
    }
    if (bot && master && this.room && !this.memory) {
      this.memory = new MemoryManager(this.room!);
    }
    return this.ready;
  }

  private async addOrUpdateUser(type: "bot" | "master", user: IPerson) {
    const oldUser = this.users[type];
    const res = await UserCRUD.addOrUpdate({
      id: oldUser?.id,
      ...user,
    });
    if (res) {
      this.users[type] = res;
    }
  }
}
