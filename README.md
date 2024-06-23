![](https://raw.githubusercontent.com/idootop/mi-gpt/main/assets/demo.png)

# MiGPT：智能家居，从未如此贴心 ❤️

[![npm version](https://badge.fury.io/js/mi-gpt.svg)](https://www.npmjs.com/package/mi-gpt) [![Docker Image Version](https://img.shields.io/docker/v/idootop/mi-gpt?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/mi-gpt)

在这个数字化的世界里，家已不仅仅是一个居住的地方，而是我们数字生活的延伸。

`MiGPT` 通过将小爱音箱、米家智能设备，与 ChatGPT 的理解能力完美融合，让你的智能家居更懂你。

`MiGPT` 不仅仅是关于设备自动化，而是关于：**打造一个懂你、有温度、与你共同进化的家**。

未来，你的每个智能家居设备，从灯泡、插座，到扫地机器人、电视等，

都可以作为一个个独立的智能体 (Agent)，更智能、更贴心的响应你的指令。

这些独立的智能体，也可以彼此感知，彼此配合，构成一个更强大的协作网络。

而小爱音箱就像是你的智能家居专属管家，全心全意为你服务，释放智能家居的真正潜力。

## 🔥 项目预览

👉 查看完整演示视频：【[整活！将小爱音箱接入 ChatGPT 和豆包，改造成你的专属语音助手～](https://www.bilibili.com/video/BV1N1421y7qn/?share_source=copy_web&vd_source=5d4e78ff2a0dc6a661baa65f479199c1)】

<video src='https://github.com/idootop/mi-gpt/assets/35302658/dc336916-9087-418b-bc1b-04d5534dce8f'></video>

## ✨ 项目亮点

- **🎓 AI 问答**。想象一下，当小爱音箱接入大模型后，上知天文，下知地理，从“人工智障”秒变学霸。
- **🎭 角色扮演**。一秒调教小爱，无论是成为你的完美伴侣，还是那个能听你倾诉心事的贴心闺蜜，都不在话下。
- **💬 流式响应**。爱情来得太快就像龙卷风，而你的小爱音箱也是，对你的爱意秒回，爱你不会让你等太久。
- **🧠 长短期记忆**。小爱音箱现在能记住你们之间的每一次对话，越聊越默契，就像是你身边的老朋友。
- **🔊 自定义 TTS**。厌倦了小爱同学的语音？帮你解锁[「豆包」](https://doubao.com)同款音色，就像真人在回你的消息。
- **🤖️ 智能家居 Agent**。心情不好？小爱立刻懂你，自动帮你播放喜欢的音乐，调节灯光，逗你开心。_TODO_

## ⚡️ 快速开始

`MiGPT` 有两种启动方式: [Docker](#docker) 和 [Node.js](#nodejs)。

启动成功后，你可以通过以下方式来召唤 AI 回答问题：

- **小爱同学，请 xxx**。比如 `小爱同学，请问地球为什么是圆的？`
- **小爱同学，你 xxx**。比如 `小爱同学，你喜欢我吗？`
- **小爱同学，召唤 xxx**。比如 `小爱同学，召唤傻妞`

### 设备要求

本项目支持大部分的小爱音箱型号，推荐使用小爱音箱 Pro（完美运行）

👉 [查看更多兼容的小爱音箱型号和配置参数](https://github.com/idootop/mi-gpt/blob/main/docs/compatibility.md)

> 注意：本项目暂不支持小度音箱、天猫精灵、HomePod 等智能音箱设备，亦无相关适配计划。

### Docker

[![Docker Image Version](https://img.shields.io/docker/v/idootop/mi-gpt?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/mi-gpt)

对于电脑小白或者不想自己配置代码运行环境（Node）的同学，可以使用 Docker 启动方式。

请先按照 [⚙️ 参数设置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md) 相关说明，配置好你的 `.env` 和 `.migpt.js` 文件，然后使用以下命令启动 docker：

```shell
docker run -d --env-file $(pwd)/.env -v $(pwd)/.migpt.js:/app/.migpt.js idootop/mi-gpt:latest
```

注意：在 Windows 终端下需要将配置文件路径 `$(pwd)` 替换为绝对路径。

### Node.js

[![npm version](https://badge.fury.io/js/mi-gpt.svg)](https://www.npmjs.com/package/mi-gpt)

如果你是一名前端 (Node) 开发者，也可以通过 NPM 安装 `mi-gpt` 启动 `MiGPT`。

```shell
npm install mi-gpt # 安装依赖
```

然后，创建并启动 `MiGPT` 实例。初始化参数的具体说明请到 [⚙️ 参数设置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md) 查看。

```typescript
import { MiGPT } from "mi-gpt";

async function main() {
  const client = MiGPT.create({
    speaker: {
      userId: "987654321", // 注意：不是手机号或邮箱，请在「个人信息」-「小米 ID」查看
      password: "123456", // 账号密码
      did: "小爱音箱Pro", // 小爱音箱 ID 或在米家中设置的名称
    },
  });
  await client.start();
}

main();
```

注意：此模式下并不会主动读取 `.env` 和 `.migpt.js` 中的配置信息，你需要手动初始化 Node 环境变量，并将 `.migpt.js` 中的参数作为 `MiGPT.create` 的初始化参数传入。👉 [示例代码](https://github.com/idootop/mi-gpt/blob/example/index.ts)

## 📖 使用文档

以下为更详细的使用教程，大多数问题都可在 [💬 常见问题](https://github.com/idootop/mi-gpt/blob/main/docs/faq.md) 中找到答案。

- [⚙️ 参数设置](https://github.com/idootop/mi-gpt/blob/main/docs/settings.md)
- [💬 常见问题](https://github.com/idootop/mi-gpt/blob/main/docs/faq.md)
- [🔊 使用第三方 TTS](https://github.com/idootop/mi-gpt/blob/main/docs/tts.md)
- [🛠️ 本地开发](https://github.com/idootop/mi-gpt/blob/main/docs/development.md)
- [💎 工作原理](https://github.com/idootop/mi-gpt/blob/main/docs/how-it-works.md)
- [🦄 Sponsors](https://github.com/idootop/mi-gpt/blob/main/docs/sponsors.md)
- [✨ 更新日志](https://github.com/idootop/mi-gpt/blob/main/docs/changelog.md)
- [🚀 Roadmap](https://github.com/idootop/mi-gpt/blob/main/docs/roadmap.md)

## 👍 推荐项目与教程

| 项目名称与链接                                                                                                             | 简介                                                                                       | 来源      |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| [小爱音箱 PRO 的 AI 模式使用说明](https://github.com/idootop/mi-gpt/blob/main/assets/pdf/小爱音箱PRO%02AI模式使用说明.pdf) | 这是一位老爸为家里的小朋友专门整理的贴心教程                                               | 微信/大雨 |
| [@shinedlc/mi-gpt](https://github.com/shinedlc/mi-gpt)                                                                     | 一个接入了摄像头硬件 + 本机搭建 Ollama 模型的 MiGPT 分支，让小爱同学可以看到和理解现实世界 | @shinedlc |

## 🦄 Sponsors

<div align="center">
  <table>
    <tr>
      <td colspan="3" align="left">
        <p align="center">
          <a href="https://302.ai" target="_blank">
            <img src="https://raw.githubusercontent.com/idootop/mi-gpt/main/assets/sponsors/302logo.png" alt="302.AI" width="300" />
          </a>
        </p>
      </td>
    </tr>
    <tr>
      <td align="left">302.AI 是一个汇集全球顶级 AI 的自助平台，按需付费，零月费，零门槛使用各种类型 AI。</td>
      <td align="center" width="120px">
        <a href="https://302.ai" target="_blank">官方网站</a>
      </td>
      <td align="center" width="120px">
        <a href="https://help.302.ai" target="_blank">网站介绍</a>
      </td>
    </tr>
  </table>
</div>

## ❤️ 鸣谢

特别感谢以下项目提供的实现参考：

- https://github.com/yihong0618/xiaogpt
- https://github.com/jialeicui/open-lx01
- https://github.com/inu1255/mi-service
- https://github.com/Yonsm/MiService

## 🚨 免责声明

本项目仅供学习和研究目的，不得用于任何商业活动。用户在使用本项目时应遵守所在地区的法律法规，对于违法使用所导致的后果，本项目及作者不承担任何责任。
本项目可能存在未知的缺陷和风险（包括但不限于设备损坏和账号封禁等），使用者应自行承担使用本项目所产生的所有风险及责任。
作者不保证本项目的准确性、完整性、及时性、可靠性，也不承担任何因使用本项目而产生的任何损失或损害责任。
使用本项目即表示您已阅读并同意本免责声明的全部内容。

## License

[MIT](https://github.com/idootop/mi-gpt/blob/main/LICENSE) License © 2024-PRESENT Del Wang
