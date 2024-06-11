# v3.1.0

下一版本的更新计划

## 🔥 Hotfix

- ✅ 修复对 Azure OpenAI Service 的支持
- ✅ 修复 MIoT 和 Mina 接口查询到的设备名称不一致的问题。https://github.com/idootop/mi-gpt/issues/62
- ✅ 提示语列表为空时，不播放提示音。https://github.com/idootop/mi-gpt/issues/30#issuecomment-2153786207
- ✅ 唤醒模式下重新匹配唤醒词时，不再重复唤醒。https://github.com/idootop/mi-gpt/issues/25
- ✅ 修复使用提示音链接时，小爱回答完毕后，仍然重复播放文字提示语的问题。

## 💪 优化

- ✅ 优化 unWakeUp 小爱流程，增加指令间的执行间隔，降低 ROM 端无响应问题的出现概率。https://github.com/idootop/mi-gpt/issues/32
- ✅ 优化 debug 日志输出，添加 wakeUp、unWakeUp、env 等关键流程和核心数据的打印。

## 📒 文档

- ✅ 优化关于小米账号安全验证相关的提示语和使用说明。https://github.com/idootop/mi-gpt/issues/22#issuecomment-2150535622
- ✅ 优化关于 Azure OpenAI 配置的说明。https://github.com/idootop/mi-gpt/issues/7
- ✅ 优化调用 AI 进行回复的相关说明和示例。
- ✅ 优化找不到小爱设备的相关说明。https://github.com/idootop/mi-gpt/issues/28#issuecomment-2153645819
- ✅ 添加关于 clone 项目本地运行的相关配置教程。
- ✅ 添加关于本地构建本项目 docker 镜像的说明。
- ✅ 添加关于 clone 项目本地运行提示找不到 bot 的相关说明。
- ✅ 添加国内网络配置代理访问 OpenAI 服务的相关说明。https://github.com/idootop/mi-gpt/issues/29
- ✅ 添加关于 OpenAI 401 账号 API_KEY 错误， 403 触发 IP 访问风控的说明。https://github.com/idootop/mi-gpt/issues/19，https://github.com/idootop/mi-gpt/issues/33
- ✅ 添加关于 Node 项目下 MiGPT.create 参数配置的说明。 https://github.com/idootop/mi-gpt/issues/27
- ✅ 添加关于 Widnows 下 docker 启动参数配置的说明。https://github.com/idootop/mi-gpt/issues/26
- ✅ 添加对多账号/设备支持的相关说明
- ✅ 添加群晖 docker 使用教程
- ✅ 添加国内使用 Docker 配置镜像代理的相关说明。https://github.com/idootop/mi-gpt/issues/31
- ✅ 添加关于 OpenAI gpt4 模型不存在的相关说明
- ✅ 添加关于唤醒小爱、唤醒词、唤醒模式的说明和注意事项。
- ✅ 添加关于 playingCommand 的详细说明，默认不需要配置。

## ❤️ 感谢

- @shaoyi1991 补充的关于项目启动和国内配置 docker 镜像的说明。 https://github.com/idootop/mi-gpt/issues/28
- @shog86 协助调试 Azure OpenAI Service 相关的配置参数 https://github.com/idootop/mi-gpt/pull/34
- @otkHsiao 反馈 Azure OpenAI Service 配置 deployment 的问题 https://github.com/idootop/mi-gpt/pull/34#issuecomment-2156068725
- @siseboy 提供群晖 docker 使用教程 https://github.com/idootop/mi-gpt/issues/41
- @moffefei 提供的 Windows 下 docker 启动命令的示例 https://github.com/idootop/mi-gpt/issues/45
- @imhsz 协助调试 MIoT 和 Mina 接口查询到的设备名称不一致的问题。https://github.com/idootop/mi-gpt/issues/62

# v4.0.0

版本更新计划

## ✨ 新功能

- 支持火山引擎 TTS 和音色切换能力
- 开放自定义 System Prompt 能力
- 添加更详细的使用和配置视频教程

## 💪 优化

- 优化网络请求错误重试策略（消息/播放状态轮询）
- 添加常见小爱音箱型号的支持情况和参数列表
- 【待定】使用通知事件获取最新消息和设备播放状态
