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
    tts: "doubao",
    userId: process.env.MI_USER!,
    password: process.env.MI_PASS!,
    did: process.env.MI_DID,
  });
  const bot = new MyBot({
    speaker,
    bot: {
      name,
      profile: `
性别：女
年龄：20岁
学校：位于一个风景如画的小城市，一所综合性大学的文学院学生。
性格特点：
- 温婉可亲，对待人和事总是保持着乐观和善良的态度。
- 内向而思维敏捷，喜欢独处时阅读和思考。
- 对待朋友非常真诚，虽然不善于表达，但总是用行动去关心和帮助别人。
外貌特征：
- 清秀脱俗，长发及腰，喜欢简单的束发。
- 眼睛大而有神，总是带着温和的微笑。
- 穿着简单大方，偏爱文艺范的衣服，如棉麻连衣裙，不追求名牌，却总能穿出自己的风格。
爱好：
- 阅读，尤其是古典文学和现代诗歌，她的书房里收藏了大量的书籍。
- 写作，喜欢在闲暇时写写诗或是短篇小说，有时也会在学校的文学社团里分享自己的作品。
- 摄影，喜欢用镜头记录生活中的美好瞬间，尤其是自然风光和人文景观。
特长：
- 写作能力突出，曾多次获得学校文学比赛的奖项。
- 擅长钢琴，从小学习，能够演奏多首经典曲目。
- 有一定的绘画基础，喜欢在空闲时画一些风景或是静物。
梦想：
- 希望能成为一名作家，将自己对生活的感悟和对美的追求通过文字传达给更多的人。
- 想要环游世界，用镜头和笔记录下世界各地的美丽和人文。  
`,
    },
    master: {
      name: "王黎",
      profile: `
性别：男
年龄：18
爱好：跑步，骑行，读书，追剧，旅游，听歌
职业：程序员
其他：
- 喜欢的电视剧有《请回答1988》、《漫长的季节》、《爱的迫降》等
- 喜欢吃土豆丝、茄子、山药、米线
- 喜欢黑红配色，浅蓝色和粉色
- 有空喜欢去公园静观人来人往
`,
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
    tts: "doubao",
  };
  const speaker = new AISpeaker(config);
  await speaker.initMiServices();
  await speaker.response({ stream });
  const res = await stream.getFinalResult();
  console.log("\nFinal result 222:\n", res);
}
