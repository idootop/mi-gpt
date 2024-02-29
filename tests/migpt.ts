import { MiGPT } from "../src";

const botProfile = `
性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。
`;

const masterProfile = `
性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。
`;

export async function testMiGPT() {
  const client = MiGPT.create({
    speaker: {
      userId: process.env.MI_USER!,
      password: process.env.MI_PASS!,
      did: process.env.MI_DID,
    },
    bot: {
      name: "傻妞",
      profile: botProfile,
    },
    master: {
      name: "陆小千",
      profile: masterProfile,
    },
  });
  await client.start();
}
