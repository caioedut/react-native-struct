import React, { MutableRefObject, forwardRef, useEffect, useMemo } from 'react';

import useTheme from '../../hooks/useTheme';
import useTransition from '../../hooks/useTransition';
import factory2 from '../../props/factory2';
import { DrawerProps, RequiredSome } from '../../types';
import BackdropFactory from '../BackdropFactory';
import BoxFactory from '../BoxFactory';

const DrawerFactory = React.memo<DrawerProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Drawer;

    // Extends from default props
    const {
      placement,
      visible,
      onBackdropPress,
      // Styles
      variants,
      style,
      backdropStyle,
      ...rest
    } = factory2<RequiredSome<DrawerProps, 'placement'>>(props, options);

    const visibleStyle = useMemo(
      () => ({
        [placement]: '0%',
      }),
      [placement],
    );

    const hiddenStyle = useMemo(
      () => ({
        [placement]: '-50%',
      }),
      [placement],
    );

    const transition = useTransition(hiddenStyle, ref as MutableRefObject<any>);

    useEffect(() => {
      transition.start({
        duration: 200,
        from: visible ? hiddenStyle : visibleStyle,
        to: visible ? visibleStyle : hiddenStyle,
      });
    }, [visible, placement, hiddenStyle, visibleStyle, transition.start]);

    return (
      <BackdropFactory visible={visible} onPress={onBackdropPress} style={backdropStyle} stylist={[variants.backdrop]}>
        <BoxFactory
          key={placement}
          {...rest}
          {...transition.props}
          style={[transition.props.style, style]}
          stylist={[variants.root, stylist]}
        >
          {children}
        </BoxFactory>
      </BackdropFactory>
    );
  }),
);

DrawerFactory.displayName = 'DrawerFactory';

export default DrawerFactory;
