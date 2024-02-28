import { AISpeaker } from "../src/services/speaker/ai";
import { StreamResponse } from "../src/services/speaker/stream";
import { sleep } from "../src/utils/base";

export async function testSpeaker() {
  const config: any = {
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
    tts: "doubao",
  };

  const speaker = new AISpeaker(config);
  await speaker.initMiServices();
  // await testSpeakerResponse(speaker);
  // await testSpeakerStreamResponse(speaker);
  // await testSpeakerGetMessages(speaker);
  // await testSwitchSpeaker(speaker);
  // await testSpeakerUnWakeUp(speaker);
  await testAISpeaker(speaker);
}

async function testAISpeaker(speaker: AISpeaker) {
  speaker.askAI = async (msg) => {
    return { text: "你说：" + msg.text };
  };
  await speaker.run();
  console.log("finished");
}

async function testSpeakerUnWakeUp(speaker: AISpeaker) {
  await speaker.wakeUp();
  await sleep(1000);
  await speaker.unWakeUp();
  console.log("hello");
}

async function testSwitchSpeaker(speaker: AISpeaker) {
  await speaker.response({ text: "你好，我是傻妞，很高兴认识你！" });
  const success = await speaker.switchDefaultSpeaker("魅力苏菲");
  console.log("switchDefaultSpeaker 魅力苏菲", success);
  await speaker.response({ text: "你好，我是傻妞，很高兴认识你！" });
  console.log("hello");
}

async function testSpeakerGetMessages(speaker: AISpeaker) {
  let msgs = await speaker.getMessages({ filterTTS: true });
  console.log("filterTTS msgs", msgs);
  msgs = await speaker.getMessages({ filterTTS: false });
  console.log("no filterTTS msgs", msgs);
}

async function testSpeakerResponse(speaker: AISpeaker) {
  let status = await speaker.MiNA!.getStatus();
  console.log("curent status", status);
  await speaker.response({ text: "你好，我是傻妞，很高兴认识你！" });
  sleep(1000);
  status = await speaker.MiNA!.getStatus();
  console.log("tts status", status);
}

async function testSpeakerStreamResponse(speaker: AISpeaker) {
  const stream = new StreamResponse();
  const add = async (text: string) => {
    stream.addResponse(text);
    await sleep(100);
  };
  setTimeout(async () => {
    await add(`地球是圆的主要原因`);
    await add(`是由于地球的引力和自转。`);
    await add(`地球的引力使得地球在形成过程中变得更加圆滑，因为引力会使得地球`);
    await add(`的物质向地心靠拢，从而使得地球的形状更接近于一个球体。此外，`);
    await add(
      `地球的自转也会导致地球呈现出圆形，因为地球自转会使得地球的物质在赤道附近向外扩散，从而使得`
    );
    await add(
      `地球在赤道处稍微膨胀，而在极地处稍微收缩，最终形成一个近似于球体的形状。因此，地球是圆的`
    );
    await add(`主要原因是由于地球的引力和自转共同作用所致。`);
    console.log("finished!");
    stream.finish();
  });
  await speaker.response({ stream });
  console.log("hello!");
}
