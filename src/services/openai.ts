import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

import { kEnvs } from "../utils/env";
import { kProxyAgent } from "./http";
import { withDefault } from "../utils/base";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

export interface ChatOptions {
  user: string;
  system?: string;
  model?: ChatCompletionCreateParamsBase["model"];
  tools?: Array<ChatCompletionTool>;
  jsonMode?: boolean;
  requestId?: string;
}

class OpenAIClient {
  private _client = new OpenAI({
    httpAgent: kProxyAgent,
    apiKey: kEnvs.OPENAI_API_KEY!,
  });

  private _abortCallbacks: Record<string, VoidFunction> = {
    // requestId: abortStreamCallback
  };

  abort(requestId: string) {
    if (this._abortCallbacks[requestId]) {
      this._abortCallbacks[requestId]();
      delete this._abortCallbacks[requestId];
    }
  }

  async chat(options: ChatOptions) {
    let {
      user,
      system,
      tools,
      jsonMode,
      requestId,
      model = kEnvs.OPENAI_MODEL ?? "gpt-3.5-turbo-0125",
    } = options;
    console.log(
      `
🔥🔥🔥 onAskAI start
🤖️ System: ${system ?? "None"}
😊 User: ${user}
`.trim()
    );
    const systemMsg: ChatCompletionMessageParam[] = system
      ? [{ role: "system", content: system }]
      : [];
    let signal: AbortSignal | undefined;
    if (requestId) {
      const controller = new AbortController();
      this._abortCallbacks[requestId] = () => controller.abort();
      signal = controller.signal;
    }
    const chatCompletion = await this._client.chat.completions
      .create(
        {
          model,
          tools,
          messages: [...systemMsg, { role: "user", content: user }],
          response_format: jsonMode ? { type: "json_object" } : undefined,
        },
        { signal }
      )
      .catch((e) => {
        console.error("❌ openai chat failed", e);
        return null;
      });
    const message = chatCompletion?.choices?.[0]?.message;
    console.log(
      `
  ✅✅✅ onAskAI end
  🤖️ Answer: ${message?.content ?? "None"}
  `.trim()
    );
    return message;
  }

  async chatStream(
    options: ChatOptions & {
      onStream?: (text: string) => void;
    }
  ) {
    let {
      user,
      system,
      tools,
      jsonMode,
      requestId,
      onStream,
      model = kEnvs.OPENAI_MODEL ?? "gpt-3.5-turbo-0125",
    } = options;
    console.log(
      `
🔥🔥🔥 onAskAI start
🤖️ System: ${system ?? "None"}
😊 User: ${user}
`.trim()
    );
    const systemMsg: ChatCompletionMessageParam[] = system
      ? [{ role: "system", content: system }]
      : [];
    const stream = await this._client.chat.completions
      .create({
        model,
        tools,
        stream: true,
        messages: [...systemMsg, { role: "user", content: user }],
        response_format: jsonMode ? { type: "json_object" } : undefined,
      })
      .catch((e) => {
        console.error("❌ openai chat failed", e);
        return null;
      });
    if (!stream) {
      return;
    }
    if (requestId) {
      this._abortCallbacks[requestId] = () => stream.controller.abort();
    }
    let content = "";
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      const aborted =
        requestId && !Object.keys(this._abortCallbacks).includes(requestId);
      if (aborted) {
        content = "";
        break;
      }
      if (text) {
        onStream?.(text);
        content += text;
      }
    }
    console.log(
      `
  ✅✅✅ onAskAI end
  🤖️ Answer: ${content ?? "None"}
  `.trim()
    );
    return withDefault(content, undefined);
  }
}

export const openai = new OpenAIClient();
