import { assert } from "console";
import { ConversationManager } from "../../src/services/bot/conversation";
import { println } from "../../src/utils/base";

export async function testDB() {
  const manager = new ConversationManager({
    bot: {
      name: "小爱同学",
      profile: "我是小爱同学，机器人",
    },
    master: {
      name: "王黎",
      profile: "我是王黎，人类",
    },
    room: {
      name: "客厅",
      description: "王黎的客厅，小爱同学放在角落里",
    },
  });
  const { room } = await manager.loadOrUpdateConfig();
  assert(room, "❌ load config failed");
  println("✅ hello world！");
}
