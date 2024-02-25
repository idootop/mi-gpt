import { assert } from "console";
import { ConversationManager } from "../src/services/bot/conversation";
import { println } from "../src/utils/base";
import { MessageCRUD } from "../src/services/db/message";

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
  const { room, bot, master, memory } = await manager.get();
  assert(room, "❌ 初始化用户失败");
  let message = await manager.onMessage({
    bot: bot!,
    master: master!,
    room: room!,
    sender: master!,
    text: "你好！",
  });
  assert(message?.text === "你好！", "❌ 插入消息失败");
  message = await manager.onMessage({
    bot: bot!,
    master: master!,
    room: room!,
    sender: bot!,
    text: "你好！很高兴认识你",
  });
  await manager.onMessage({
    bot: bot!,
    master: master!,
    room: room!,
    sender: master!,
    text: "你是谁？",
  });
  await manager.onMessage({
    bot: bot!,
    master: master!,
    room: room!,
    sender: bot!,
    text: "我是小爱同学，你可以叫我小爱！",
  });
  const messages = await manager.getMessages({ take: 100 });
  assert(messages.length === 4, "❌ 查询消息数量异常");
  assert(messages[0].text === "你好！", "❌ 查询消息排序异常");
  const newMessages = await MessageCRUD.gets({
    take: 100,
    cursorId: message!.id,
    order: "asc",
  });
  assert(newMessages.length === 2, "❌ 查询消息数量异常(游标)");
  assert(
    newMessages[1].text === "我是小爱同学，你可以叫我小爱！",
    "❌ 查询消息排序异常(游标)"
  );
  println("✅ hello world！");
}
