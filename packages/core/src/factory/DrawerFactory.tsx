import React, { forwardRef } from 'react';

import useTheme from '../hooks/useTheme';
import factory2 from '../props/factory2';
import { DrawerProps, RequiredSome } from '../types';
import BackdropFactory from './BackdropFactory';
import BoxFactory from './BoxFactory';

const DrawerFactory = React.memo<DrawerProps>(
  forwardRef(({ children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Drawer;

    // Extends from default props
    const {
      keepMounted,
      placement,
      visible: drawerVisible,
      onClose,
      // Styles
      variants,
      style,
      backdropStyle,
      ...rest
    } = factory2<RequiredSome<DrawerProps, 'placement'>>(props, options);

    const hiddenStyle = {
      [placement]: '-100%',
    };

    const visibleStyle = {
      [placement]: '0%',
    };

    return (
      <BackdropFactory
        visible={drawerVisible}
        keepMounted={keepMounted}
        onPress={onClose}
        style={backdropStyle}
        variants={{ root: variants.backdrop }}
      >
        <BoxFactory
          ref={ref}
          key={placement}
          {...rest}
          style={style}
          variants={{ root: variants.root }}
          animation={{
            from: drawerVisible ? hiddenStyle : visibleStyle,
            to: drawerVisible ? visibleStyle : hiddenStyle,
          }}
        >
          {children}
        </BoxFactory>
      </BackdropFactory>
    );
  }),
);

DrawerFactory.displayName = 'DrawerFactory';

export default DrawerFactory;
