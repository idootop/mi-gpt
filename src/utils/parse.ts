/**
 * 清理掉json字符串前后的其他字符,并解码
 */
export function cleanJsonAndDecode(input: string | undefined | null) {
  if (input == undefined) return undefined;
  const pattern = /(\{[\s\S]*?"\s*:\s*[\s\S]*?})/;
  const match = input.match(pattern);

  if (!match) {
    return undefined;
  }

  return jsonDecode(match[0]);
}

export function jsonEncode(obj: any, options?: { prettier?: boolean }) {
  const { prettier } = options ?? {};
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj);
  } catch (error) {
    return undefined;
  }
}

export function jsonDecode(json: string | null | undefined) {
  if (json == undefined) return undefined;
  try {
    return JSON.parse(json!);
  } catch (error) {
    return undefined;
  }
}
