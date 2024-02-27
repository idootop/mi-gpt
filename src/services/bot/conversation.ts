import { Memory, Prisma, User } from "@prisma/client";
import { DeepPartial, MakeOptional } from "../../utils/type";
import { MessageCRUD } from "../db/message";
import { QueryMessage } from "../speaker/speaker";
import { BotConfig, IBotConfig } from "./config";
import { MemoryManager } from "./memory";

export interface MessageContext extends IBotConfig {
  memory?: Memory;
}
export interface MessageWithSender
  extends MakeOptional<QueryMessage, "timestamp"> {
  sender: User;
}

export class ConversationManager {
  private config: DeepPartial<IBotConfig>;
  constructor(config: DeepPartial<IBotConfig>) {
    this.config = config;
  }

  async init() {
    return this.get();
  }

  async get(): Promise<Partial<IBotConfig & { memory: MemoryManager }>> {
    const config = await this.update();
    if (!config) {
      return {};
    }
    return {
      ...config,
      // 记忆存储在公共 room 上
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

  async onMessage(ctx: MessageContext, msg: MessageWithSender) {
    const { sender, text, timestamp = Date.now() } = msg;
    const { room, memory } = await this.get();
    if (memory) {
      const message = await MessageCRUD.addOrUpdate({
        text,
        roomId: room!.id,
        senderId: sender.id,
        createdAt: new Date(timestamp),
      });
      if (message) {
        // 异步加入记忆（到 room）
        memory?.addMessage2Memory(ctx, message);
        return message;
      }
    }
  }
}
