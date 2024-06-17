import { MyBot } from "../src/services/bot";
import { AISpeaker } from "../src/services/speaker/ai";

export async function testMyBot() {
  // await testStreamResponse();
  await testRunBot();
}

async function testRunBot() {
  const name = "傻妞";
  const speaker = new AISpeaker({
    name,
    tts: "custom",
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
  });
  const bot = new MyBot({
    speaker,
    bot: {
      name,
      profile: `性别女，性格乖巧可爱，喜欢搞怪，爱吃醋。`,
    },
    master: {
      name: "陆小千",
      profile: `性别男，善良正直，总是舍己为人，是傻妞的主人。`,
    },
  });
  const res = await bot.run();
  console.log("✅ done");
}

async function testStreamResponse() {
  const stream = await MyBot.chatWithStreamResponse({
    user: "地球为什么是圆的？",
    onFinished: (text) => {
      console.log("\nFinal result 111:\n", text);
    },
  });
  const config: any = {
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
    tts: "custom",
  };
  const speaker = new AISpeaker(config);
  await speaker.initMiServices();
  await speaker.response({ stream });
  const res = await stream.getFinalResult();
  console.log("\nFinal result 222:\n", res);
}
