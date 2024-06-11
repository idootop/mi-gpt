# ✨ 更新日志

## v3.1.0

### 🔥 Hotfix

- ✅ 修复对 Azure OpenAI Service 的支持
- ✅ 修复 MIoT 和 Mina 接口查询到的设备名称不一致的问题。https://github.com/idootop/mi-gpt/issues/62
- ✅ 提示语列表为空时，不播放提示音。https://github.com/idootop/mi-gpt/issues/30#issuecomment-2153786207
- ✅ 唤醒模式下重新匹配唤醒词时，不再重复唤醒。https://github.com/idootop/mi-gpt/issues/25
- ✅ 修复使用提示音链接时，小爱回答完毕后，仍然重复播放文字提示语的问题。

### 💪 优化

- ✅ 优化 unWakeUp 小爱流程，增加指令间的执行间隔，降低 ROM 端无响应问题的出现概率。https://github.com/idootop/mi-gpt/issues/32
- ✅ 优化 debug 日志输出，添加 wakeUp、unWakeUp、env 等关键流程和核心数据的打印。

### 📒 文档

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

### ❤️ 感谢

- @shaoyi1991 补充的关于项目启动和国内配置 docker 镜像的说明。 https://github.com/idootop/mi-gpt/issues/28
- @shog86 协助调试 Azure OpenAI Service 相关的配置参数 https://github.com/idootop/mi-gpt/pull/34
- @otkHsiao 反馈 Azure OpenAI Service 配置 deployment 的问题 https://github.com/idootop/mi-gpt/pull/34#issuecomment-2156068725
- @siseboy 提供群晖 docker 使用教程 https://github.com/idootop/mi-gpt/issues/41
- @moffefei 提供的 Windows 下 docker 启动命令的示例 https://github.com/idootop/mi-gpt/issues/45
- @imhsz 协助调试 MIoT 和 Mina 接口查询到的设备名称不一致的问题。https://github.com/idootop/mi-gpt/issues/62

## v3.0.1

- 修复 README 配置参数表格样式

## v3.0.0

### ✨ 新功能 & 优化

- 新增 `streamResponse` 流式响应控制开关，确保小爱的回复是完整的句子（[issue#20](https://github.com/idootop/mi-gpt/issues/20)）
- 添加其他 LLM 的配置教程（比如通义千问，moonshot 等）（[issue#11](https://github.com/idootop/mi-gpt/issues/11)）
- 添加对支持小爱音箱型号的说明（[issue#14](https://github.com/idootop/mi-gpt/issues/14)）
- 优化配置文件示例和使用教程（[issue#22](https://github.com/idootop/mi-gpt/issues/22)）

### 🐛 修复

- 修复 AI 响应异常时未播放提示语/音的问题
- 修复提示音链接为空时自动播放音乐的问题

### ❤️ 感谢

- @lyddias 反馈并协助调试小米音箱 Play 增强版相关问题
- @akring 优化小米账号相关的使用提示
- @csjuXYZ 反馈 NPM 包无法正常使用的问题
- @Ruiyuan-Zhang 反馈长回复无法被终止的问题

## v2.1.2

- 修复小爱回复无法被终止的问题（[issue#5](https://github.com/idootop/mi-gpt/issues/5)）

## v2.1.1

- 修复 DB 初始化失败的问题（[issue#17](https://github.com/idootop/mi-gpt/issues/17)）
- 优化版本号读取方式（import 静态导入）

## v2.1.0

- 优化 Docker 镜像体积
- 新增 `playingCommand` 选项
- 修复小爱音箱回复戛然而止的问题（[issue#14](https://github.com/idootop/mi-gpt/issues/14)）

## v2.0.1

- 新增 ARMv7 Docker 镜像（[issue#15](https://github.com/idootop/mi-gpt/issues/15)）
- 新增 debug 开关，用于调试（[issue#14](https://github.com/idootop/mi-gpt/issues/14)）

## v2.0.0

### 🚨 Breaking changes

- `callAIPrefix` 更名为 `callAIKeywords`
- `wakeUpKeywords`、`exitKeywords` 匹配规则由包含(includes)变更为起始(startsWith)

### ✨ 新功能 & 优化

- 支持 Microsoft Azure OpenAI（[#7](https://github.com/idootop/mi-gpt/issues/7)）
- 新增 LLM 响应完毕提示语：onAIReplied
- 优化 `.mi.example.js` 配置参数实例
- 优化唤醒模式下播放状态检测间隔，限制最低为 500 ms

### 🐛 修复

- 修复唤醒模式下 LLM 回复不发音或过短的问题（[#9](https://github.com/idootop/mi-gpt/issues/9)）
- 修复部分场景下 LLM 返回数据格式异常的问题
- 修复唤醒词配置格式，使其与原始文档行为一致（[#8](https://github.com/idootop/mi-gpt/issues/8)）

## v1.2.0

- 新增小爱音箱 TTS 与唤醒指令选项
- 更新默认模型为 gpt-4o

## v1.1.0

- 新增 Arm64 Docker 镜像
- 替换 Yarn 包管理工具为 Pnpm

## v1.0.0

- 支持人物设定
- 支持连续对话
- 支持流式响应
- 支持长短期记忆
- 支持更换音色
- 支持自定义音效和唤醒词等设置
