import { AISpeaker, AISpeakerConfig } from "./services/speaker/ai";
import { MyBot, MyBotConfig } from "./services/bot";
import { initDB, runWithDB } from "./services/db";
import { kBannerASCII } from "./utils/string";

export type MiGPTConfig = Omit<MyBotConfig, "speaker"> & {
  speaker: AISpeakerConfig;
};

export class MiGPT {
  static instance: MiGPT | null;
  static reset() {
    MiGPT.instance = null;
  }
  static create(config: MiGPTConfig) {
    if (MiGPT.instance) {
      console.log("🚨 注意：MiGPT 是单例，暂不支持多设备、多账号！");
      console.log("如果需要切换设备或账号，请先使用 MiGPT.reset() 重置实例。");
    } else {
      MiGPT.instance = new MiGPT({ ...config, fromCreate: true });
    }
    return MiGPT.instance;
  }

  ai: MyBot;
  speaker: AISpeaker;
  constructor(config: MiGPTConfig & { fromCreate?: boolean }) {
    console.assert(config.fromCreate, "请使用 MiGPT.create() 获取客户端实例！");
    const { speaker, ...myBotConfig } = config;
    this.speaker = new AISpeaker(speaker);
    this.ai = new MyBot({
      ...myBotConfig,
      speaker: this.speaker,
    });
  }

  async start() {
    await initDB(".mi-gpt.db");
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
