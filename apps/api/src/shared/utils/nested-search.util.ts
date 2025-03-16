/**
 * Recursively searches for a key in nested objects and arrays
 * @param obj The object or array to search through
 * @param key The key to search for
 * @returns The value of the key if found, undefined otherwise
 */
export function nestedSearch(obj: unknown, key: string): unknown {
  if (obj === null || typeof obj !== 'object') {
    return undefined;
  }

  if (!Array.isArray(obj) && key in obj) {
    return obj[key];
  }

  const values = Array.isArray(obj) ? obj : Object.values(obj);

  for (const value of values) {
    const result = nestedSearch(value, key);
    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}
