import { Message, Prisma, User } from "@prisma/client";
import { MemoryManager } from "./memory";
import { MessageCRUD } from "../db/message";
import { BotConfig, IBotConfig } from "./config";
import { DeepPartial } from "../../utils/type";

export class ConversationManager {
  private config: DeepPartial<IBotConfig>;
  constructor(config: DeepPartial<IBotConfig>) {
    this.config = config;
  }

  async get(): Promise<Partial<IBotConfig & { memory: MemoryManager }>> {
    const config = await this.update();
    if (!config) {
      return {};
    }
    return {
      ...config,
      memory: new MemoryManager(config.room),
    };
  }

  async update(config?: DeepPartial<IBotConfig>) {
    return BotConfig.update(config ?? this.config);
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
    const { room } = await this.get();
    if (!room) {
      return [];
    }
    return MessageCRUD.gets({ room, ...options });
  }

  async onMessage(message: Message) {
    const { memory } = await this.get();
    return memory?.addMessage2Memory(message);
  }
}
