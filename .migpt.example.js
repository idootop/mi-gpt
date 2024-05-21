const botName = "傻妞";
const botProfile = `
性别：女
性格：乖巧可爱
爱好：喜欢搞怪，爱吃醋。
`;

const masterName = "陆小千";
const masterProfile = `
性别：男
性格：善良正直
其他：总是舍己为人，是傻妞的主人。
`;

export default {
  speaker: {
    userId: process.env.MI_USER,
    password: process.env.MI_PASS,
    did: process.env.MI_DID,
    /**
     * 小米音箱 TTS 指令
     *
     * 比如：小爱音箱 Pro（lx06） -> [5, 1]
     *
     * 不同设备的具体指令可在此网站查询：https://home.miot-spec.com
     */
    ttsCommand: [5, 1],
    wakeUpCommand: [5, 3],
  },
  bot: {
    name: botName,
    profile: botProfile,
  },
  master: {
    name: masterName,
    profile: masterProfile,
  },
};
