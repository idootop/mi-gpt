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

  async onMessage(
    payload: IBotConfig & {
      sender: User;
      text: string;
      timestamp?: number;
    }
  ) {
    const { sender, text, timestamp = Date.now(), ...botConfig } = payload;
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
        memory?.addMessage2Memory(message,botConfig);
        return message;
      }
    }
  }
}
