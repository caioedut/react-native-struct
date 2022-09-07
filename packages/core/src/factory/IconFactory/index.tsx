import React from 'react';

import { useTheme } from '../../ReactBulk';
import factory from '../../props/factory';
import { FactoryProps, IconProps } from '../../types';
import useStylist from '../../useStylist';
import BoxFactory from '../BoxFactory';

function IconFactory({ stylist, map, ...props }: FactoryProps & IconProps, ref: any) {
  const theme = useTheme();
  const options = theme.components.Icon;
  const { Icons } = map;

  // Extends from default props
  let { color, name, size, ...rest } = factory(props, options.defaultProps);

  const iconName = `${name || ''}`
    .split(/_|-|\s/g)
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join('');

  const Component = Icons[iconName] ?? Icons.Question;

  size = size ?? theme.rem(theme.typography.lineHeight);

  const styleRoot = useStylist({
    name: options.name,
    style: options.defaultStyles.root,
  });

  return (
    <BoxFactory ref={ref} map={map} component={Component} stylist={[styleRoot, stylist]} color={theme.color(color)} size={size} {...rest} />
  );
}

export default React.forwardRef(IconFactory);
