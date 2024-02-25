import { assert } from "console";
import {
  MiServiceConfig,
  getMiIOT,
  getMiNA,
  MiNA,
  MiIOT,
} from "mi-service-lite";
import { sleep } from "../../utils/base";
import { Http } from "../http";
import { StreamResponse } from "./stream";

export type TTSProvider = "xiaoai" | "doubao";

type Speaker = {
  name: string;
  gender: "男" | "女";
  speaker: string;
};

export type BaseSpeakerConfig = MiServiceConfig & {
  // 语音合成服务商
  tts?: TTSProvider;
  // 检测间隔（单位毫秒，默认 100 毫秒）
  interval?: number;
};

export class BaseSpeaker {
  MiNA?: MiNA;
  MiIOT?: MiIOT;

  interval: number;
  tts: TTSProvider;
  config: MiServiceConfig;
  constructor(config: BaseSpeakerConfig) {
    this.config = config;
    const { interval = 100, tts = "doubao" } = config;
    this.interval = interval;
    this.tts = tts;
  }

  async initMiServices() {
    this.MiNA = await getMiNA(this.config);
    this.MiIOT = await getMiIOT(this.config);
    assert(!!this.MiNA && !!this.MiIOT, "❌ init Mi Services failed");
  }

  wakeUp() {
    return this.MiIOT!.doAction(5, 3);
  }

  async unWakeUp() {
    // 通过 TTS 不发音文本，使小爱退出唤醒状态
    await this.MiIOT!.doAction(5, 1, "¿ʞо ∩оʎ ǝɹɐ"); // are you ok?
  }

  responding = false;
  async response(options: {
    tts?: TTSProvider;
    text?: string;
    stream?: StreamResponse;
    audio?: string;
    speaker?: string;
    keepAlive?: boolean;
    playSFX?: boolean;
  }) {
    let {
      text,
      audio,
      stream,
      playSFX = true,
      keepAlive = false,
      tts = this.tts,
    } = options ?? {};

    const ttsNotXiaoai = (!!stream || !!text) && !audio && tts !== "xiaoai";
    playSFX = ttsNotXiaoai && playSFX;

    if (ttsNotXiaoai && !stream) {
      // 长文本 TTS 转化成 stream 分段模式
      stream = StreamResponse.createStreamResponse(text!);
    }

    let res;
    this.responding = true;
    // 开始响应
    if (stream) {
      let _response = "";
      while (true) {
        const { nextSentence, noMore } = stream.getNextResponse();
        if (nextSentence) {
          if (_response.length < 1) {
            // 播放开始提示音
            if (playSFX) {
              await this.MiNA!.play({ url: process.env.AUDIO_BEEP });
            }
            // 在播放 TTS 语音之前，先取消小爱音箱的唤醒状态，防止将 TTS 语音识别成用户指令
            if (ttsNotXiaoai) {
              await this.unWakeUp();
            }
          }
          res = await this._response({
            ...options,
            text: nextSentence,
            playSFX: false,
            keepAlive: false,
          });
          if (res === "break") {
            // 终止回复
            stream.cancel();
            break;
          }
          _response += nextSentence;
        }
        if (noMore) {
          if (_response.length > 0) {
            // 播放结束提示音
            if (playSFX) {
              await this.MiNA!.play({ url: process.env.AUDIO_BEEP });
            }
          }
          // 保持唤醒状态
          if (keepAlive) {
            await this.wakeUp();
          }
          // 播放完毕
          break;
        }
        await sleep(this.interval);
      }
    } else {
      res = await this._response(options);
    }
    this.responding = false;
    return res;
  }

  private async _response(options: {
    tts?: TTSProvider;
    text?: string;
    stream?: StreamResponse;
    audio?: string;
    speaker?: string;
    keepAlive?: boolean;
    playSFX?: boolean;
  }) {
    let {
      text,
      audio,
      stream,
      playSFX = true,
      keepAlive = false,
      tts = this.tts,
      speaker = this._defaultSpeaker,
    } = options ?? {};

    const ttsText = text?.replace(/\n\s*\n/g, "\n")?.trim();
    const ttsNotXiaoai = !stream && !!text && !audio && tts !== "xiaoai";
    playSFX = ttsNotXiaoai && playSFX;

    // 播放回复
    const play = async (args?: { tts?: string; url?: string }) => {
      // 播放开始提示音
      if (playSFX) {
        await this.MiNA!.play({ url: process.env.AUDIO_BEEP });
      }
      // 在播放 TTS 语音之前，先取消小爱音箱的唤醒状态，防止将 TTS 语音识别成用户指令
      if (ttsNotXiaoai) {
        await this.unWakeUp();
      }
      await this.MiNA!.play(args);
      console.log("✅ " + ttsText ?? audio);
      // 等待回答播放完毕
      while (true) {
        const res = await this.MiNA!.getStatus();
        if (
          !this.responding || // 有新消息
          (res?.status === "playing" && res?.media_type) // 小爱自己开始播放音乐
        ) {
          // 响应被中断
          return "break";
        }
        if (res?.status && res.status !== "playing") {
          break;
        }
        await sleep(this.interval);
      }
      // 播放结束提示音
      if (playSFX) {
        await this.MiNA!.play({ url: process.env.AUDIO_BEEP });
      }
      // 保持唤醒状态
      if (keepAlive) {
        await this.wakeUp();
      }
    };

    // 开始响应
    let res;
    if (audio) {
      // 音频回复
      res = await play({ url: audio });
    } else if (ttsText) {
      // 文字回复
      switch (tts) {
        case "doubao":
          const _text = encodeURIComponent(ttsText);
          const doubaoTTS = process.env.TTS_DOUBAO;
          const url = `${doubaoTTS}?speaker=${speaker}&text=${_text}`;
          res = await play({ url });
          break;
        case "xiaoai":
        default:
          res = await play({ tts: ttsText });
          break;
      }
    }
    return res;
  }

  private _doubaoSpeakers?: Speaker[];
  private _defaultSpeaker = "zh_female_maomao_conversation_wvae_bigtts";
  async switchDefaultSpeaker(speaker: string) {
    if (!this._doubaoSpeakers) {
      const doubaoSpeakers = process.env.SPEAKERS_DOUBAO;
      const res = await Http.get(doubaoSpeakers ?? "/");
      if (Array.isArray(res)) {
        this._doubaoSpeakers = res;
      }
    }
    if (!this._doubaoSpeakers) {
      return false;
    }
    const target = this._doubaoSpeakers.find(
      (e) => e.name === speaker || e.speaker === speaker
    );
    if (target) {
      this._defaultSpeaker = target.speaker;
    }
    return this._defaultSpeaker === target?.speaker;
  }
}
