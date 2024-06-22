import { Room, User } from "@prisma/client";
import { deepClone, removeEmpty } from "../../utils/base";
import { readJSON, writeJSON } from "../../utils/io";
import { DeepPartial } from "../../utils/type";
import { RoomCRUD, getRoomID } from "../db/room";
import { UserCRUD } from "../db/user";
import { Logger } from "../../utils/log";

const kDefaultMaster = {
  name: "陆小千",
  profile: `
性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。
`.trim(),
};

const kDefaultBot = {
  name: "傻妞",
  profile: `
性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。
  `.trim(),
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
  private _logger = Logger.create({ tag: "BotConfig" });
  private botIndex?: IBotIndex;

  private _indexPath = ".bot.json";

  private async _getIndex(): Promise<IBotIndex | undefined> {
    if (!this.botIndex) {
      this.botIndex = await readJSON(this._indexPath);
    }
    return this.botIndex;
  }

  async get(): Promise<IBotConfig | undefined> {
    const index = await this._getIndex();
    if (!index) {
      // create db records
      const bot = await UserCRUD.addOrUpdate(kDefaultBot);
      if (!bot) {
        this._logger.error("create bot failed");
        return undefined;
      }
      const master = await UserCRUD.addOrUpdate(kDefaultMaster);
      if (!master) {
        this._logger.error("create master failed");
        return undefined;
      }
      const defaultRoomName = `${master.name}和${bot.name}的私聊`;
      const room = await RoomCRUD.addOrUpdate({
        id: getRoomID([bot, master]),
        name: defaultRoomName,
        description: defaultRoomName,
      });
      if (!room) {
        this._logger.error("create room failed");
        return undefined;
      }
      this.botIndex = {
        botId: bot.id,
        masterId: master.id,
      };
      await writeJSON(this._indexPath, this.botIndex);
    }
    const bot = await UserCRUD.get(this.botIndex!.botId);
    if (!bot) {
      this._logger.error("find bot failed. 请删除 .bot.json 文件后重试！");
      return undefined;
    }
    const master = await UserCRUD.get(this.botIndex!.masterId);
    if (!master) {
      this._logger.error("find master failed");
      return undefined;
    }
    const room = await RoomCRUD.get(getRoomID([bot, master]));
    if (!room) {
      this._logger.error("find room failed");
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
