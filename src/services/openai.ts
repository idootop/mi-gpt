import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

import { kEnvs } from "../utils/env";

const client = new OpenAI({
  apiKey: kEnvs.OPENAI_API_KEY!,
});

export const openai = {
  async chat(options: {
    user: string;
    system?: string;
    tools?: Array<ChatCompletionTool>;
    jsonMode?: boolean;
  }) {
    const systemMsg: ChatCompletionMessageParam[] = options.system
      ? [{ role: "system", content: options.system }]
      : [];
    const chatCompletion = await client.chat.completions
      .create({
        tools: options.tools,
        messages: [...systemMsg, { role: "user", content: options.user }],
        model: kEnvs.OPENAI_MODEL ?? "gpt-3.5-turbo-1106",
        response_format: options.jsonMode ? { type: "json_object" } : undefined,
      })
      .catch((e) => {
        console.error("❌ openai chat failed", e);
        return null;
      });
    return chatCompletion?.choices?.[0]?.message;
  },
};
