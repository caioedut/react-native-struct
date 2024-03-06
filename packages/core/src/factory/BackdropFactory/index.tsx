import React, { forwardRef, useEffect, useRef } from 'react';

import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import { BackdropProps } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';

const BackdropFactory = React.memo<BackdropProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Backdrop;
    const { web, native, Button, Dialog } = global.mapping;

    // Extends from default props
    const {
      visible,
      // Events
      onPress,
      // Styles
      variants,
      containerStyle,
      ...rest
    } = factory2<BackdropProps>(props, options);

    const defaultRef = useRef(null);
    ref = ref || defaultRef;

    useEffect(() => {
      if (!web) return;

      if (visible) {
        // @ts-ignore
        setTimeout(() => ref?.current?.focus?.(), 10);

        const top = document.documentElement.scrollTop;
        const left = document.documentElement.scrollLeft;

        window.onscroll = () => window.scrollTo({ top, left, behavior: 'auto' });
      }

      return () => {
        window.onscroll = null;
      };
    }, [ref, visible]);

    const Child = (
      <BoxFactory ref={ref} stylist={[variants.root, stylist]} {...rest}>
        <BoxFactory position="absolute" i={0} zIndex={-1} style={{ cursor: 'auto' }} onPress={onPress} />
        {children}
      </BoxFactory>
    );

    return native ? (
      <Dialog
        transparent
        statusBarTranslucent
        visible={Boolean(visible)}
        animationType="fade"
        presentationStyle="overFullScreen"
      >
        {Child}
      </Dialog>
    ) : (
      <BoxFactory
        noRootStyles
        component={Dialog}
        tabIndex="-1"
        style={[
          {
            position: 'fixed',
            inset: 0,
            cursor: 'auto !important',
            opacity: 0,
            visibility: 'hidden',
            zIndex: -1,
            ...theme.mixins.transitions.medium,
            transitionProperty: 'all',
          },
          visible && {
            opacity: 1,
            visibility: 'visible',
            zIndex: theme.mixins.zIndex.backdrop,
          },
        ]}
      >
        {Child}
      </BoxFactory>
    );
  }),
);

BackdropFactory.displayName = 'BackdropFactory';

export default BackdropFactory;
