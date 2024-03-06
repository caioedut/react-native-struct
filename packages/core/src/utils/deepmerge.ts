export default function deepmerge(...mixed: any[]): (typeof mixed)[0] {
  const result = {};

  for (const item of mixed) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    for (const attr in item) {
      let value = item[attr];

      if (value && !Array.isArray(value) && typeof value === 'object') {
        value = deepmerge(result[attr], value);
      }

      result[attr] = value;
    }
  }

  return result;
}
