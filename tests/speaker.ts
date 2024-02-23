import { AISpeaker } from "../src/services/speaker/ai";
import { sleep } from "../src/utils/base";

export async function main() {
  const config: any = {
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
    tts: "doubao",
  };

  const speaker = new AISpeaker(config);
  await speaker.initMiServices();
  // await testSpeakerResponse(speaker);
  // await testSpeakerGetMessages(speaker);
  // await testSwitchSpeaker(speaker);
  // await testSpeakerUnWakeUp(speaker);
  await testAISpeaker(speaker);
}

async function testAISpeaker(speaker: AISpeaker) {
  speaker.askAI = async (msg) => {
    return "你说：" + msg.text;
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
  await speaker.response({ text: "你好，我是豆包，很高兴认识你！" });
  const success = await speaker.switchDefaultSpeaker("魅力苏菲");
  console.log("switchDefaultSpeaker 魅力苏菲", success);
  await speaker.response({ text: "你好，我是豆包，很高兴认识你！" });
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
  speaker.response({ text: "你好，我是豆包，很高兴认识你！" });
  sleep(1000);
  status = await speaker.MiNA!.getStatus();
  console.log("tts status", status);
}
