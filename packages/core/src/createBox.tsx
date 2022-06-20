import React from 'react';

import { useTheme } from './ReactBulk';
import createStyle from './createStyle';
import bindings from './props/bindings';
import get from './props/get';
import { customStyleProps } from './styles/jss';
import { BoxProps } from './types';
import clsx from './utils/clsx';

export default function createBox(
  {
    component,
    className,
    flexbox,
    direction,
    row,
    column,
    reverse,
    wrap,
    flow,
    justifyContent,
    alignContent,
    justifyItems,
    alignItems,
    center,
    gap,
    flex,
    order,
    grow,
    shrink,
    basis,
    align,
    justify,
    style,
    children,
    ...props
  }: BoxProps | any,
  ref: any,
  map: any,
  defaultComponent: any = null,
) {
  const theme = useTheme();

  const { web, native, dimensions, Text } = map;

  style = [
    // Flex Container
    flexbox && {
      display: `${typeof flexbox === 'boolean' ? 'flex' : flexbox}`,
      flexDirection: 'row',
    },

    direction && { flexDirection: direction },
    row && { flexDirection: reverse ? 'row-reverse' : 'row' },
    column && { flexDirection: reverse ? 'column-reverse' : 'column' },
    wrap && { flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap },
    flow && { flexFlow: flow },

    center && {
      justifyContent: 'center',
      justifyItems: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },

    justifyContent && { justifyContent },
    justifyItems && { alignItems },
    alignContent && { alignContent },
    alignItems && { alignItems },

    web && gap && { gap: theme.spacing(Number(gap)) },

    // Flex Item
    flex && { flex: 1 },
    order && { order },
    grow && { grow },
    shrink && { shrink },
    basis && { basis },
    align && { alignSelf: align },
    justify && { justifySelf: justify },

    style,
  ];

  // Custom style props
  for (const prop of customStyleProps) {
    if (prop in props) {
      style.push({ [prop]: props[prop] });
      delete props[prop];
    }
  }

  // Apply responsive styles
  for (const breakpoint of Object.entries(theme.breakpoints)) {
    const [name, minWidth]: any = breakpoint;
    const ptStyle = get(name, style);

    if (ptStyle && dimensions.width >= minWidth) {
      style.push(ptStyle);
    }
  }

  const processed = createStyle({ style: style });

  if (processed) {
    // Web: CSS Class Name
    if (typeof processed === 'string') {
      className = clsx(processed, className);
    }

    // Native: Style Object
    if (typeof processed === 'object') {
      props.style = processed;
    }
  }

  if (className) {
    props.className = clsx(className);
  }

  props = bindings(props);

  const Component = component || defaultComponent;
  const buildGap = native && gap && Array.isArray(children) && children?.length;

  if ([undefined, null, false, NaN].includes(children)) {
    children = null;
  }

  if (native && typeof children === 'string') {
    children = <Text>{children}</Text>;
  }

  return (
    <Component {...props} ref={ref}>
      {!buildGap
        ? children
        : children.filter(Boolean).map((child: any, key: number) => (
            <React.Fragment key={key}>
              {key > 0 &&
                createBox(
                  { style: { width: theme.spacing(Number(gap)), height: theme.spacing(Number(gap)) } },
                  null,
                  map,
                  defaultComponent,
                )}
              {child}
            </React.Fragment>
          ))}
    </Component>
  );
}
