import { toSet } from "./base";
import { isString } from "./is";
import { formatDateTime } from "./string";

class _LoggerManager {
  disable = false;
  _excludes: string[] = [];

  excludes(tags: string[]) {
    this._excludes = toSet(this._excludes.concat(tags));
  }

  includes(tags: string[]) {
    for (const tag of tags) {
      const idx = this._excludes.indexOf(tag);
      if (idx > -1) {
        this._excludes.splice(idx, 1);
      }
    }
  }

  private _getLogs(tag: string, ...args: any[]) {
    if (this.disable || this._excludes.includes(tag)) {
      return [];
    }
    const date = formatDateTime(new Date());
    let prefix = `${date} ${tag} `;
    if (args.length < 1) {
      args = [undefined];
    }
    if (isString(args[0])) {
      prefix += args[0];
      args = args.slice(1);
    }
    return [prefix, ...args];
  }

  log(tag: string, args: any[] = []) {
    const logs = this._getLogs(tag, ...args);
    if (logs.length > 0) {
      console.log(...logs);
    }
  }

  success(tag: string, args: any[]) {
    const logs = this._getLogs(tag + " ✅", ...args);
    if (logs.length > 0) {
      console.log(...logs);
    }
  }

  error(tag: string, args: any[]) {
    const logs = this._getLogs(tag + " ❌", ...args);
    if (logs.length > 0) {
      console.error(...logs);
    }
  }

  assert(tag: string, value: any, args: any[]) {
    const logs = this._getLogs(tag + " ❌", ...args);
    if (!value) {
      console.error(...logs);
      throw Error("❌ Assertion failed");
    }
  }
}

export const LoggerManager = new _LoggerManager();

export interface LoggerConfig {
  tag?: string;
  disable?: boolean;
}
class _Logger {
  tag: string;
  disable: boolean;
  constructor(config?: LoggerConfig) {
    const { tag = "default", disable = false } = config ?? {};
    this.tag = tag;
    this.disable = disable;
  }

  create(config?: LoggerConfig) {
    return new _Logger(config);
  }

  log(...args: any[]) {
    if (!this.disable) {
      LoggerManager.log(this.tag, args);
    }
  }

  success(...args: any[]) {
    if (!this.disable) {
      LoggerManager.success(this.tag, args);
    }
  }

  error(...args: any[]) {
    if (!this.disable) {
      LoggerManager.error(this.tag, args);
    }
  }

  assert(value: any, ...args: any[]) {
    LoggerManager.assert(this.tag, value, args);
  }
}

export const Logger = new _Logger();
