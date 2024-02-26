import { Logger } from "../src/utils/log";

export function testLog() {
  Logger.log("你好", ["世界"], { hello: "world!" });
  Logger.success("你好", ["世界"], { hello: "world!" });
  Logger.error("你好", ["世界"], { hello: "world!" });
  Logger.assert(true, "你好 111", ["世界"], { hello: "world!" });
  Logger.assert(false, "你好 222", ["世界"], { hello: "world!" });
}
