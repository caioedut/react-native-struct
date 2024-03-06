export default function transform(value) {
  if (typeof value === 'string') {
    value = value
      .split(/\s/g)
      .filter((item) => item.trim())
      .map((item) => {
        const match = item.match(/(.*)\((.*)\)(\[([^\]]*)\])?/);
        return { [match?.[1] as string]: match?.[2] };
      });
  }

  return value;
}
