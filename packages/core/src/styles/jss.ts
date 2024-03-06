import Platform from '../Platform';
import extract from '../props/extract';
import merge from '../props/merge';
import remove from '../props/remove';
import { RbkStyle, ThemeProps } from '../types';
import clone from '../utils/clone';
import global from '../utils/global';
import { boxSizeProps, customSpacings, customStyleProps, flexAlignProps, notPxProps, spacings } from './constants';
import transform from './transform';

export { customSpacings, customStyleProps, spacings };

export default function jss(...mixin: any[]) {
  const { web, native } = Platform;

  const args = clone(mixin);
  const theme: ThemeProps = extract('theme', args).theme ?? global.theme ?? {};
  const dimensions = global.mapping.dimensions.window();

  // Extract all web styles
  const webStyle: any = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const extracted = extract('web', args);
    if (!extracted?.web) break;
    webStyle.push(extracted.web);
  }

  // Extract all native styles
  const nativeStyle: any = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const extracted = extract('native', args);
    if (!extracted?.native) break;
    nativeStyle.push(extracted.native);
  }

  if (theme.breakpoints) {
    remove(Object.keys(theme.breakpoints), args);
  }

  // Merge styles with platform specific
  const merged = merge(args, web && webStyle, native && nativeStyle);
  const styles: RbkStyle = {};

  for (const attr of Object.keys(merged)) {
    let prop: any = attr;
    let value = merged[attr];

    if (typeof value === 'undefined') {
      continue;
    }

    // Parse "&" for css. Eg.: '&:hover'
    if (prop.startsWith('&')) {
      styles[prop] = jss({ theme }, value);
      continue;
    }

    const valueTrim = `${value ?? ''}`.trim();
    const valueSplit = valueTrim.split(/\s/g).filter((item: string) => item.trim());

    // Call function with theme
    if (typeof value === 'function') {
      value = value(theme);
    }

    if (boxSizeProps.includes(prop) && value === true) {
      value = '100%';
    }

    if (customSpacings.includes(prop)) {
      prop = attr
        .replace(/^i$/, 'inset')
        .replace(/^(.)t$/, '$1Top')
        .replace(/^(.)b$/, '$1Bottom')
        .replace(/^(.)l$/, '$1Left')
        .replace(/^(.)r$/, '$1Right')
        .replace(/^(.)h$/, '$1Horizontal')
        .replace(/^(.)v$/, '$1Vertical')
        .replace(/^(.)x$/, '$1Horizontal')
        .replace(/^(.)y$/, '$1Vertical')
        .replace(/^m/, 'margin')
        .replace(/^p/, 'padding')
        .replace(/^t$/, 'top')
        .replace(/^b$/, 'bottom')
        .replace(/^l$/, 'left')
        .replace(/^r$/, 'right');

      // Theme multiplier
      if (theme.spacing && typeof value === 'number') {
        value = theme.spacing(value);
      }
    }

    // Resolve spacings "true" with "spacing" multiplier
    if (customSpacings.includes(prop) && value === true && theme.spacing) {
      value = theme.spacing(1);
    }

    if (flexAlignProps.includes(prop) && valueTrim) {
      value = parseFlexAlign(valueTrim);
    }

    // Cast unit: rem
    const remRegex = /([+-]?([0-9]*[.])?[0-9]+)rem/gi;
    if (remRegex.test(valueTrim)) {
      value = valueTrim.replace(remRegex, ($x, $1) => {
        const parsed = $x ? theme.rem($1) : 0;
        return native ? `${parsed}` : `${parsed}px`;
      });

      value = parseUnit(value);
    }

    // Resolve aliases
    prop =
      {
        w: 'width',
        h: 'height',
        maxw: 'maxWidth',
        maxh: 'maxHeight',
        minw: 'minWidth',
        minh: 'minHeight',
        lh: 'lineHeight',
        bg: 'backgroundColor',

        // Flex Container
        direction: 'flexDirection',

        // Flex Item
        grow: 'flexGrow',
        shrink: 'flexShrink',
        basis: 'flexBasis',
        align: 'alignSelf',
        justify: 'justifySelf',
      }[prop] || prop;

    if (prop === 'corners') {
      prop = 'borderRadius';
      value = (theme.shape.borderRadius ?? 0) * value;
    }

    if (prop === 'ww') {
      prop = null;

      Object.assign(styles, {
        width: value,
        minWidth: value,
        maxWidth: value,
      });
    }

    if (prop === 'hh') {
      prop = null;

      Object.assign(styles, {
        height: value,
        minHeight: value,
        maxHeight: value,
      });
    }

    if (['border', 'borderTop', 'borderBottom', 'borderLeft', 'borderRight'].includes(prop)) {
      if (value) {
        const preffix = prop;
        const types = [
          'none',
          'hidden',
          'dotted',
          'dashed',
          'solid',
          'double',
          'groove',
          'ridge',
          'inset',
          'outset',
          'initial',
          'inherit',
        ];

        const styleIndex = valueSplit.findIndex((item: string) => types.includes(item));
        const borderStyle = styleIndex >= 0 ? valueSplit.splice(styleIndex, 1).shift() : 'solid';

        const sizeIndex = valueSplit.findIndex((item: string) => /^\d\w*$/.test(item));
        const borderWidth =
          sizeIndex >= 0 ? Number(valueSplit.splice(sizeIndex, 1).shift()?.replace(/\D/g, '') ?? 1) : 1;

        const color = valueSplit?.shift()?.replace(/undefined|null|false|true/g, '');
        const borderColor = theme.color(color || theme.colors.common.black);

        Object.assign(styles, {
          [`${preffix}Width`]: borderWidth,
          [`${preffix}Style`]: borderStyle,
          [`${preffix}Color`]: borderColor,
        });
      }

      prop = null;
    }

    if (prop === 'shadow') {
      prop = null;

      if (value) {
        const radius = Math.round(value * 1.5 + 2);
        const offset = Math.round(value / 2);

        if (web) {
          Object.assign(styles, {
            boxShadow: `${offset}px ${offset}px ${radius}px rgba(0, 0, 0, 0.15)`,
          });
        }

        if (native) {
          Object.assign(styles, {
            elevation: offset,
            shadowColor: 'rgba(0, 0, 0)',
            shadowOpacity: 0.1,
            shadowRadius: radius,
            shadowOffset: {
              width: offset,
              height: offset,
            },
          });
        }
      }
    }

    if (web) {
      if (prop === 'paddingVertical') {
        prop = 'paddingBlock';
      }

      if (prop === 'paddingHorizontal') {
        prop = 'paddingInline';
      }

      if (prop === 'marginVertical') {
        prop = 'marginBlock';
      }

      if (prop === 'marginHorizontal') {
        prop = 'marginInline';
      }

      if (prop === 'transform' && Array.isArray(value)) {
        const values: string[] = [];

        value.forEach((item) => {
          for (const attr in item) {
            let unit = Array.isArray(item[attr]) ? item[attr].join(', ') : item[attr];

            // @ts-expect-error
            if (unit && typeof unit === 'number' && !notPxProps.includes(attr)) {
              unit = `${unit}px`;
            }

            values.push(`${attr}(${unit})`);
          }
        });

        value = values.join(' ');
      }
    }

    if (native) {
      if (prop === 'paddingBlock') {
        prop = 'paddingVertical';
      }

      if (prop === 'paddingInline') {
        prop = 'paddingHorizontal';
      }

      if (prop === 'marginBlock') {
        prop = 'marginVertical';
      }

      if (prop === 'marginInline') {
        prop = 'marginHorizontal';
      }

      if (prop === 'transform' && typeof value === 'string') {
        value = transform(value);
      }

      // Cast unit: vw
      const vwRegex = /([+-]?([0-9]*[.])?[0-9]+)vw/gi;
      if (vwRegex.test(valueTrim)) {
        value = valueTrim.replace(vwRegex, ($x, $1) => {
          return `${$x ? (dimensions.width * $1) / 100 : 0}`;
        });

        value = parseUnit(value);
      }

      // Cast unit: vh
      const vhRegex = /([+-]?([0-9]*[.])?[0-9]+)vh/gi;
      if (vhRegex.test(valueTrim)) {
        value = valueTrim.replace(vhRegex, ($x, $1) => {
          return `${$x ? (dimensions.height * $1) / 100 : 0}`;
        });

        value = parseUnit(value);
      }

      if (prop === 'inset') {
        const [v1, v2, v3, v4] = valueSplit;

        prop = null;

        Object.assign(styles, {
          top: parseUnit(v1),
          right: parseUnit(v2 ?? v1),
          bottom: parseUnit(v3 ?? v1),
          left: parseUnit(v4 ?? v2 ?? v1),
        });
      }

      ['padding', 'margin'].forEach((prefix) => {
        if (prop === prefix) {
          const [v1, v2, v3, v4] = valueSplit;

          if (valueSplit.length > 1) {
            prop = null;

            Object.assign(styles, {
              [`${prefix}Top`]: parseUnit(v1),
              [`${prefix}Right`]: parseUnit(v2 ?? v1),
              [`${prefix}Bottom`]: parseUnit(v3 ?? v1),
              [`${prefix}Left`]: parseUnit(v4 ?? v2 ?? v1),
            });
          }
        }
      });

      // place-* props
      ['Content', 'Items', 'Self'].forEach((suffix) => {
        if (prop === 'place' + suffix) {
          prop = null;

          const [v1, v2] = valueSplit;

          Object.assign(styles, {
            [`align${suffix}`]: parseFlexAlign(v1),
            [`justify${suffix}`]: parseFlexAlign(v2 ?? v1),
          });
        }
      });

      if (prop === 'boxShadow') {
        prop = null;

        const colorIndex = value.search(/(\w+\(|#).+/g);

        let color = 'rgba(0, 0, 0, 0)';

        if (colorIndex >= 0) {
          color = value.substring(colorIndex);
          value = value.substring(0, colorIndex);
        }

        const split = value.split(' ').filter((item: any) => item.trim() && !item.includes('inset'));
        const [width, height, shadowRadius] = split.map((item: string) => Number(item.replace(/\D/g, '') || 0));

        Object.assign(styles, {
          shadowColor: color,
          shadowOpacity: 0.18,
          shadowRadius,
          shadowOffset: { height, width },
        });
      }
    }

    if (prop) {
      if (`${prop || ''}`.toLowerCase().includes('color')) {
        value = theme.color(value) ?? value;
      }

      styles[prop] = value;
    }
  }

  return styles;
}

const parseUnit = (value: any) => {
  return isNaN(value) ? value : Number(value);
};

const parseFlexAlign = (value: string) => {
  return value
    .replace(/^normal$/, 'stretch')
    .replace(/^start$/, 'flex-start')
    .replace(/^end$/, 'flex-end')
    .replace(/^space$/, 'space-between')
    .replace(/^between$/, 'space-between')
    .replace(/^around$/, 'space-around')
    .replace(/^evenly$/, 'space-evenly');
};
