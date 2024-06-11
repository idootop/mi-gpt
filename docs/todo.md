# v3.1.0

下一版本的更新计划

## 🔥 Hotfix

- 提示语列表为空时，不播放提示语。
- 提示语和提示音链接都为空时，不播放提示音。https://github.com/idootop/mi-gpt/issues/30#issuecomment-2153786207
- 修复因没有配置环境变量，而导致没有初始化成功 OpenAI 使程序崩溃。 https://github.com/idootop/mi-gpt/issues/30#issuecomment-2153753279
- 修复唤醒模式下，重新匹配唤醒词时，应该走询问 AI 的流程。([issues#25](https://github.com/idootop/mi-gpt/issues/25))
- 修复使用提示音链接时，小爱回答完毕后，仍然重复播放文字提示语的问题。

## 💪 优化

- 优化 unWakeUp 小爱的流程，增加指令间的执行间隔，降低 ROM 端无响应问题的出现的概率。https://github.com/idootop/mi-gpt/issues/32
- 优化 debug 日志输出，添加 wakeUp、unWakeUp、env 等关键流程和核心数据的打印。

## 📒 文档 FAQ

- ✅ 优化关于小米账号安全验证相关的提示语和使用说明。https://github.com/idootop/mi-gpt/issues/22#issuecomment-2150535622
- ✅ 优化关于 Azure OpenAI 配置的说明。https://github.com/idootop/mi-gpt/issues/7
- 优化找不到小爱设备的提示文案以及 FAQ 教程。https://github.com/idootop/mi-gpt/issues/28#issuecomment-2153645819
- 添加关于唤醒小爱、唤醒词、唤醒模式的说明和注意事项。
- ✅ 添加关于 clone 项目本地运行的相关配置教程。
- ✅ 添加关于本地构建本项目 docker 镜像的说明。
- 添加关于 playingCommand 的详细说明，默认不需要配置。
- 添加常见小爱音箱型号的支持情况和参数列表。
- ✅ 添加关于 clone 项目本地运行提示找不到 bot 的相关说明。
- 添加国内设备代理配置相关的说明。https://github.com/idootop/mi-gpt/issues/29
- 添加国内设备使用 Docker 镜像配置镜像代理的说明。https://github.com/idootop/mi-gpt/issues/31
- 添加关于 OpenAI 401 账号 API_KEY 错误， 403 触发 IP 访问风控的说明。https://github.com/idootop/mi-gpt/issues/19，https://github.com/idootop/mi-gpt/issues/33
- ✅ 添加关于 Node 项目下 MiGPT.create 参数配置的说明。 https://github.com/idootop/mi-gpt/issues/27
- ✅ 添加关于 Widnows 下 docker 启动参数配置的说明。https://github.com/idootop/mi-gpt/issues/26

## ❤️ 感谢

- @shaoyi1991 补充的关于项目启动和国内配置 docker 镜像的说明。 https://github.com/idootop/mi-gpt/issues/28
- @shog86 协助调试 Azure OpenAI Service 相关的配置参数 https://github.com/idootop/mi-gpt/pull/34
- @otkHsiao 反馈 Azure OpenAI Service 配置 deployment 的问题 https://github.com/idootop/mi-gpt/pull/34#issuecomment-2156068725
- @siseboy 提供群晖 docker 使用教程 https://github.com/idootop/mi-gpt/issues/41
- @moffefei 提供的 Windows 下 docker 启动命令的示例 https://github.com/idootop/mi-gpt/issues/45

# v4.0.0 

版本更新计划

## ✨ 新功能

- 支持火山引擎 TTS 和音色切换能力
- 添加更详细的使用和配置视频教程