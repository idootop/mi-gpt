# 💎 工作原理

本项目主要依赖小米 IoT 生态开放的接口能力，以下为核心运行流程：


- 使用 [MIoT](https://iot.mi.com/) 和 MiNA 开放接口控制小爱音箱（播放、暂停、唤醒等）
- 轮询设备对话列表，获取用户的最新对话消息，然后调用 AI 获取回复
- 调用豆包等 TTS 接口合成不同音色的语音回复，然后使用小爱音箱播放音频

更多运行细节和实现原理，可以查看该 [issue](https://github.com/idootop/mi-gpt/issues/28#issuecomment-2151556370) 或者自行查阅源码。

## 🐛 已知缺陷

通过调用小米 IoT 生态开放接口的方案，无法完美实现在 AI 回复时让原来的小爱闭嘴：

- 存在网络延迟
- 有一定的轮询间隔
- 小爱音箱，小米服务云端，`MiGPT` 三者之间的响应延迟

因此，在唤醒模式下 `MiGPT` 会通过播放静音音频等方式让小爱闭嘴，达到“曲线救国”的目的，比如：

```js
export const kAreYouOK = "¿ʞо ∩оʎ ǝɹɐ"; // are you ok?
```

理论上，此问题需要通过刷机（不在此项目的范畴内）才能完美解决，可以参考下面的相关讨论：

- https://github.com/yihong0618/xiaogpt/issues/515#issuecomment-2121602572
- https://github.com/idootop/mi-gpt/issues/21#issuecomment-2147125219
- https://github.com/jialeicui/open-lx01