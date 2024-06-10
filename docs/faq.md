# 💬 常见问题

### Q：支持哪些型号的小爱音箱？

大部分型号的小爱音箱都支持，推荐小爱音箱 Pro（完美运行）。部分机型的 MioT 接口开放能力并不完整，比如小米音箱 Play 增强版（L05C），将会导致 `MiGPT` 部分功能异常，相关 [issue](https://github.com/idootop/mi-gpt/issues/14)。

### Q：除了 OpenAI 还支持哪些模型，如何设置？

理论上兼容 [OpenAI SDK](https://www.npmjs.com/package/openai) 的模型都支持，只需修改环境变量即可接入到 MiGPT。

比如：[通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1)、[零一万物](https://platform.01.ai/docs#making-an-api-request)、[Moonshot](https://platform.moonshot.cn/docs/api/chat)、[DeepSeek](https://platform.deepseek.com/api-docs/) 等，以 Moonshot 为例：

```shell
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
OPENAI_API_KEY=$MOONSHOT_API_KEY
```

### Q：什么是唤醒模式？

`唤醒模式` 类似于小爱技能，可能让你在跟小爱互动的时候，无需每句话都要以“小爱同学”开头唤醒。

关于唤醒模式的更多细节，请查看这里：https://github.com/idootop/mi-gpt/issues/28

### Q：提示登录小米账号失败，无法正常启动

1. **账号密码不正确**：小米 ID 并非手机号或邮箱，请在[「个人信息」-「小米 ID」](https://account.xiaomi.com/fe/service/account/profile)查看。
2. **网络环境异常**：如果你是在海外服务器等，非中国大陆网络环境下登录小米账号，需要先同意小米的「个人数据跨境传输」协议，然后按照提示验证手机号或邮箱，等待大约 30 分钟之后即可正常登录。[👉 相关教程](https://github.com/idootop/mi-gpt/issues/22#issuecomment-2150535622)

### Q：小爱音箱收到消息后，没有调用 AI 进行回复

`MiGPT` 收到消息默认不会调用 AI 进行回复，只会回复以唤醒词开头的消息，比如：“请问 xxx”、“你 xxx” 等，你也可以自定义唤醒词（`callAIKeywords`）列表。

### Q：小爱音箱没有播放 AI 的回答，但控制台有打印 AI 的回复

不同型号的小爱音箱 TTS 指令不同: [issues#5](https://github.com/idootop/mi-gpt/issues/5#issuecomment-2122881495)

请到 <https://home.miot-spec.com> 查询具体指令，并修改配置文件中的 `ttsCommand` 参数。

<details>
<summary>👉 查看教程</summary>

![](https://raw.githubusercontent.com/idootop/mi-gpt/main/assets/search.jpg)
![](https://raw.githubusercontent.com/idootop/mi-gpt/main/assets/command.jpg)

</details>

### Q：小爱音箱没有读完整个句子，总是戛然而止

部分型号的小爱音箱不支持通过 Mina 获取设备播放状态，只能通过 MiOT 指令查询。

请到 <https://home.miot-spec.com> 查询具体指令，并修改配置文件中的 `playingCommand` 参数。

<details>
<summary>👉 查看教程</summary>

![](https://raw.githubusercontent.com/idootop/mi-gpt/main/assets/playing.png)

</details>

如果修改参数后问题仍然存在，说明你的设备不支持通过开放接口查询播放状态（比如：小米音箱 Play 增强版），## 此问题无解。建议更换其他型号的小爱音箱（推荐小爱音箱 Pro），相关 [issue](https://github.com/idootop/mi-gpt/issues/14)。

或者你也可以关闭配置文件中的流式响应（streamResponse）选项，确保小爱能够回复完整的句子。不过需要注意的是，关闭流式响应后，唤醒模式等功能将会失效。

### Q: 为什么小爱音箱会在 AI 回答之前抢话？

与本项目的实现原理有关。本项目通过轮询小米接口获取最新的对话信息，当检测到小爱在回复的时候会通过播放静音音频等方式快速 mute 掉小爱原来的回复。

但是从小爱开始回复，到上报状态给小米服务云端，再到本项目通过小米云端接口轮训到这个状态变更，中间会有大约 1 -2 秒的延迟时间，无解。

这个问题，理论上需要通过刷机才能完美解决，可以参考下面的相关讨论：

- https://github.com/yihong0618/xiaogpt/issues/515#issuecomment-2121602572
- https://github.com/idootop/mi-gpt/issues/21#issuecomment-2147125219

### Q：启动 docker 提示 ERR_MODULE_NOT_FOUND，无法正常启动

在 Windows 终端（比如：PowerShell、cmd）下，无法使用 `$(pwd)` 获取当前工作目录绝对路径，需要填写 `.env` 和 `.migpt.js` 文件的绝对路径。相关 [issue](https://github.com/idootop/mi-gpt/issues/26#issuecomment-2151381521)

<details>
<summary>👉 查看示例</summary>

请将下面的 `/绝对路径/` 替换为你当前目录的绝对路径：

```shell
docker run -d --env-file /绝对路径/.env \
    -v /绝对路径/.migpt.js:/app/.migpt.js \
    idootop/mi-gpt:latest
```

Windows PowerShell 终端

```shell
docker run -d --env-file $pwd\.env `
    -v $pwd\.migpt.js:/app/.migpt.js `
    idootop/mi-gpt:latest
```

Windows cmd 终端

```shell
docker run -d --env-file %cd%\.env ^
    -v %cd%\.migpt.js:/app/.migpt.js ^
    idootop/mi-gpt:latest
```

</details>

### Q：我 Clone 了这个仓库，但是本地启动失败

如果你是通过 clone 本项目仓库的方式来运行，记得在 `start` 之前先 `build` 一下。

```shell
pnpm install && pnpm build && pnpm start
```

另外， `start` 命令默认没有注入 `.env` 文件里的环境变量。你可以在 VS Code 里按 F5 直接运行，会自动读取 `.env` ，或者将启动脚本改为：

```shell
node --env-file=.env app.js
```

### Q：怎样使用豆包的音色

此功能需要豆包 TTS 接口支持，本项目暂不对外提供此服务。

### Q：我还有其他问题

请在此处提交 [issue](https://github.com/idootop/mi-gpt/issues) 反馈，并提供详细的问题描述和相关错误截图。
