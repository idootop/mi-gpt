export function isNaN(e: unknown): boolean {
  return Number.isNaN(e);
}

export function isNull(e: unknown): boolean {
  return e === null;
}

export function isUndefined(e: unknown): boolean {
  return e === undefined;
}

export function isNullish(e: unknown): boolean {
  return e === null || e === undefined;
}

export function isNotNullish(e: unknown): boolean {
  return !isNullish(e);
}

export function isNumber(e: unknown): boolean {
  return typeof e === 'number' && !isNaN(e);
}

export function isString(e: unknown): boolean {
  return typeof e === 'string';
}

export function isArray(e: unknown): boolean {
  return Array.isArray(e);
}

export function isObject(e: unknown): boolean {
  return typeof e === 'object' && isNotNullish(e);
}

export function isEmpty(e: any): boolean {
  if (e?.size ?? 0 > 0) return false;
  return (
    isNaN(e) ||
    isNullish(e) ||
    (isString(e) && (e.length < 1 || !/\S/.test(e))) ||
    (isArray(e) && e.length < 1) ||
    (isObject(e) && Object.keys(e).length < 1)
  );
}

export function isNotEmpty(e: unknown): boolean {
  return !isEmpty(e);
}

export function isStringNumber(e: any): boolean {
  return isString(e) && isNotEmpty(e) && !isNaN(Number(e));
}

export function isFunction(e: unknown): boolean {
  return typeof e === 'function';
}

export function isClass(e: any): boolean {
  return isFunction(e) && e.toString().startsWith('class ');
}
