import { isEmpty } from "./is";

export function timestamp() {
  return new Date().getTime();
}

export async function delay(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

export function println(...v: any[]) {
  console.log(...v);
}

export function printJson(obj: any) {
  console.log(JSON.stringify(obj, undefined, 4));
}

export function firstOf<T = any>(datas?: T[]) {
  return datas ? (datas.length < 1 ? undefined : datas[0]) : undefined;
}

export function lastOf<T = any>(datas?: T[]) {
  return datas
    ? datas.length < 1
      ? undefined
      : datas[datas.length - 1]
    : undefined;
}

export function randomInt(min: number, max?: number) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function pickOne<T = any>(datas: T[]) {
  return datas.length < 1 ? undefined : datas[randomInt(datas.length - 1)];
}

export function range(start: number, end?: number) {
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from({ length: end - start }, (_, index) => start + index);
}

export function clamp(num: number, min: number, max: number): number {
  return num < max ? (num > min ? num : min) : max;
}

export function toInt(str: string) {
  return parseInt(str, 10);
}

export function toDouble(str: string) {
  return parseFloat(str);
}

export function toFixed(n: number, fractionDigits = 2) {
  let s = n.toFixed(fractionDigits);
  while (s[s.length - 1] === "0") {
    s = s.substring(0, s.length - 1);
  }
  if (s[s.length - 1] === ".") {
    s = s.substring(0, s.length - 1);
  }
  return s;
}

export function toSet<T = any>(datas: T[], byKey?: (e: T) => any) {
  if (byKey) {
    const keys: any = {};
    const newDatas: T[] = [];
    datas.forEach((e) => {
      const key = jsonEncode({ key: byKey(e) }) as any;
      if (!keys[key]) {
        newDatas.push(e);
        keys[key] = true;
      }
    });
    return newDatas;
  }
  return Array.from(new Set(datas));
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

export function withDefault<T = any>(e: any, defaultValue: T): T {
  return isEmpty(e) ? defaultValue : e;
}

export function removeEmpty<T = any>(data: T): T {
  if (Array.isArray(data)) {
    return data.filter((e) => e != undefined) as any;
  }
  const res = {} as any;
  for (const key in data) {
    if (data[key] != undefined) {
      res[key] = data[key];
    }
  }
  return res;
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    const copy: any[] = [];
    obj.forEach((item, index) => {
      copy[index] = deepClone(item);
    });
    return copy as unknown as T;
  }
  const copy = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (copy as any)[key] = deepClone((obj as any)[key]);
    }
  }
  return copy;
};
