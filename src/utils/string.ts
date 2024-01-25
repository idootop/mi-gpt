import { readJSONSync } from './io';

export const kVersion = readJSONSync('package.json').version;

export const kBannerASCII = `

/$$      /$$ /$$  /$$$$$$  /$$$$$$$  /$$$$$$$$
| $$$    /$$$|__/ /$$__  $$| $$__  $$|__  $$__/
| $$$$  /$$$$ /$$| $$  \__/| $$  \ $$   | $$   
| $$ $$/$$ $$| $$| $$ /$$$$| $$$$$$$/   | $$   
| $$  $$$| $$| $$| $$|_  $$| $$____/    | $$   
| $$\  $ | $$| $$| $$  \ $$| $$         | $$   
| $$ \/  | $$| $$|  $$$$$$/| $$         | $$   
|__/     |__/|__/ \______/ |__/         |__/                         
                                                                                                                 
      MiGPT v1.0.0  by: del-wang.eth

`.replace('1.0.0', kVersion);

/**
 * 转北京时间：2023年12月12日星期二 12:46
 */
export function toUTC8Time(date: Date) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    weekday: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai',
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
