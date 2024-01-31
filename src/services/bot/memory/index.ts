import { Memory, Message, Room, User } from "@prisma/client";
import { firstOf, lastOf } from "../../../utils/base";
import { LongTermMemoryAgent } from "./long-term";
import { MemoryCRUD } from "../../db/memory";
import { ShortTermMemoryCRUD } from "../../db/memory-short-term";
import { LongTermMemoryCRUD } from "../../db/memory-long-term";
import { ShortTermMemoryAgent } from "./short-term";

export class MemoryManager {
  private room: Room;

  /**
   * owner 为空时，即房间自己的公共记忆
   */
  private owner?: User;

  constructor(room: Room, owner?: User) {
    this.room = room;
    this.owner = owner;
  }

  async getMemories(take?: number) {
    return MemoryCRUD.gets({
      room: this.room,
      owner: this.owner,
      take,
    });
  }

  async getShortTermMemories(take?: number) {
    return ShortTermMemoryCRUD.gets({
      room: this.room,
      owner: this.owner,
      take,
    });
  }

  async getLongTermMemories(take?: number) {
    return LongTermMemoryCRUD.gets({
      room: this.room,
      owner: this.owner,
      take,
    });
  }

  async getRelatedMemories(limit: number): Promise<Memory[]> {
    // todo search memory embeddings
    return [];
  }

  async addMessage2Memory(message: Message) {
    // todo create memory embedding
    const res = await MemoryCRUD.addOrUpdate({
      text: message.text,
      roomId: this.room.id,
      ownerId: message.senderId,
    });
    // 异步更新长短期记忆
    this.updateLongShortTermMemory();
    return res;
  }

  /**
   * 更新记忆（当新的记忆数量超过阈值时，自动更新长短期记忆）
   */
  async updateLongShortTermMemory(options?: {
    shortThreshold?: number;
    longThreshold?: number;
  }) {
    const { shortThreshold, longThreshold } = options ?? {};
    const success = await this._updateShortTermMemory(shortThreshold);
    if (success) {
      await this._updateLongTermMemory(longThreshold);
    }
  }

  private async _updateShortTermMemory(threshold = 10) {
    const lastMemory = firstOf(await this.getShortTermMemories(1));
    const newMemories = await MemoryCRUD.gets({
      cursorId: lastMemory?.cursorId,
      room: this.room,
      owner: this.owner,
      order: "asc", // 从旧到新排序
    });
    if (newMemories.length < 1 || newMemories.length < threshold) {
      return true;
    }
    const newMemory = await ShortTermMemoryAgent.generate(
      newMemories,
      lastMemory
    );
    if (!newMemory) {
      return false;
    }
    const res = await ShortTermMemoryCRUD.addOrUpdate({
      text: newMemory,
      roomId: this.room.id,
      ownerId: this.owner?.id,
      cursorId: lastOf(newMemories)!.id,
    });
    return res != null;
  }

  private async _updateLongTermMemory(threshold = 10) {
    const lastMemory = firstOf(await this.getLongTermMemories(1));
    const newMemories = await ShortTermMemoryCRUD.gets({
      cursorId: lastMemory?.cursorId,
      room: this.room,
      owner: this.owner,
      order: "asc", // 从旧到新排序
    });
    if (newMemories.length < 1 || newMemories.length < threshold) {
      return true;
    }
    const newMemory = await LongTermMemoryAgent.generate(
      newMemories,
      lastMemory
    );
    if (!newMemory) {
      return false;
    }
    const res = await LongTermMemoryCRUD.addOrUpdate({
      text: newMemory,
      roomId: this.room.id,
      ownerId: this.owner?.id,
      cursorId: lastOf(newMemories)!.id,
    });
    return res != null;
  }
}
