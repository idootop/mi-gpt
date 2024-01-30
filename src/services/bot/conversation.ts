import { Message, Prisma, Room, User } from "@prisma/client";
import { UserCRUD } from "../db/user";
import { RoomCRUD, getRoomID } from "../db/room";
import { MemoryManager } from "./memory";
import { MessageCRUD } from "../db/message";
import { BotConfig, IBotConfig } from "./config";
import { jsonEncode } from "../../utils/base";

export class ConversationManager {
  private config: IBotConfig;
  constructor(config: IBotConfig) {
    this.config = config;
  }

  async getMemory() {
    await this.loadOrUpdateConfig();
    if (!this.isReady) {
      return undefined;
    }
    return this.memory;
  }

  async getRoom() {
    const { room } = await this.loadOrUpdateConfig();
    if (!this.isReady) {
      return undefined;
    }
    return room as Room;
  }

  async getUser(key: "bot" | "master") {
    const config = await this.loadOrUpdateConfig();
    if (!this.isReady) {
      return undefined;
    }
    return config[key] as User;
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
    const room = await this.getRoom();
    if (!this.isReady) {
      return [];
    }
    return MessageCRUD.gets({ room, ...options });
  }

  async onMessage(message: Message) {
    const memory = await this.getMemory();
    return memory?.addMessage2Memory(message);
  }

  private memory?: MemoryManager;

  get isReady() {
    return !!this.memory;
  }

  async loadOrUpdateConfig() {
    const { config, diffs } = await BotConfig.update(this.config);
    if (!config.bot?.id || diffs?.includes("bot")) {
      config.bot = await UserCRUD.addOrUpdate(config.bot);
    }
    if (!config.master?.id || diffs?.includes("master")) {
      config.master = await UserCRUD.addOrUpdate(config.master);
    }
    if (!config.room?.id || diffs?.includes("room")) {
      const defaultRoomName = `${config.master.name}和${config.bot.name}的私聊`;
      config.room = await RoomCRUD.addOrUpdate({
        id: getRoomID([config.bot.id, config.master.id]),
        name: config.room?.name ?? defaultRoomName,
        description: config.room?.description ?? defaultRoomName,
      });
    }
    const { config: newConfig } = await BotConfig.update(config);
    if (!this.memory && config.bot && config.master && config.room) {
      this.memory = new MemoryManager(config.room);
    }
    return newConfig as IBotConfig;
  }
}
