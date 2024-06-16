import { AISpeaker, AISpeakerConfig } from "./services/speaker/ai";
import { MyBot, MyBotConfig } from "./services/bot";
import { getDBInfo, initDB, runWithDB } from "./services/db";
import { kBannerASCII } from "./utils/string";
import { Logger } from "./utils/log";
import { deleteFile } from "./utils/io";

export type MiGPTConfig = Omit<MyBotConfig, "speaker"> & {
  speaker: Omit<AISpeakerConfig, "name">;
};

export class MiGPT {
  static instance: MiGPT | null;
  static async reset() {
    MiGPT.instance = null;
    const { dbPath } = getDBInfo();
    await deleteFile(dbPath);
    await deleteFile(".mi.json");
    await deleteFile(".bot.json");
    MiGPT.logger.log("MiGPT 已重置，请使用 MiGPT.create() 重新创建实例。");
  }
  static logger = Logger.create({ tag: "MiGPT" });
  static create(config: MiGPTConfig) {
    const hasAccount = config?.speaker?.userId && config?.speaker?.password;
    MiGPT.logger.assert(hasAccount, "Missing userId or password.");
    if (MiGPT.instance) {
      MiGPT.logger.log("🚨 注意：MiGPT 是单例，暂不支持多设备、多账号！");
      MiGPT.logger.log(
        "如果需要切换设备或账号，请先使用 MiGPT.reset() 重置实例。"
      );
    } else {
      MiGPT.instance = new MiGPT({ ...config, fromCreate: true });
    }
    return MiGPT.instance;
  }

  ai: MyBot;
  speaker: AISpeaker;
  constructor(config: MiGPTConfig & { fromCreate?: boolean }) {
    MiGPT.logger.assert(
      config.fromCreate,
      "请使用 MiGPT.create() 获取客户端实例！"
    );
    const { speaker, ...myBotConfig } = config;
    this.speaker = new AISpeaker(speaker);
    this.ai = new MyBot({
      ...myBotConfig,
      speaker: this.speaker,
    });
  }

  async start() {
    await initDB(this.speaker.debug);
    const main = () => {
      console.log(kBannerASCII);
      return this.ai.run();
    };
    return runWithDB(main);
  }

  async stop() {
    return this.ai.stop();
  }
}
