# ⚙️ 配置参数

## .migpt.js

重命名本项目根目录下的 [.migpt.example.js](https://github.com/idootop/mi-gpt/blob/main/.migpt.example.js) 文件为 `.migpt.js`。

然后，将里面的配置参数修改成你自己的，参数含义如下：

| 参数名称                     | 描述                                                                                                                                                 | 示例                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `systemTemplate`             | 系统 Prompt 模板，可以更灵活的控制 AI 的各种行为规则，是否需要携带上下文等 👉 [设置教程](https://github.com/idootop/mi-gpt/blob/main/docs/prompt.md) | `"你是一个博学多识的人，下面请友好的回答用户的提问，保持精简。"` |
| **bot**                      |                                                                                                                                                      |                                                                  |
| `name`                       | 对方名称（小爱音箱）                                                                                                                                 | `"傻妞"`                                                         |
| `profile`                    | 对方的个人简介/人设                                                                                                                                  | `"性别女，性格乖巧可爱，喜欢搞怪，爱吃醋。"`                     |
| **master**                   |                                                                                                                                                      |                                                                  |
| `name`                       | 主人名称（我自己）                                                                                                                                   | `"陆小千"`                                                       |
| `profile`                    | 主人的个人简介/人设                                                                                                                                  | `"性别男，善良正直，总是舍己为人，是傻妞的主人。"`               |
| **room**                     |                                                                                                                                                      |                                                                  |
| `name`                       | 会话群名称                                                                                                                                           | `"魔幻手机"`                                                     |
| `description`                | 会话群简介                                                                                                                                           | `"傻妞和陆小千的私聊"`                                           |
| **speaker**                  |                                                                                                                                                      |                                                                  |
| `userId`                     | [小米 ID](https://account.xiaomi.com/fe/service/account/profile)（注意：不是手机号或邮箱）                                                           | `"987654321"`                                                    |
| `password`                   | 账户密码                                                                                                                                             | `"123456"`                                                       |
| `did`                        | 小爱音箱 ID 或名称                                                                                                                                   | `"小爱音箱 Pro"`                                                 |
| `ttsCommand`                 | 小爱音箱 TTS 指令（[可在此查询](https://home.miot-spec.com)）                                                                                        | `[5, 1]`                                                         |
| `wakeUpCommand`              | 小爱音箱唤醒指令（[可在此查询](https://home.miot-spec.com)）                                                                                         | `[5, 3]`                                                         |
| **speaker 其他参数（可选）** |
| `tts`                        | TTS 引擎（教程：[🚗 使用第三方 TTS](https://github.com/idootop/mi-gpt/blob/main/docs/tts.md)）                                                       | `"xiaoai"`                                                       |
| `switchSpeakerKeywords`      | 切换 TTS 音色关键词，只有配置了第三方 TTS 引擎时才有效                                                                                               | `["把声音换成"]`                                                 |
| `callAIKeywords`             | 当消息以关键词开头时，会调用 AI 来响应用户消息                                                                                                       | `["请", "傻妞"]`                                                 |
| `wakeUpKeywords`             | 当消息以关键词开头时，会进入 AI 唤醒状态                                                                                                             | `["召唤傻妞", "打开傻妞"]`                                       |
| `exitKeywords`               | 当消息以关键词开头时，会退出 AI 唤醒状态                                                                                                             | `["退出傻妞", "关闭傻妞"]`                                       |
| `onEnterAI`                  | 进入 AI 模式的欢迎语                                                                                                                                 | `["你好，我是傻妞，很高兴认识你"]`                               |
| `onExitAI`                   | 退出 AI 模式的提示语                                                                                                                                 | `["傻妞已退出"]`                                                 |
| `onAIAsking`                 | AI 开始回答时的提示语                                                                                                                                | `["让我先想想", "请稍等"]`                                       |
| `onAIReplied`                | AI 结束回答时的提示语                                                                                                                                | `["我说完了", "还有其他问题吗"]`                                 |
| `onAIError`                  | AI 回答异常时的提示语                                                                                                                                | `["出错了，请稍后再试吧！"]`                                     |
| `playingCommand`             | 查询小爱音箱是否在播放中指令（注意：默认无需配置此参数，播放出现问题时再尝试开启）                                                                   | `[3, 1, 1]`                                                      |
| `streamResponse`             | 是否启用连续对话功能，部分小爱音箱型号无法查询到正确的播放状态，需要关闭连续对话应）                                                                 | `true`                                                           |
| `exitKeepAliveAfter`         | 连续对话时，无响应多久后自动退出（默认 30 秒）                                                                                                       | `30`                                                             |

## 环境变量

重命名本项目根目录下的 [.env.example](https://github.com/idootop/mi-gpt/blob/main/.env.example) 文件为 `.env`。

然后，将里面的环境变量修改成你自己的，参数含义如下：

| 环境变量名称           | 描述                                                                                        | 示例                                           |
| ---------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **OpenAI**             |                                                                                             |                                                |
| `OPENAI_API_KEY`       | OpenAI API 密钥                                                                             | `abc123`                                       |
| `OPENAI_MODEL`         | 使用的 OpenAI 模型                                                                          | `gpt-4o`                                       |
| `OPENAI_BASE_URL`      | 可选，OpenAI API BaseURL                                                                    | `https://api.openai.com/v1`                    |
| `AZURE_OPENAI_API_KEY` | 可选，[Microsoft Azure OpenAI](https://www.npmjs.com/package/openai#microsoft-azure-openai) | `abc123`                                       |
| **提示音效（可选）**   |                                                                                             |                                                |
| `AUDIO_SILENT`         | 静音音频链接                                                                                | `"https://example.com/slient.wav"`             |
| `AUDIO_BEEP`           | 默认提示音链接                                                                              | `"https://example.com/beep.wav"`               |
| `AUDIO_ACTIVE`         | 唤醒提示音链接                                                                              | `"https://example.com/active.wav"`             |
| `AUDIO_ERROR`          | 出错提示音链接                                                                              | `"https://example.com/error.wav"`              |
| **第三方 TTS（可选）** |                                                                                             |                                                |
| `TTS_BASE_URL`         | 第三方 TTS 服务接口                                                                         | `"http://[你的局域网或公网地址]:[端口号]/api"` |
