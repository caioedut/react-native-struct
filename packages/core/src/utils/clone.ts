export default function clone(mixin: Object | Array<any>) {
  const result = Array.isArray(mixin) ? [] : {};

  for (const key in mixin) {
    let value = mixin[key];

    if (value && typeof value === 'object') {
      value = clone(value);
    }

    result[key] = value;
  }

  return result;
}
