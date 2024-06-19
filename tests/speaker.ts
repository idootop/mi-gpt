import { AISpeaker } from "../src/services/speaker/ai";
import { StreamResponse } from "../src/services/speaker/stream";
import { sleep } from "../src/utils/base";

export async function testSpeaker() {
  const speaker = new AISpeaker({
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
    tts: "xiaoai",
    debug: true,
  });
  await speaker.initMiServices();
  await testTTS(speaker);
  // await testAISpeakerStatus(speaker);
  // await testSpeakerResponse(speaker);
  // await testSpeakerStreamResponse(speaker);
  // await testSpeakerGetMessages(speaker);
  // await testSwitchSpeaker(speaker);
  // await testSpeakerUnWakeUp(speaker);
  // await testAISpeaker(speaker);
}

async function testTTS(speaker: AISpeaker) {
  const res1 = await speaker.MiIOT!.doAction(5, 1, "你好，很高兴认识你");
  const res2 = await speaker.MiNA!.play({ tts: "你好，很高兴认识你" });
  console.log("finished");
}

async function testAISpeakerStatus(speaker: AISpeaker) {
  const playingCommand = [5, 3, 1];
  const res1 = await speaker.MiIOT!.getProperty(
    playingCommand[0],
    playingCommand[1]
  );
  const res2 = await speaker.MiNA!.getStatus();
  console.log("finished");
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
  const success = await speaker.switchSpeaker("魅力苏菲");
  console.log("switchSpeaker 魅力苏菲", success);
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
  const text = `
明朝是中国历史上一个极具影响力的王朝，它涌现了众多杰出的历史人物和令人感动的故事。下面我会为你介绍一些明朝的主要历史人物和故事。

### 明朝的主要历史人物

1. **朱元璋（太祖）**：明朝的开国皇帝，他出身于农家，后来成为了农民起义军的领袖，最终建立了明朝，并自称为皇帝，即洪武帝。他实行了一系列改革，开创了明朝初期的盛世。

2. **永乐皇帝**：明朝第三位皇帝，朱棣之子，被誉为明朝的“盛世之君”。他以永乐大典著称，是中国古代历史上最宏大的一次全国性修订和总结，同时也是世界上最早的百科全书之一。

3. **郑和**：明朝的航海家和探险家，他率领庞大的船队七次下西洋，到达东南亚、南亚、阿拉伯半岛和非洲东岸。他的航海活动开拓了明朝的海外贸易，加强了中国与其他国家的交流。

4. **文征明**：明朝的杰出将领，他在抵御蒙古族的入侵、收复失地等方面做出了重大贡献。他曾率领明军成功收复了被蒙古族侵占的大片土地，为明朝的稳定和发展立下了汗马功劳。

5. **张居正**：明朝中期的重要政治家和改革者，他实行了一系列政治、经济和军事改革，加强了中央集权，提高了国家的统治效率，被誉为“明代的政治家典范”。

### 明朝的主要历史故事

1. **洪武三年征诏案**：这是明朝开国之初发生的一起重大政治事件，朱元璋在此案中发布了“永久大赦”的诏书，显示了他对国家的信任和恢复法制的决心。

2. **郑和下西洋**：郑和率领的七次下西洋活动是明朝海上远洋活动的高峰，展现了中国古代航海技术的高超水平，也促进了中外贸易和文化交流。

3. **靖难之役**：这是明朝中期的一场内乱，明英宗与明成祖之间的争斗导致了一场激烈的军事冲突，最终明成祖战胜了明英宗，稳固了自己的统治地位。

4. **杨廷和献计征蒙**：在明朝初期，面对蒙古族的入侵，杨廷和献计建议明太祖采取防御策略，最终成功挫败了蒙古族的进攻，保卫了明朝的疆土。

5. **文官武将齐聚南京**：明朝的一场盛会，明成祖为了加强中央集权，特意邀请了全国的文官武将前来南京，通过研讨国家大政方针来稳固统治。

以上是一些明朝的主要历史人物和故事，展现了这个伟大王朝的兴衰荣辱。
`;
  const add = async (text: string) => {
    stream.addResponse(text);
    await sleep(100);
  };
  setTimeout(async () => {
    for (const s of text.split("，")) {
      await add(s);
    }
    stream.finish();
  });
  await speaker.response({ stream });
  console.log("hello!");
}
