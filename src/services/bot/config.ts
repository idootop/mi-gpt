import { Room, User } from "@prisma/client";
import { readJSON, writeJSON } from "../../utils/io";
import { deepClone, removeEmpty } from "../../utils/base";
import { UserCRUD } from "../db/user";
import { RoomCRUD, getRoomID } from "../db/room";
import { DeepPartial } from "../../utils/type";

const kDefaultMaster = {
  name: "用户",
  profile: "",
};

const kDefaultBot = {
  name: "小爱同学",
  profile: "",
};

interface IBotIndex {
  botId: string;
  masterId: string;
}

export interface IBotConfig {
  bot: User;
  master: User;
  room: Room;
}

class _BotConfig {
  private botIndex?: IBotIndex;

  private _index_path = ".bot.json";

  private async _getIndex(): Promise<IBotIndex | undefined> {
    if (!this.botIndex) {
      this.botIndex = await readJSON(this._index_path);
    }
    return this.botIndex;
  }

  async get(): Promise<IBotConfig | undefined> {
    const index = await this._getIndex();
    if (!index) {
      // create db records
      const bot = await UserCRUD.addOrUpdate(kDefaultBot);
      if (!bot) {
        console.error("❌ create bot failed");
        return undefined;
      }
      const master = await UserCRUD.addOrUpdate(kDefaultMaster);
      if (!master) {
        console.error("❌ create master failed");
        return undefined;
      }
      const defaultRoomName = `${master.name}和${bot.name}的私聊`;
      const room = await RoomCRUD.addOrUpdate({
        id: getRoomID([bot, master]),
        name: defaultRoomName,
        description: defaultRoomName,
      });
      if (!room) {
        console.error("❌ create room failed");
        return undefined;
      }
      this.botIndex = {
        botId: bot.id,
        masterId: master.id,
      };
      await writeJSON(this._index_path, this.botIndex);
    }
    const bot = await UserCRUD.get(this.botIndex!.botId);
    if (!bot) {
      console.error("❌ find bot failed");
      return undefined;
    }
    const master = await UserCRUD.get(this.botIndex!.masterId);
    if (!master) {
      console.error("❌ find master failed");
      return undefined;
    }
    const room = await RoomCRUD.get(getRoomID([bot, master]));
    if (!room) {
      console.error("❌ find room failed");
      return undefined;
    }
    return { bot, master, room };
  }

  async update(
    config: DeepPartial<IBotConfig>
  ): Promise<IBotConfig | undefined> {
    let currentConfig = await this.get();
    if (!currentConfig) {
      return undefined;
    }
    const oldConfig = deepClone(currentConfig);
    for (const key in currentConfig) {
      const _key = key as keyof IBotConfig;
      currentConfig[_key] = {
        ...currentConfig[_key],
        ...removeEmpty(config[_key]),
        updatedAt: undefined, // reset update date
      } as any;
    }
    let { bot, master, room } = currentConfig;
    const newDefaultRoomName = `${master.name}和${bot.name}的私聊`;
    if (room.name.endsWith("的私聊")) {
      room.name = config.room?.name ?? newDefaultRoomName;
    }
    if (room.description.endsWith("的私聊")) {
      room.description = config.room?.description ?? newDefaultRoomName;
    }
    bot = (await UserCRUD.addOrUpdate(bot)) ?? oldConfig.bot;
    master = (await UserCRUD.addOrUpdate(master)) ?? oldConfig.master;
    room = (await RoomCRUD.addOrUpdate(room)) ?? oldConfig.room;
    return { bot, master, room };
  }
}

export const BotConfig = new _BotConfig();
