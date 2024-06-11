# 💬 常见问题

### Q：支持哪些型号的小爱音箱？

大部分型号的小爱音箱都支持，推荐小爱音箱 Pro（完美运行）。部分机型的 MioT 接口开放能力并不完整，比如小米音箱 Play 增强版（L05C），将会导致 `MiGPT` 部分功能异常，相关 [issue](https://github.com/idootop/mi-gpt/issues/14)。

## ❌ 启动失败类问题

### Q：提示“70016：登录验证失败”，无法正常启动

账号密码不正确。注意小米 ID 并非手机号或邮箱，请在[「个人信息」-「小米 ID」](https://account.xiaomi.com/fe/service/account/profile)查看，相关 [issue](https://github.com/idootop/mi-gpt/issues/10)。

### Q：提示“login failed &&&START&&&{"notificationUrl”，无法正常启动

小米账号触发了异地登录保护，需要先通过安全验证。打开小米官网登录你的小米账号，手动通过安全验证，然后等待 30 分钟左右应该就可以正常登录了。

注意：最好使用和你运行 docker 相同的网络环境，如果你是在海外服务器等非中国大陆网络环境下登录小米账号，需要先同意小米的「个人数据跨境传输」协议。[👉 相关教程](https://github.com/idootop/mi-gpt/issues/22#issuecomment-2150535622)

### Q：提示“ERR_MODULE_NOT_FOUND”，无法正常启动

配置文件 `.migpt.js` 不存在或有错误。检查 docker 下是否存在 `/app/.migpt.js` 文件以及内容是否正确，相关 [issue](https://github.com/idootop/mi-gpt/issues/45)。

注意：在 Windows 终端（比如：PowerShell、cmd）下启动 docker 时，无法使用 `$(pwd)` 获取当前工作目录绝对路径，需要填写 `.env` 和 `.migpt.js` 文件的绝对路径。示例：

```shell
docker run --env-file D:/hello/mi-gpt/.env -v D:/hello/mi-gpt/.migpt.js:/app/.migpt.js idootop/mi-gpt:latest
```

### Q：提示“找不到设备：xxx”，初始化 Mi Services 失败

填写的设备 did 不存在，请检查设备名称是否和米家中的一致。相关 [issue](https://github.com/idootop/mi-gpt/issues/30)。

常见错误设备名称的示例：

```js
// 错别字：响 -> 箱
❌ 小爱音响 -> ✅ 小爱音箱
// 多余的空格
❌ 小爱音箱 Pro -> ✅ 小爱音箱Pro
```

## 🔊 播放异常类问题

### Q：小爱音箱收到消息后，没有调用 AI 进行回复

`MiGPT` 收到消息默认不会调用 AI 进行回复，只会回复以唤醒词开头的消息，比如：“请问 xxx”、“你 xxx” 等，你也可以自定义唤醒词（`callAIKeywords`）列表。

```js
// .migpt.js
export default {
  speaker: {
    // 当消息以下面的关键词开头时，会调用 AI 来回复消息
    callAIKeywords: ["请", "你", "傻妞"],
    // ...
  },
};
```

注意：你需要先召唤小爱同学，而非直接对小爱音箱说：“请你 xxx”，这样是无效的，因为还没有唤醒小爱同学，你说的话她接收不到。

```shell
// ❌ 错误示范
请问地球为什么是圆的？
// ✅ 正确示范
小爱同学，请问地球为什么是圆的？
```

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

如果修改参数后问题仍然存在，说明你的设备不支持通过开放接口查询播放状态（比如：小米音箱 Play 增强版），此问题无解。建议更换其他型号的小爱音箱（推荐小爱音箱 Pro），相关 [issue](https://github.com/idootop/mi-gpt/issues/14)。

或者你也可以关闭配置文件中的流式响应（streamResponse）选项，确保小爱能够回复完整的句子。不过需要注意的是，关闭流式响应后，唤醒模式等功能将会失效。

## 📶 网络异常类问题

### Q：提示“LLM 响应异常 Connection error”，AI 回复失败

网络异常。OpenAI 的服务在国内需要配代理才能访问，相关 [issue](https://github.com/idootop/mi-gpt/issues/36)。

对于国内环境无法访问 OpenAI 服务的情况，有以下几种处理方法：

1. 环境变量里填上你的代理地址，比如：`HTTP_PROXY=http://127.0.0.1:7890`
2. 使用第三方部署的 OpenAI API 反向代理服务，然后更新 `OPENAI_BASE_URL`
3. 使用国内的 LLM 服务提供商，比如 [通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1)、[零一万物](https://platform.01.ai/docs#making-an-api-request)、[Moonshot](https://platform.moonshot.cn/docs/api/chat)、[DeepSeek](https://platform.deepseek.com/api-docs/)等

### Q：Docker 镜像拉取失败

网络异常。近期国内代理普遍不稳定，可以设置 Docker Hub 国内镜像，👉 [相关教程](https://github.com/idootop/mi-gpt/issues/31#issuecomment-2153741281)。

## 🤖 大模型类问题

### Q：除了 OpenAI 还支持哪些模型，如何设置？

理论上兼容 [OpenAI SDK](https://www.npmjs.com/package/openai) 的模型都支持，只需修改环境变量即可接入到 MiGPT。

比如：[通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1)、[零一万物](https://platform.01.ai/docs#making-an-api-request)、[Moonshot](https://platform.moonshot.cn/docs/api/chat)、[DeepSeek](https://platform.deepseek.com/api-docs/) 等，以 Moonshot 为例：

```shell
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
OPENAI_API_KEY=$MOONSHOT_API_KEY
```

### Q：是否支持 Azure OpenAI，如何配置？

如果你想使用 [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)，可通过配置以下环境变量开启：

```shell
OPENAI_API_VERSION=2024-04-01-preview
AZURE_OPENAI_API_KEY=你的密钥
AZURE_OPENAI_ENDPOINT=https://你的资源名.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=你的模型部署名，比如：gpt-35-turbo-instruct
```

注意：Azure OpenAI Studio 部署页面显示的模型版本号，可能并非实际的 `OPENAI_API_VERSION` 值。请打开模型 Play Ground 页面，选择你想用的部署（模型），然后点击示例代码，查看里面的 `api_version` 并替换上面的 `OPENAI_API_VERSION` 的值。

### Q：提示“LLM 响应异常，401 Invalid Authentication”

无效的 `OpenAI_API_KEY`。请检查 `OpenAI_API_KEY` 是否能正常使用，以及对应环境变量是否生效，相关 [issue](https://github.com/idootop/mi-gpt/issues/59)。

### Q：提示“LLM 响应异常，403 PermissionDeniedError”

代理 IP 被 Cloudflare 风控了，试试看切换代理节点。或者把环境变量里的 `HTTP_PROXY` 设置成空字符串 `HTTP_PROXY='' ` 关闭代理（仅适用于国产大模型），相关 [issue](https://github.com/idootop/mi-gpt/issues/33)。

### Q：提示“LLM 响应异常，404 Not Found”

模型路径不存在或者代理 IP 被风控。请检查 `OPENAI_BASEURL` 等环境变量是否配置正确，或切换代理节点后重试，相关 [issue](https://github.com/idootop/mi-gpt/issues/43)。

## 🚗 运行原理类问题

### Q：什么是唤醒模式？

`唤醒模式` 类似于小爱技能，可能让你在跟小爱互动的时候，无需每句话都要以“小爱同学”开头唤醒。

关于唤醒模式的更多细节，请查看这里：https://github.com/idootop/mi-gpt/issues/28

### Q：为什么小爱音箱会在 AI 回答之前抢话？

与本项目的实现原理有关。本项目通过轮询小米接口获取最新的对话信息，当检测到小爱在回复的时候会通过播放静音音频等方式快速 mute 掉小爱原来的回复。但是从小爱开始回复，到上报状态给小米服务云端，再到本项目通过小米云端接口轮训到这个状态变更，中间会有大约 1 -2 秒的延迟时间，无解。

这个问题，理论上需要通过刷机才能完美解决，可以参考下面的相关讨论：

- https://github.com/yihong0618/xiaogpt/issues/515#issuecomment-2121602572
- https://github.com/idootop/mi-gpt/issues/21#issuecomment-2147125219

## ⭐️ 其他问题

### Q：如何打开调试开关？

调试模式下可以输出更为详细的错误日志，方便分析和定位错误来源。你可以按照下面的配置方式开启 `debug` 模式：

```js
// .migpt.js
export default {
  speaker: {
    // 打开调试开关
    debug: true,
    // ...
  },
};
```

### Q：怎么在群晖上使用这个项目？

在群晖 docker 控制面板新建项目，按如下示例填写配置，👉 [参考教程](https://github.com/idootop/mi-gpt/issues/41)。

```yaml
services:
  mi-gpt:
    image: idootop/mi-gpt:latest
    container_name: mi-gpt
    network_mode: bridge
    environment:
      - TZ=Asia/Shanghai
    env_file:
      - /volume1/docker/xiaomi/.env
    volumes:
      - /volume1/docker/xiaomi/.migpt.js:/app/.migpt.js
```

注意：其中的 `env_file` 和 `volumes` 路径，请根据自己的配置文件实际路径来填写。

### Q：是否支持同时使用多个小米音箱设备/账号？

目前 `MiGPT` 只支持单实例运行。但是你可以通过创建多个不同设备/账号配置的 docker 容器，来实现对多设备/账号的支持，相关 [issue](https://github.com/idootop/mi-gpt/issues/51)。

### Q：怎样使用豆包的音色

此功能需要豆包 TTS 接口支持，本项目暂不对外提供此服务。

后续会支持火山引擎 TTS 服务（豆包同款），可以使用演示视频中的熊二等音色。

### Q：我还有其他问题

请在此处提交 [issue](https://github.com/idootop/mi-gpt/issues) 反馈，并提供详细的问题描述和相关错误截图。
