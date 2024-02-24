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
   * 默认值：200，(0 为立即响应)
   */
  firstSubmitTimeout?: number;
  /**
   * 批量提交响应句子的收集时长（单位：毫秒）
   *
   * 例子：1000ms => 收集每隔 1s 内收到的文本，作为一次 Response
   *
   * 默认值：1s，(0 为立即提交)
   */
  batchSubmitTimeout?: number;
}

export class StreamResponse {
  // 将已有的大篇文字回复 chuck 成 stream 回复
  static createStreamResponse(text: string, options?: StreamResponseOptions) {
    const { maxSentenceLength = 100 } = options ?? {};
    if (text.length > maxSentenceLength) {
      const stream = new StreamResponse(options);
      stream.addResponse(text);
      stream.finish();
      return stream;
    }
  }

  maxSentenceLength: number;
  firstSubmitTimeout: number;
  batchSubmitTimeout: number;
  constructor(options?: StreamResponseOptions) {
    const {
      maxSentenceLength = 100,
      firstSubmitTimeout = 200,
      batchSubmitTimeout = 1000,
    } = options ?? {};
    this.maxSentenceLength = maxSentenceLength;
    this.firstSubmitTimeout = firstSubmitTimeout;
    this.batchSubmitTimeout = batchSubmitTimeout;
  }

  status: ResponseStatus = "responding";

  cancel() {
    if (["idle", "responding"].includes(this.status)) {
      this.status = "canceled";
    }
    return this.status === "canceled";
  }

  addResponse(text: string) {
    if (this.status === "idle") {
      this.status = "responding";
    }
    if (this.status !== "responding") {
      return;
    }
    this._batchSubmit(text);
  }

  private _nextChunkIdx = 0;
  getNextResponse() {
    const nextSentence = this._chunks[this._nextChunkIdx];
    if (nextSentence) {
      this._nextChunkIdx++;
    }
    const noMore =
      this._nextChunkIdx > this._chunks.length - 1 &&
      ["finished", "canceled"].includes(this.status);
    return { nextSentence, noMore };
  }

  finish() {
    if (["idle", "responding"].includes(this.status)) {
      if (this._tempText) {
        // 提交暂存的文本
        this._addResponse(this._tempText);
        this._tempText = "";
      }
      if (this._remainingText) {
        // 提交完整句子
        this._chunks.push(this._remainingText);
        this._remainingText = "";
      }
      this.status = "finished";
    }
    return this.status === "finished";
  }

  private _chunks: string[] = [];
  private _tempText = "";
  private _remainingText: string = "";
  private _preSubmitTimestamp = 0;

  /**
   * 批量收集/提交收到的文字响应
   *
   * 主要用途是使收到的 AI stream 回答的句子长度适中（不过长/短）。
   */
  private _batchSubmit(text: string, immediately?: boolean) {
    this._tempText += text;
    const submitImmediately = () => {
      if (this._tempText) {
        this._addResponse(this._tempText);
        this._tempText = "";
      }
      this._preSubmitTimestamp = Date.now();
    };
    immediately =
      immediately ??
      (this.firstSubmitTimeout < 100 || this.batchSubmitTimeout < 100);
    if (immediately) {
      return submitImmediately();
    }
    const isFirstSubmit = this._preSubmitTimestamp === 0;
    const batchSubmit = (timeout: number) => {
      // 当消息长度积攒到一定长度，或达到一定时间间隔后，批量提交消息
      if (
        Date.now() - this._preSubmitTimestamp > timeout ||
        this._tempText.length > this.maxSentenceLength
      ) {
        submitImmediately();
      }
    };
    const submit = (timeout: number) => {
      batchSubmit(timeout);
      setTimeout(() => {
        batchSubmit(timeout);
      }, timeout);
    };
    if (isFirstSubmit) {
      this._preSubmitTimestamp = Date.now();
      submit(this.firstSubmitTimeout);
    } else {
      submit(this.batchSubmitTimeout);
    }
  }

  private _addResponse(text: string) {
    this._remainingText += text;
    while (this._remainingText.length > 0) {
      let lastCutIndex = this._findLastCutIndex(this._remainingText);
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
    const punctuations = "，。？！：；……,.?!:;…";
    let lastCutIndex = -1;
    for (let i = 0; i < Math.min(text.length, this.maxSentenceLength); i++) {
      if (punctuations.includes(text[i])) {
        lastCutIndex = i + 1;
      }
    }
    return lastCutIndex;
  }
}

const stream = new StreamResponse();

// ai onNewText
// {
//   onNewText(text:string){
//     if(stream.status==='canceled'){
//       return 'canceled';
//     }
//     if(finished){
//       stream.finish()
//     }else{
//       stream.addResponse(text)
//     }
//   }
// }
