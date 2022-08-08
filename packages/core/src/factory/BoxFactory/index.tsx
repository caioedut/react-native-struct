import React from 'react';

import { useTheme } from '@react-bulk/core';

import createStyle from '../../createStyle';
import bindings from '../../props/bindings';
import get from '../../props/get';
import merge from '../../props/merge';
import { customStyleProps } from '../../styles/jss';
import { BoxProps } from '../../types';
import clsx from '../../utils/clsx';

function BoxFactory(
  {
    component,
    block,
    hidden,
    flexbox,
    direction,
    row,
    column,
    reverse,
    wrap,
    noWrap,
    flow,
    justifyContent,
    alignContent,
    justifyItems,
    alignItems,
    center,
    flex,
    order,
    grow,
    shrink,
    basis,
    align,
    justify,
    platform,
    className,
    style,
    rawStyle,
    children,
    map,
    ...props
  }: BoxProps | any,
  ref,
) {
  const theme = useTheme();
  const { web, native, dimensions, Text, View } = map;
  const classes: any[] = [className];

  style = [
    { position: 'relative' },

    block && {
      marginLeft: 0,
      marginRight: 0,
      width: '100%',
    },

    web && block && { display: 'block' },

    // Flex Container
    flexbox && {
      display: `${typeof flexbox === 'boolean' ? 'flex' : flexbox}`,
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 0,
      flexShrink: 1,
      alignContent: 'stretch',
    },

    direction && { flexDirection: direction },
    row && { flexDirection: reverse ? 'row-reverse' : 'row' },
    column && { flexDirection: reverse ? 'column-reverse' : 'column' },
    flow && { flexFlow: flow },

    wrap && typeof wrap !== 'boolean' && { flexWrap: wrap },
    typeof wrap === 'boolean' && { flexWrap: wrap ? 'wrap' : 'nowrap' },
    noWrap && { flexWrap: 'nowrap' },

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

    // Flex Item
    flex && { flex: 1 },
    order && { order },
    grow && { grow },
    shrink && { shrink },
    basis && { basis },
    align && { alignSelf: align },
    justify && { justifySelf: justify },

    style,

    native && rawStyle,

    hidden && { display: 'none !important' },
  ];

  const hasFlex = ['flexDirection', 'flexWrap', 'flexFlow', 'justifyContent', 'justifyItems', 'alignContent', 'alignItems'].some((prop) =>
    get(prop, style),
  );

  if (hasFlex) {
    if (!get('display', style)) {
      style.push({ display: 'flex' });
    }

    if (!get('flexFlow', style)) {
      if (!get('flexDirection', style)) {
        style.push({ flexDirection: 'row' });
      }

      if (!get('flexWrap', style)) {
        style.push({ flexWrap: 'wrap' });
      }
    }
  }

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

  const processed = createStyle({ style });

  if (processed) {
    // Web: CSS Class Name
    if (typeof processed === 'string') {
      classes.push(processed);
    }

    // Native: Style Object
    if (typeof processed === 'object') {
      props.style = processed;
    }
  }

  if (web) {
    props.className = clsx(classes);
    props.style = merge(rawStyle);
  }

  // Platform specific props
  if (platform) {
    Object.keys(platform).forEach((item) => {
      if (map[item] || item === '*') {
        Object.assign(props, merge({}, platform[item]));
      }
    });
  }

  props = bindings(props);

  if ([undefined, null, false, NaN].includes(children)) {
    children = null;
  }

  if (native && children) {
    if (typeof children === 'string') {
      children = <Text>{children}</Text>;
    }

    if (Array.isArray(children)) {
      children = children.map((child) => (typeof children === 'string' ? <Text>{child}</Text> : child));
    }
  }

  const Component = component || View;

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

export default React.forwardRef(BoxFactory);
