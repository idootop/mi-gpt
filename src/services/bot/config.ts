import { Room, User } from "@prisma/client";
import { readJSON, writeJSON } from "../../utils/io";
import { DeepPartial } from "../../utils/type";
import { deepClone } from "../../utils/base";
import { diff } from "../../utils/diff";

export type IBotConfig = DeepPartial<{
  bot: User;
  master: User;
  room: Room;
}>;

class _BotConfig {
  config?: IBotConfig;

  private _config_path = ".bot.json";

  async get() {
    if (!this.config) {
      this.config = await readJSON(this._config_path);
    }
    return this.config;
  }

  async update(config: IBotConfig) {
    let currentConfig: any = await this.get();
    const oldConfig = deepClone(currentConfig ?? {});
    if (!currentConfig) {
      currentConfig = {
        master: {
          name: "用户",
          profile: "",
        },
        bot: {
          name: "小爱同学",
          profile: "",
        },
      };
    }
    for (const key of ["bot", "master", "room"]) {
      currentConfig[key] = {
        ...currentConfig[key],
        ...(config as any)[key],
      };
    }
    const diffs = diff(currentConfig, oldConfig);
    const diffKeys = diffs.map((e) => e.path[0]);
    if (diffKeys.length > 0) {
      const success = await writeJSON(this._config_path, currentConfig);
      if (success) {
        return { config: currentConfig, diffs: diffKeys };
      }
    }
    return { config: oldConfig };
  }
}

export const BotConfig = new _BotConfig();
