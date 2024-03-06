import React, { forwardRef, useRef, useState } from 'react';

import usePropState from '../../hooks/usePropState';
import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import { TimeoutType, TooltipProps } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';
import TextFactory from '../TextFactory';

const TooltipFactory = React.memo<TooltipProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Tooltip;
    const { native, useDimensions, Button } = global.mapping;

    const dimensions = useDimensions();

    // Extends from default props
    let {
      accessibility,
      color,
      offset = native ? 2 : 1,
      position,
      title,
      visible,
      // Styles
      variants,
      style,
      ...rest
    } = factory2<TooltipProps>(props, options);

    const timeoutRef = useRef<TimeoutType>(null);

    const [shown, setShown] = usePropState(visible, false);
    const [trans, setTrans] = useState(0);

    const translate = native ? -(trans / 2) : '-50%';
    const isHorizontal = ['left', 'right'].includes(position ?? '');
    const isControlled = typeof visible === 'boolean';

    style = [shown && options?.variants?.visible?.true?.root, style];

    const handleTooltipShow = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!isControlled) {
        timeoutRef.current = setTimeout(() => {
          setShown(true);
        }, 50);
      }
    };

    const handleTooltipHide = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!isControlled) {
        setShown(false);
      }
    };

    return (
      <BoxFactory
        component={native ? Button : null}
        accessibility={{ label: title, ...Object(accessibility) }}
        style={{ position: 'relative' }}
        platform={{
          web: {
            onPointerOver: handleTooltipShow,
            onPointerOut: handleTooltipHide,
          },
          native: {
            activeOpacity: 1,
            onPressIn: handleTooltipShow,
            onPressOut: handleTooltipHide,
          },
        }}
      >
        {children}
        <BoxFactory ref={ref} style={style} stylist={[variants.root, stylist]} {...rest}>
          <TextFactory
            numberOfLines={1}
            platform={{
              native: {
                onLayout: ({ nativeEvent: { layout } }) => setTrans(isHorizontal ? layout.height : layout.width),
              },
            }}
            style={[
              {
                position: 'absolute',
                backgroundColor: color,
                borderRadius: theme.shape.borderRadius,
                color: theme.contrast(color as string),
                fontSize: '0.75rem',
                overflow: 'hidden',
                py: 1,
                px: 1.5,
                textAlign: 'center',
                maxWidth: dimensions.width,
                web: { whiteSpace: 'nowrap' },
              },

              native && !trans && { opacity: 0 },

              isHorizontal && { transform: [{ translateY: translate }] },
              !isHorizontal && { transform: [{ translateX: translate }] },

              position === 'top' && { bottom: '100%', mb: offset },
              position === 'bottom' && { top: '100%', mt: offset },
              position === 'left' && { right: '100%', mr: offset },
              position === 'right' && { left: '100%', ml: offset },
            ]}
          >
            {title}
          </TextFactory>
        </BoxFactory>
      </BoxFactory>
    );
  }),
);

TooltipFactory.displayName = 'TooltipFactory';

export default TooltipFactory;
