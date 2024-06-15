import { version } from "../../package.json";

export const kVersion = version;

export const kAreYouOK = "¿ʞо ∩оʎ ǝɹɐ"; // are you ok?

export const kBannerASCII = `

/ $$      /$$ /$$   /$$$$$$  /$$$$$$$ /$$$$$$$$$
| $$$    /$$$|__/ /$$__  $$| $$__  $$|__  $$__/
| $$$$  /$$$$ /$$| $$  \\__/| $$  \\ $$   | $$   
| $$ $$/$$ $$| $$| $$ /$$$$| $$$$$$$/   | $$   
| $$  $$$| $$| $$| $$|_  $$| $$____/    | $$   
| $$\\  $ | $$| $$| $$  \\ $$| $$         | $$   
| $$ \\/  | $$| $$|  $$$$$$/| $$         | $$   
|__/     |__/|__/ \\______/ |__/         |__/                         
                                                                                                                 
         MiGPT v1.0.0  by: del.wang

`.replace("1.0.0", kVersion);

/**
 * 转北京时间：2023年12月12日星期二 12:46
 */
export function toUTC8Time(date: Date) {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    weekday: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  });
}

export function buildPrompt(
  template: string,
  variables: Record<string, string>
) {
  for (const key in variables) {
    const value = variables[key];
    template = template.replaceAll(`{{${key}}}`, value);
  }
  return template;
}

export function formatMsg(msg: {
  name: string;
  text: string;
  timestamp: number;
}) {
  const { name, text, timestamp } = msg;
  return `${toUTC8Time(new Date(timestamp))} ${name}: ${text}`;
}

export function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 移除文字中的不发音字符（emoji）
 */
export function removeEmojis(text: string) {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  return text.replace(emojiRegex, "");
}
