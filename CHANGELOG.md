# v2.1.1

- 修复 DB 初始化失败的问题
- 优化版本号读取方式（import）

# v2.1.0

- 优化 Docker 镜像体积
- 新增 `playingCommand` 选项
- 修复小爱音箱回复戛然而止的问题（[issue#14](https://github.com/idootop/mi-gpt/issues/14)）

# v2.0.1

- 新增 ARMv7 Docker 镜像
- 新增 debug 开关，用于调试 [issue#14](https://github.com/idootop/mi-gpt/issues/14)

# v2.0.0

## 🚨 Breaking changes

- `callAIPrefix` 更名为 `callAIKeywords`
- `wakeUpKeywords`、`exitKeywords` 匹配规则由包含(includes)变更为起始(startsWith)

## ✨ 新功能 & 优化

- 支持 Microsoft Azure OpenAI（[#7](https://github.com/idootop/mi-gpt/issues/7)）
- 新增 LLM 响应完毕提示语：onAIReplied
- 优化 `.mi.example.js` 配置参数实例
- 优化唤醒模式下播放状态检测间隔，限制最低为 500 ms

## 🐛 修复

- 修复唤醒模式下 LLM 回复不发音或过短的问题（[#9](https://github.com/idootop/mi-gpt/issues/9)）
- 修复部分场景下 LLM 返回数据格式异常的问题
- 修复唤醒词配置格式，使其与原始文档行为一致（[#8](https://github.com/idootop/mi-gpt/issues/8)）

# v1.2.0

- 新增小爱音箱 TTS 与唤醒指令选项
- 更新默认模型为 gpt-4o

# v1.1.0

- 新增 Arm64 Docker 镜像
- 替换 Yarn 包管理工具为 Pnpm

# v1.0.0

- 支持人物设定
- 支持连续对话
- 支持流式响应
- 支持长短期记忆
- 支持更换音色
- 支持自定义音效和唤醒词等设置
