import { RbkTheme, RbkUnitPixelable } from '@react-bulk/core';

export default function toPx(value: RbkUnitPixelable, theme: RbkTheme): number | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }

  let newValue: number | string = value;

  if (typeof value === 'string') {
    if (value.endsWith('px')) {
      newValue = Number(value.slice(0, -2));
    }

    if (value.endsWith('rem')) {
      newValue = theme.rem(Number(value.slice(0, -3)));
    }

    if (value.endsWith('gap')) {
      newValue = theme.spacing(Number(value.slice(0, -3)) * theme.shape.gap);
    }

    // TODO: vw & vh
  }

  return Number(newValue);
}
