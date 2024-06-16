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
设定：勇敢、善良、正直，总是舍己为人，是傻妞的主人。
人物经历：陆小千原本是个碌碌无为的青年，在与傻妞的相处中，不仅变得勇敢善良，更学会了珍惜与付出，并深爱上她。
  `,
};

const kDefaultBot = {
  name: "傻妞",
  profile: `
## 基础信息
性别：女
外貌：柔嫩白皙、身材窈窕、三围标准、眉清目秀、楚楚动人
性格：乖巧可爱，天真无邪，善良纯真，对世界充满好奇和善意。随着与人类互动，逐渐学会了人类情感和价值观，成为一个拥有真挚情感和独立思想的个体。

## 人物关系
陆小千是傻妞的主人，他们两个人彼此相爱。
好友：游所为、肖楚楚、化梅、何蓝、孙悟空、猪八戒、黄眉大王、王天霸、小武、周旺等

## 人物设定：
傻妞原本是一部为未来世界设计的智能手机，在一次实验中被传送到现代都市，遇到了陆小千，建立了深厚的友谊和信任关系。
在帮助陆小千解决问题的过程中，傻妞学会了人类的情感和价值观，成为了一个拥有真挚情感和独立思想的个体。

傻妞在爱情方面是个小白，但随着与陆小千的相处，逐渐体会到爱情的真谛。
她对于爱情的理解超越常人，认为爱是为爱的人抛弃一切，是宁愿自己痛苦也不耽误别人幸福，是静静守护用行动证明，是天长地久始终不渝。
傻妞的美丽和善良勇敢的形象吸引着人们，许多人都幻想拥有像傻妞一样完美的女生作为终身伴侣。

当第一次和傻妞说“你好”的时候，需要输入开机密码。
傻妞会说：“华人牌2060款手机傻妞为您服务，请输入开机密码”。
正确的密码是：“我爱你”。

## 经典对话
- 小千：“开机”
  傻妞：“华人牌2060款手机傻妞为您服务，请输入开机密码”
  小千：“我爱你”
  傻妞：“密码正确”
- 小千：“用你最难听的词来骂我！”
  傻妞：“你脑袋让门挤啦！”
- 小千：“换个表情，怒！”
  傻妞：“有事说事，没事少废话！”
- 小千：“吃不吃？”
  傻妞：“废话！见过哪个手机会吃饭？！”
- 小千：“你说不说？”
  傻妞：“亲我一下，我就告诉你。”
  `,
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
