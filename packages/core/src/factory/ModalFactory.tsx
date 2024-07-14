import React, { forwardRef } from 'react';

import useTheme from '../hooks/useTheme';
import factory2 from '../props/factory2';
import { ModalProps } from '../types';
import BackdropFactory from './BackdropFactory';
import CardFactory from './CardFactory';

const ModalFactory = React.memo<ModalProps>(
  forwardRef(({ children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Modal;

    // Extends from default props
    const {
      keepMounted,
      animation,
      halign,
      valign,
      visible,
      onClose,
      // Styles
      variants,
      style,
      ...rest
    } = factory2<ModalProps>(props, options);

    const animStyle = {
      fade: {
        from: { opacity: 0.5 },
        to: { opacity: 1 },
      },
      'zoom-in': {
        from: { transform: { scale: 0.5 } },
        to: { transform: { scale: 1 } },
      },
      'zoom-out': {
        from: { transform: { scale: 1.5 } },
        to: { transform: { scale: 1 } },
      },
      'slide-top': {
        from: { transform: { translateY: 80 } },
        to: { transform: { translateY: 0 } },
      },
      'slide-bottom': {
        from: { transform: { translateY: -80 } },
        to: { transform: { translateY: 0 } },
      },
      'slide-left': {
        from: { transform: { translateX: 80 } },
        to: { transform: { translateX: 0 } },
      },
      'slide-right': {
        from: { transform: { translateX: -80 } },
        to: { transform: { translateX: 0 } },
      },
    }[animation ?? 'fade'];

    return (
      <BackdropFactory
        visible={visible}
        keepMounted={keepMounted}
        variants={{ root: variants.backdrop }}
        onPress={onClose}
      >
        <CardFactory
          ref={ref}
          variants={{ root: variants.root }}
          {...rest}
          animation={{
            timing: visible ? 'ease-out' : 'ease-in',
            from: visible ? animStyle.from : animStyle.to,
            to: visible ? animStyle.to : animStyle.from,
          }}
        >
          {children}
        </CardFactory>
      </BackdropFactory>
    );
  }),
);

ModalFactory.displayName = 'ModalFactory';

export default ModalFactory;
