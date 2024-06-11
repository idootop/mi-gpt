import { randomUUID } from "crypto";
import { openai } from "../src/services/openai";

export async function testOpenAI() {
  await testChat();
  // await testStreamChat();
}

async function testChat() {
  const res = await openai.chat({ user: "地球为什么是圆的？" });
  console.log("\nFinal result:\n", res?.content);
}

async function testStreamChat() {
  const requestId = randomUUID();
  const res = await openai.chatStream({
    requestId,
    user: "地球为什么是圆的？",
    onStream: (text) => {
      console.log(text);
    },
  });
  console.log("\nFinal result:\n", res);
}

async function testAbortStreamChat() {
  const requestId = randomUUID();
  const res = await openai.chatStream({
    requestId,
    user: "hello!",
    onStream: (text) => {
      console.log(text);
      openai.cancel(requestId);
    },
  });
  console.log("xxx", res);
}
