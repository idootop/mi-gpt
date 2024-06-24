# 💬 常见问题

> 善用搜索，大多数问题都可在此处找到答案。如果你有新的问题，欢迎提交 [issue](https://github.com/idootop/mi-gpt/issues)。

## 🔥 高频问题

### Q：支持哪些型号的小爱音箱？

大部分型号的小爱音箱都支持，推荐小爱音箱 Pro（完美运行）

👉 [查看兼容的小爱音箱型号和配置参数](https://github.com/idootop/mi-gpt/blob/main/docs/compatibility.md)

> 注意：本项目暂不支持小度音箱、天猫精灵、HomePod 等智能音箱设备，亦无相关适配计划。

### Q：除了 OpenAI 还支持哪些模型，如何设置？

理论上兼容 [OpenAI SDK](https://www.npmjs.com/package/openai) 的模型都支持，只需修改环境变量即可接入到 MiGPT。比如：[通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1)、[零一万物](https://platform.01.ai/docs#making-an-api-request)、[Moonshot](https://platform.moonshot.cn/docs/api/chat)、[DeepSeek](https://platform.deepseek.com/api-docs/) 等。以 [通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1) 为例：

```shell
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen-turbo
OPENAI_API_KEY=通义千问 API_KEY
```

> 注意：OPENAI 环境变量名称不变，只需修改对应模型服务提供商的环境变量的值。

对于其他不兼容 OpenAI API 的大模型，比如豆包大模型、文心一言等，你也可以通过第三方的 API 聚合工具将其转换为 OpenAI API 兼容的格式。比如： [One API](https://github.com/songquanpeng/one-api) 和 [simple-one-api](https://github.com/fruitbars/simple-one-api)（推荐：支持 coze，使用更简单），然后修改对应的环境变量值即可完成接入。

关于不同模型的详细申请和配置教程，可以查看这篇文章：[MiGPT 接入豆包等大模型教程](https://migptgui.com/docs/apply/)

> 对于国内用户，可以查看 [此处](https://github.com/idootop/mi-gpt/blob/main/docs/sponsors.md) 获取国内可以直接访问的 OpenAI 代理服务以及免费的 OpenAI 体验 API_KEY。

### Q：是否支持其他 TTS 服务，如何接入？

支持接入任意 TTS 服务，包括本地部署的 ChatTTS 等。

具体的配置和使用教程，请查看此处：[🚗 使用第三方 TTS](https://github.com/idootop/mi-gpt/blob/main/docs/tts.md)

### Q：AI 回答的速度太慢了，怎么让她变快一点？

默认情况下 `MiGPT` 的配置参数比较保守，你可以通过酌情修改以下参数加速 AI 回复的速度。

```js
// .migpt.js
export default {
  speaker: {
    // 使用小爱自带的 TTS 引擎
    tts: "xiaoai",
    // 关闭 AI 开始回答时的提示语
    onAIAsking: [],
    // 关闭 AI 结束回答时的提示语
    onAIReplied: [],
    // 连续对话时，播放状态检测间隔（单位毫秒，最低 500 毫秒，默认 1 秒）
    checkInterval: 500, // 调小此值可以降低小爱回复之间的停顿感，请酌情调节
    // 连续对话时，下发 TTS 指令多长时间后开始检测设备播放状态（单位秒，最好不要低于 1s，默认 3 秒）
    checkTTSStatusAfter: 3, // 可适当调小或调大
    // ...
  },
};
```

另外你也可以选用 `gpt-3.5-turbo` 和 `gpt-4o` 等响应速度较快的模型，来加速 AI 的回复。

### Q：什么是唤醒模式（连续对话），如何唤醒 AI？

`唤醒模式` 类似于小爱技能，可能让你在跟小爱互动的时候，无需每句话都要以“小爱同学”开头唤醒。假设你的唤醒词配置如下：

```js
// .migpt.js
export default {
  speaker: {
    // 当消息以下面的关键词开头时，会调用 AI 来回复消息
    callAIKeywords: ["请", "你", "傻妞"],
    // 当消息以下面的关键词开头时，会进入 AI 唤醒状态
    wakeUpKeywords: ["打开", "进入", "召唤"],
    // ...
  },
};
```

🔥 唤醒 AI 分为以下 2 种类型，关于唤醒模式的更多细节，请查看[这里](https://github.com/idootop/mi-gpt/issues/28)。

1. **唤醒小爱同学**
   1. 正常对小爱音箱说“小爱同学”，唤醒其进入听写状态。
   2. 唤醒小爱同学后，可以对她说语音指令，比如“请问地球为什么是圆的”
   3. 此时，只有以 `callAIKeywords` 开头的消息，才会调用 AI 进行回复。
   4. 此阶段无法做到连续对话，每次提问都要以“小爱同学，请 xxx”开头。
2. **进入唤醒模式**
   1. 唤醒模式（AI 模式）类似小爱技能，进入后可以连续对话
   2. 使用 `wakeUpKeywords` 即可进入唤醒模式，比如“小爱同学，召唤傻妞”
   3. 进入唤醒模式后，每次提问请等待小爱回答“我说完了”之后，再继续向她提问
   4. 此时，可直接向小爱提问题，无需再以“小爱同学，xxx”开头。

> 注意：在唤醒模式下，当小爱回答“我说完了”之后，如果超过一段时间（3-10s）没有提问，小爱可能也会自己主动退出唤醒状态，此时需要再次通过“小爱同学，xxx”重新召唤小爱。

### Q：连续对话模式下，和小爱音箱说话没有反应是怎么回事？

需要注意提问的时机，在小爱正在回答问题或者她没在听你说话（唤醒）的时候，你跟她说话是接收不到的。

- 如果你是小爱音箱 Pro 的话，可以观察顶部的指示灯：**常亮**（而非一闪一闪或熄灭状态）的时候，就是在听你说话，即可与她正常对话。
- 如果你是其他型号，默认在 AI 回答完会有提示语“我说完了”，“还有其他问题吗”，等她提示语说完等过 1-2s 即可与之正常对话。
- 如果说了没反应，你就再用“小爱同学，xxx”把她重新唤醒就好了。

还有一种情况是：你的指令触发了小爱音箱内部的一些操作，比如播放/暂停，讲个笑话之类，

这种语音指令并不会被记录到小爱的历史消息中，故在外部无法接收到和正常处理你的此类语音指令。

> 注意：如果小爱同学正在播放音乐或者讲笑话，可能需要先让其暂停播放才能正常与 AI 对话，否则将会发生不可预期的错误。

### Q：有时回答太长说个没完没了，如何打断小爱的回复？

只需重新唤醒小爱同学，让她闭嘴即可，或者重新问她一个问题。比如：“小爱同学，请你闭嘴。”

## ❌ 启动失败类问题

### Q：提示“70016：登录验证失败”，无法正常启动

账号密码不正确。注意小米 ID 并非手机号或邮箱，请在[「个人信息」-「小米 ID」](https://account.xiaomi.com/fe/service/account/profile)查看，相关 [issue](https://github.com/idootop/mi-gpt/issues/10)。

### Q：提示触发小米账号异地登录保护机制，等待 1 个小时后仍然无法正常启动

这是因为小米账号触发了异地登录保护机制，需要先通过安全验证。打开小米官网登录你的小米账号，手动通过安全验证，通常等待 1-24 小时左右就可以正常登录了。

> 注意：最好使用和你运行 docker 相同的网络环境，如果你是在海外服务器等非中国大陆网络环境下登录小米账号，需要先同意小米的「个人数据跨境传输」协议。[👉 相关教程](https://github.com/idootop/mi-gpt/issues/22#issuecomment-2150535622)

在一些极端情况下，可能会因为你的服务器 IP 太脏，而导致一直无法正常访问小米账号登录链接。此时你可以尝试可以在本地运行 `MiGPT`，登录成功后把 `.mi.json` 文件导出，然后挂载到服务器对应容器的 `/app/.mi.json` 路径下即可解决此问题。相关 [issue](https://github.com/idootop/mi-gpt/issues/22#issuecomment-2148956802)

```shell
docker run -d  --env-file $(pwd)/.env \
    -v $(pwd)/.migpt.js:/app/.migpt.js \
    -v $(pwd)/.mi.json:/app/.mi.json \
    idootop/mi-gpt:latest
```

### Q：提示“找不到设备：xxx”，初始化 Mi Services 失败

填写的设备 did 不存在，请检查设备名称是否和米家中的一致。相关 [issue](https://github.com/idootop/mi-gpt/issues/30)。

<details>
<summary>👉 查看教程</summary>

查看小爱音箱设备名称：打开米家 - 进入小爱音箱主页 - 点击右上角更多 - 设备名称

常见错误设备名称示例，建议直接复制米家中的设备名称：

```js
// 错别字：响 -> 箱
❌ 小爱音响 -> ✅ 小爱音箱
// 多余的空格
❌ 小爱音箱 Pro -> ✅ 小爱音箱Pro
// 注意大小写
❌ 小爱音箱pro -> ✅ 小爱音箱Pro
```

</details>

某些情况下 Mina 和 MIoT 中的设备名称可能不一致，此时需要填写设备 did。

<details>
<summary>👉 查看设备 did 教程</summary>

先在 `.migpt.js` 配置文件中打开调试，重启 docker

```js
// .migpt.js
export default {
  speaker: {
    // 是否启用调试
    debug: true,
    // 是否跟踪 Mi Service 相关日志（打开后可以查看设备 did）
    enableTrace: true,
    // ...
  },
};
```

docker 启动后会在控制台输出设备列表相关的日志，找到 `MiNA 设备列表`：

```txt
MiNA 设备列表:  [
    {
        "deviceID": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxx",
        "serialNumber": "xxxx/xxxxxxx",
        "name": "小爱音箱Pro",
        "alias": "小爱音箱Pro",
        "current": false,
        "presence": "online",
        "address": "222.xxx.0.xxx",
        "miotDID": "123456", 👈 这就是你的小爱音箱 did
        "hardware": "LX06",
        "romVersion": "1.88.51",
    }
]
```

然后找到你的小爱音箱的 `miotDID` 填入 `.migpt.js` 即可。

```js
export default {
  speaker: {
    // 小爱音箱 DID 或在米家中设置的名称
    did: "123456",
    // ...
  },
};
```

获取设备成功后，记得再把之前的 `debug` 和 `enableTrace` 开关关掉。

</details>

注意：Mina 获取不到共享设备，如果你的小爱音箱是共享设备，是无法正常启动本项目的。相关 [issue](https://github.com/idootop/mi-gpt/issues/86)

### Q：提示“ERR_MODULE_NOT_FOUND”，无法正常启动

配置文件 `.migpt.js` 不存在或有错误。检查 docker 下是否存在 `/app/.migpt.js` 文件以及内容是否正确，相关 [issue](https://github.com/idootop/mi-gpt/issues/45)。

注意：在 Windows 终端（比如：PowerShell、cmd）下启动 docker 时，无法使用 `$(pwd)` 获取当前工作目录绝对路径，需要填写 `.env` 和 `.migpt.js` 文件的绝对路径。示例：

```shell
docker run -d --env-file D:/hello/mi-gpt/.env -v D:/hello/mi-gpt/.migpt.js:/app/.migpt.js idootop/mi-gpt:latest
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

### Q：进入唤醒模式时小爱莫名开始播放歌曲

有时小爱同学会把你进入唤醒模式的唤醒语，当成是歌曲名称来播放，比如“唤醒”等，此时可以尝试更换其他唤醒词，比如“打开”等。

## 📶 网络异常类问题

### Q：提示“LLM 响应异常 Connection error”，AI 回复失败

网络异常。OpenAI 的服务在国内需要配代理才能访问，相关 [issue](https://github.com/idootop/mi-gpt/issues/36)。

对于国内环境无法访问 OpenAI 服务的情况，有以下几种处理方法：

1. 环境变量里填上你的代理地址，比如：`HTTP_PROXY=http://127.0.0.1:7890`（或 `SOCKS_PROXY`）
2. 使用第三方部署的 OpenAI API 反向代理服务，然后更新 `OPENAI_BASE_URL`
3. 使用国内的 LLM 服务提供商，比如 [通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope/?spm=a2c4g.11186623.0.i1)、[零一万物](https://platform.01.ai/docs#making-an-api-request)、[Moonshot](https://platform.moonshot.cn/docs/api/chat)、[DeepSeek](https://platform.deepseek.com/api-docs/)等

> 对于国内用户，可以查看 [此处](https://github.com/idootop/mi-gpt/blob/main/docs/sponsors.md) 获取国内可以直接访问的 OpenAI 代理服务以及免费的 OpenAI 体验 API_KEY。

### Q：Docker 镜像拉取失败

网络异常。近期国内代理普遍不稳定，可以设置 Docker Hub 国内镜像。👉 [相关教程](https://github.com/idootop/mi-gpt/issues/31#issuecomment-2153741281)

## 🤖 大模型类问题

### Q：我想在本地部署大模型，如何在本项目中使用？

你可以使用 [Ollama](https://github.com/ollama)、[LM Studio](https://lmstudio.ai/)、[mistral.rs](https://github.com/EricLBuehler/mistral.rs) 等项目在本地部署大模型，它们都开箱自带兼容 OpenAI 的 API 服务，修改对应的环境变量值即可完成接入。

### Q：提示“LLM 响应异常 404 The model `gpt-4o` does not exist”

当前 OpenAI 账号没有使用 `gpt-4` 系列模型的权限，请切换到 `gpt-3` 系列模型，比如：`gpt-3.5-turbo`。相关 [issue](https://github.com/idootop/mi-gpt/issues/30#issuecomment-2154656498)

> 查看 [此处](https://github.com/idootop/mi-gpt/blob/main/docs/sponsors.md) 获取国内可以直接访问的 OpenAI 代理服务（支持 GPT-4o）

> 补充：新注册的 OpenAI 账号在没有绑卡充值之前，可能是用不了 `gpt-4` 系列模型的。相关 [issue](https://github.com/idootop/mi-gpt/issues/94)

### Q：提示“LLM 响应异常，401 Invalid Authentication”

无效的 `OpenAI_API_KEY`。请检查 `OpenAI_API_KEY` 是否能正常使用，以及对应环境变量是否生效。相关 [issue](https://github.com/idootop/mi-gpt/issues/59)

> 查看 [此处](https://github.com/idootop/mi-gpt/blob/main/docs/sponsors.md) 获取免费的 OpenAI 体验 API_KEY（支持 GPT-4o）

### Q：提示“LLM 响应异常，403 PermissionDeniedError”

代理 IP 被 Cloudflare 风控了，试试看切换代理节点。或者把环境变量里的 `HTTP_PROXY` 设置成空字符串 `HTTP_PROXY='' ` 关闭代理（仅适用于国产大模型）。相关 [issue](https://github.com/idootop/mi-gpt/issues/33)

### Q：提示“LLM 响应异常，404 Not Found”

模型路径不存在或者代理 IP 被风控。请检查 `OPENAI_BASEURL` 等环境变量是否配置正确，或切换代理节点后重试。相关 [issue](https://github.com/idootop/mi-gpt/issues/43)

### Q：是否支持 Azure OpenAI，如何配置？

如果你想使用 [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)，可通过配置以下环境变量开启：

```shell
OPENAI_API_VERSION=2024-04-01-preview
AZURE_OPENAI_API_KEY=你的密钥
AZURE_OPENAI_ENDPOINT=https://你的资源名.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=你的模型部署名，比如：gpt-35-turbo-instruct
```

注意：Azure OpenAI Studio 部署页面显示的模型版本号，可能并非实际的 `OPENAI_API_VERSION` 值。请打开模型 Play Ground 页面，选择你想用的部署（模型），然后点击示例代码，查看里面的 `api_version` 并替换上面的 `OPENAI_API_VERSION` 的值。

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

在群晖 docker 控制面板新建项目，按如下示例填写配置。👉 [参考教程](https://github.com/idootop/mi-gpt/issues/41)

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

### Q：“小爱同学”唤醒词能否换成其他的，比如“豆包”等

不可以，小爱音箱的唤醒词（小爱同学，xxx）是小爱音箱固件里写死的，外部无法自定义。

要想修改只能刷机替换自己训练的语音识别模型。👉 [相关讨论](https://github.com/idootop/mi-gpt/issues/84#issuecomment-2164826933)

### Q：如何关闭 AI 开始和结束回复的提示语？

在配置文件中，将对应提示语属性设置成空数组即可，比如：

```js
// .migpt.js
export default {
  speaker: {
    // 取消进入 AI 模式的欢迎语
    onEnterAI: [],
    // 取消退出 AI 模式的提示语
    onExitAI: [],
    // 取消 AI 开始回答时的提示语
    onAIAsking: [],
    // 取消 AI 结束回答时的提示语
    onAIReplied: [],
    // ...
  },
};
```

> 注意：提示语是为了更好的提示当前小爱回复的状态，去掉提示语可能会导致感觉小爱没有反应。

### Q：是否支持同时使用多个小米音箱设备/账号？

目前 `MiGPT` 只支持单实例运行。但是你可以通过创建多个不同设备/账号配置的 docker 容器，来实现对多设备/账号的支持，相关 [issue](https://github.com/idootop/mi-gpt/issues/51)。

### Q：`MiGPT` 是否需要和小爱音箱在同一局域网下运行？

不需要。`MiGPT` 底层是调用的 MIoT 云端接口，可在任意设备或服务器上运行，无需和小爱音箱在同一局域网下。

### Q：原来的小爱同学会在 AI 回答之前抢话？

与本项目的实现原理有关。本项目通过轮询小米接口获取最新的对话信息，当检测到小爱在回复的时候会通过播放静音音频等方式快速 mute 掉小爱原来的回复。但是从小爱开始回复，到上报状态给小米服务云端，再到本项目通过小米云端接口轮训到这个状态变更，中间会有大约 1 -2 秒的延迟时间，无解。

这个问题，理论上需要通过刷机才能完美解决，可以参考下面的相关讨论：

- https://github.com/yihong0618/xiaogpt/issues/515#issuecomment-2121602572
- https://github.com/idootop/mi-gpt/issues/21#issuecomment-2147125219

### Q：怎样在使用时修改小爱音箱的人物设定？

试试这样说：`小爱同学，你是 xxx，你 xxx`，比如：

```txt
小爱同学，你是蔡徐坤。你是一名歌手，喜欢唱跳 rap。
```

或者如果你想更新自己的人物设定，可以这样说：`小爱同学，我是 xxx，我 xxx`

### Q：怎样使用豆包的音色

本项目暂不对外提供豆包 TTS 服务，但是你可以使用与豆包同款的火山 TTS 引擎。

具体的配置和使用教程，请查看此处：[🚗 使用第三方 TTS](https://github.com/idootop/mi-gpt/blob/main/docs/tts.md)

### Q：怎样控制米家设备？

这是一个 todo 功能，尚未开始开发。后面有时间的话，我会继续添加智能家居 Agents 和插件系统（比如联网搜索，自定义语音指令）等功能，保持关注。

### Q：我还有其他问题

请先在 FAQ 和 issue 列表搜索是否有人遇到与你类似的问题并已解答。如果确认是新的问题，请在此处提交 [issue](https://github.com/idootop/mi-gpt/issues) 反馈，并提供详细的问题描述和相关错误截图。
