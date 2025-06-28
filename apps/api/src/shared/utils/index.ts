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

/**
 * Recursively extracts all fields with specified field names from a JSON object/array and joins them into a single string
 * @param data - The JSON data to extract fields from
 * @param fieldNames - The field name(s) to extract (string or array of strings)
 * @param separator - The separator to use when joining field values (default: single space)
 * @param valueFilter - Optional function to filter/transform extracted values
 * @returns A single string containing all extracted field values
 */
export function extractFields(
  data: unknown,
  fieldNames: string | string[],
  separator = ' ',
  valueFilter?: (value: unknown, fieldName: string) => boolean
): string {
  const extractedValues: string[] = [];

  // Normalize fieldNames to array for easier processing
  const fieldsToExtract = Array.isArray(fieldNames) ? fieldNames : [fieldNames];

  function traverse(obj: unknown): void {
    if (obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      // If it's an array, traverse each element
      obj.forEach((item) => traverse(item));
    } else if (typeof obj === 'object') {
      // If it's an object, check each property
      Object.keys(obj).forEach((key) => {
        if (fieldsToExtract.includes(key)) {
          const value = obj[key];
          // Apply filter if provided, otherwise include all string values
          if (
            valueFilter ? valueFilter(value, key) : typeof value === 'string'
          ) {
            extractedValues.push(String(value));
          }
        } else {
          // Recursively traverse other properties
          traverse(obj[key]);
        }
      });
    }
  }

  traverse(data);
  return extractedValues.join(separator);
}
