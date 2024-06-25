# 🔊 使用第三方 TTS

`MiGPT` 默认使用小米自带的 TTS 朗读文字内容，如果你需要：

1. 绕过小米 TTS 提示文字存在敏感信息
2. 使用第三方 TTS 或本地搭建的 TTS 服务，自定义 TTS 音色

你可以通过以下步骤，切换 `MiGPT` 使用的 TTS 引擎：

1. 配置 `TTS_BASE_URL` 环境变量
2. 切换 `speaker.tts` 为 `custom`

```js
// .env
TTS_BASE_URL=http://[你的局域网或公网地址]:[端口号]/api，比如：http://192.168.31.205:4321/api

// .migpt.js
export default {
  speaker: {
    // TTS 引擎
    tts: 'custom',
    // 切换 TTS 引擎发言人音色关键词
    switchSpeakerKeywords: ["把声音换成"], // 以此关键词开头即可切换音色，比如：把声音换成 xxx
    // ...
  },
};
```

配置成功后，即可通过 `小爱同学，把声音换成 xxx` 语音指令切换 TTS 音色。

[MiGPT-TTS](https://github.com/idootop/mi-gpt-tts) 支持的完整 TTS 音色列表与名称请查看此处：[volcano.ts](https://github.com/idootop/mi-gpt-tts/blob/main/src/tts/volcano.ts)

## TTS_BASE_URL

其中 `TTS_BASE_URL` 是你的外部 TTS 服务引擎地址。这里提供一个 Node.js 端的示例：[MiGPT-TTS](https://github.com/idootop/mi-gpt-tts)：

目前接入了 [火山引擎](https://www.volcengine.com/docs/6561/79817) 的语音合成服务，实名认证后可以免费使用 21 款常用音色。

具体部署和使用教程，请移步：https://github.com/idootop/mi-gpt-tts

## 支持更多的 TTS 服务

如果你想使用本地 TTS 服务（比如：ChatTTS），或者接入其他 TTS 服务商（比如微软、讯飞、OpenAI 等），

可参考上面的 [MiGPT-TTS](https://github.com/idootop/mi-gpt-tts) 项目代码自行搭建服务端，只需满足以下接口即可：

### GET `TTS_BASE_URL/tts.mp3`

文字合成音频，请求示例：`/api/tts.mp3?speaker=BV700_streaming&text=很高兴认识你`

其中，请求参数 `speaker` 为指定音色名称或标识，可选。

### GET `TTS_BASE_URL/speakers`

获取音色列表

| 属性    | 说明     | 示例              |
| ------- | -------- | ----------------- |
| name    | 音色名称 | `灿灿`            |
| gender  | 性别     | `女`              |
| speaker | 音色标识 | `BV700_streaming` |

返回值示例

```json
[
  {
    "name": "广西老表",
    "gender": "男",
    "speaker": "BV213_streaming"
  },
  {
    "name": "甜美台妹",
    "gender": "女",
    "speaker": "BV025_streaming"
  }
]
```

## 可用的 TTS 引擎列表

如果你实现了对更多 TTS 服务的支持，欢迎提交 PR，将你的项目分享给大家。

- [MiGPT-TTS](https://github.com/idootop/mi-gpt-tts)：目前接入了 [火山引擎](https://www.volcengine.com/docs/6561/79817) 的语音合成服务，实名认证后可以免费使用 21 款常用音色。
