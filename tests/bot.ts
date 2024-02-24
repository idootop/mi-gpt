import { MyBot } from "../src/services/bot";
import { AISpeaker } from "../src/services/speaker/ai";

export async function testMyBot() {
  await testStreamResponse();
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
    tts: "doubao",
  };
  const speaker = new AISpeaker(config);
  await speaker.initMiServices();
  await speaker.response({ stream });
  const res = await stream.getFinalResult();
  console.log("\nFinal result 222:\n", res);
}
