import { AnyObject } from '../types';

// Extract some props from objects returning them and removing it from original
export default function extract(props: string | string[], ...mixin: Object[]): AnyObject {
  let extracted = {};

  if (!Array.isArray(props)) {
    props = [props];
  }

  if (!Array.isArray(mixin)) {
    mixin = [];
  }

  for (const item of mixin) {
    if (!item) continue;

    if (Array.isArray(item)) {
      extracted = { ...extracted, ...extract(props, ...item) };
      continue;
    }

    for (const prop of props) {
      if (!(prop in item)) {
        continue;
      }

      extracted[prop] = item[prop];
      delete item[prop];
    }
  }

  return extracted;
}
