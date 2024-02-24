import { randomUUID } from "crypto";
import { openai } from "../src/services/openai";

export async function testOpenAI() {
  await testStreamChat();
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
      openai.abort(requestId);
    },
  });
  console.log("xxx", res);
}
