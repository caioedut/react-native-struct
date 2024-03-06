import { AnyObject } from '../types';

export default function only(props: string | string[], ...mixin: AnyObject[]) {
  let result = {};

  if (!Array.isArray(props)) {
    props = [props];
  }

  for (const item of mixin) {
    if (!item) continue;

    if (Array.isArray(item)) {
      result = { ...result, ...only(props, ...item) };
      continue;
    }

    for (const prop of props) {
      if (prop in item) {
        result[prop] = item[prop];
      }
    }
  }

  return result;
}
