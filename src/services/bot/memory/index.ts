import { Memory, Message, Room, User } from "@prisma/client";
import { firstOf, lastOf } from "../../../utils/base";
import { LongTermMemoryAgent } from "./long-term";
import { MemoryCRUD } from "../../db/memory";
import { ShortTermMemoryCRUD } from "../../db/memory-short-term";
import { LongTermMemoryCRUD } from "../../db/memory-long-term";
import { ShortTermMemoryAgent } from "./short-term";
import { openai } from "../../openai";

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

  private _currentMemory?: Memory;
  async addMessage2Memory(message: Message) {
    // todo create memory embedding
    const currentMemory = await MemoryCRUD.addOrUpdate({
      text: message.text,
      roomId: this.room.id,
      ownerId: message.senderId,
    });
    if (currentMemory) {
      this._onMemory(currentMemory);
    }
    return currentMemory;
  }

  private _onMemory(currentMemory: Memory) {
    if (this._currentMemory) {
      // 取消之前的更新记忆任务
      openai.abort(`update-short-memory-${this._currentMemory.id}`);
      openai.abort(`update-long-memory-${this._currentMemory.id}`);
    }
    this._currentMemory = currentMemory;
    // 异步更新长短期记忆
    this.updateLongShortTermMemory({ currentMemory });
  }

  /**
   * 更新记忆（当新的记忆数量超过阈值时，自动更新长短期记忆）
   */
  async updateLongShortTermMemory(options: {
    currentMemory: Memory;
    shortThreshold?: number;
    longThreshold?: number;
  }) {
    const { currentMemory, shortThreshold, longThreshold } = options ?? {};
    const success = await this._updateShortTermMemory({
      currentMemory,
      threshold: shortThreshold,
    });
    if (success) {
      await this._updateLongTermMemory({
        currentMemory,
        threshold: longThreshold,
      });
    }
  }

  private async _updateShortTermMemory(options: {
    currentMemory: Memory;
    threshold?: number;
  }) {
    const { currentMemory, threshold = 10 } = options;
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
    const newMemory = await ShortTermMemoryAgent.generate({
      currentMemory,
      newMemories,
      lastMemory,
    });
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

  private async _updateLongTermMemory(options: {
    currentMemory: Memory;
    threshold?: number;
  }) {
    const { currentMemory, threshold = 10 } = options;
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
    const newMemory = await LongTermMemoryAgent.generate({
      currentMemory,
      newMemories,
      lastMemory,
    });
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
