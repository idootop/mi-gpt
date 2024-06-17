import { sleep } from "../../utils/base";
import { removeEmojis } from "../../utils/string";

type ResponseStatus = "idle" | "responding" | "finished" | "canceled";

interface StreamResponseOptions {
  /**
   * 单次响应句子的最大长度
   */
  maxSentenceLength?: number;
  /**
   * 首次响应句子的收集时长（单位：毫秒）
   *
   * 例子：100ms => 从收到第一条响应文本开始，聚合之后 100ms 内收到的文本，作为第一次 Response
   *
   * 默认值：200，(最小100)
   */
  firstSubmitTimeout?: number;
}

export class StreamResponse {
  // 将已有的大篇文字回复 chuck 成 stream 回复
  static createStreamResponse(text: string, options?: StreamResponseOptions) {
    const { maxSentenceLength = 100 } = options ?? {};
    if (text.length > maxSentenceLength) {
      const stream = new StreamResponse(options);
      stream.addResponse(text);
      stream.finish(text);
      return stream;
    }
  }

  maxSentenceLength: number;
  firstSubmitTimeout: number;
  constructor(options?: StreamResponseOptions) {
    const { maxSentenceLength = 100, firstSubmitTimeout = 200 } = options ?? {};
    this.maxSentenceLength = maxSentenceLength;
    this.firstSubmitTimeout =
      firstSubmitTimeout < 100 ? 100 : firstSubmitTimeout;
  }

  status: ResponseStatus = "responding";

  cancel() {
    if (["idle", "responding"].includes(this.status)) {
      this.status = "canceled";
    }
    return this.status === "canceled";
  }

  addResponse(_text: string) {
    if (this.status === "idle") {
      this.status = "responding";
    }
    if (this.status !== "responding") {
      return;
    }
    // 移除不发音字符（emoji）
    let text = removeEmojis(_text);
    if (!text) {
      return;
    }
    this._batchSubmit(text);
  }

  private _nextChunkIdx = 0;
  getNextResponse(): { nextSentence?: string; noMore: boolean } {
    if (this._submitCount > 0) {
      // 在请求下一条消息前，提交当前收到的所有消息
      this._batchSubmitImmediately();
    }
    const nextSentence = this._chunks[this._nextChunkIdx];
    if (nextSentence) {
      this._nextChunkIdx++;
    }
    const noMore =
      this._nextChunkIdx > this._chunks.length - 1 &&
      ["finished", "canceled"].includes(this.status);
    return { nextSentence, noMore };
  }

  private _finalResult?: string;
  finish(finalResult?: string) {
    if (["idle", "responding"].includes(this.status)) {
      this._batchSubmitImmediately();
      this._forceChunkText();
      this._finalResult = finalResult;
      this.status = "finished";
    }
    return this.status === "finished";
  }

  private _forceChunkText() {
    if (this._remainingText) {
      this._addResponse("", { force: true });
    }
  }

  async getFinalResult() {
    while (true) {
      if (this.status === "finished") {
        return this._finalResult;
      } else if (this.status === "canceled") {
        return undefined;
      }
      await sleep(10);
    }
  }

  private _chunks: string[] = [];
  private _tempText = "";
  private _remainingText: string = "";
  private _isFirstSubmit = true;

  private _submitCount = 0;
  private _batchSubmitImmediately() {
    if (this._tempText) {
      this._addResponse(this._tempText);
      this._tempText = "";
      this._submitCount++;
    }
  }

  /**
   * 批量收集/提交收到的文字响应
   *
   * 主要用途是使收到的 AI stream 回答的句子长度适中（不过长/短）。
   */
  private _batchSubmit(text: string) {
    this._tempText += text;
    if (this._isFirstSubmit) {
      this._isFirstSubmit = false;
      // 达到首次消息收集时长后，批量提交消息
      setTimeout(() => {
        if (this._submitCount < 1) {
          this._batchSubmitImmediately();
        }
      }, this.firstSubmitTimeout);
    } else if (this._submitCount < 1) {
      // 当首次消息积攒到一定长度后，也批量提交消息
      if (this._tempText.length > this.maxSentenceLength) {
        this._batchSubmitImmediately();
      }
    }
  }

  private _addResponse(text: string, options?: { force: boolean }) {
    this._remainingText += text;
    while (this._remainingText.length > 0) {
      let lastCutIndex = options?.force
        ? this.maxSentenceLength
        : this._findLastCutIndex(this._remainingText);
      if (lastCutIndex > 0) {
        const currentChunk = this._remainingText.substring(0, lastCutIndex);
        this._chunks.push(currentChunk);
        this._remainingText = this._remainingText.substring(lastCutIndex);
      } else {
        // 搜索不到
        break;
      }
    }
  }

  private _findLastCutIndex(text: string): number {
    const punctuations = "。？！；?!;";
    let lastCutIndex = -1;
    for (let i = 0; i < Math.min(text.length, this.maxSentenceLength); i++) {
      if (punctuations.includes(text[i])) {
        lastCutIndex = i + 1;
      }
    }
    return lastCutIndex;
  }
}
