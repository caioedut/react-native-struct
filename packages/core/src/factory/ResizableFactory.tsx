import React, { forwardRef, useRef } from 'react';

import rect from '../element/rect';
import setNativeStyle from '../element/setNativeStyle';
import useDefaultRef from '../hooks/useDefaultRef';
import useResponder from '../hooks/useResponder';
import useTheme from '../hooks/useTheme';
import Resize from '../icons/Resize';
import factory2 from '../props/factory2';
import { ResizableProps } from '../types';
import global from '../utils/global';
import BoxFactory from './BoxFactory';

const ResizableFactory = React.memo<ResizableProps>(
  forwardRef(({ children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Resizable;
    const { web, svg } = global.mapping;

    // Extends from default props
    let {
      horizontal,
      vertical,
      // Styles
      variants,
      style,
      ...rest
    } = factory2<ResizableProps>(props, options);

    const both = (horizontal && vertical) || (typeof horizontal === 'undefined' && typeof vertical === 'undefined');
    horizontal = horizontal ?? both;
    vertical = vertical ?? both;

    const { setResponder, releaseResponder } = useResponder();

    const rootRef = useDefaultRef<any>(ref);
    const metricsRef = useRef<any>();
    const initEventRef = useRef<any>();
    const maskRef = useRef<any>();

    style = [
      web && horizontal && { resize: 'horizontal' },
      web && vertical && { resize: 'vertical' },
      web && both && { resize: 'both' },

      style,
    ];

    return (
      <BoxFactory ref={rootRef} style={style} variants={{ root: variants.root }} {...rest}>
        {children}

        <BoxFactory
          position="absolute"
          alignItems="end"
          justifyContent="end"
          r={0}
          b={0}
          h={24}
          w={24}
          platform={{
            native: {
              onStartShouldSetResponder: () => true,
              onResponderGrant: () => {
                setNativeStyle(maskRef.current, { opacity: 1 });

                setResponder({
                  onStartShouldSetResponder: () => true,
                  onMoveShouldSetResponder: () => true,
                  onResponderGrant: async ({ nativeEvent }) => {
                    initEventRef.current = nativeEvent;
                    metricsRef.current = await rect(rootRef.current);
                  },
                  onResponderMove: ({ nativeEvent }) => {
                    if (!metricsRef.current) return;

                    if (horizontal) {
                      setNativeStyle(rootRef.current, {
                        width: metricsRef.current.width + (nativeEvent.pageX - initEventRef.current.pageX),
                      });
                    }

                    if (vertical) {
                      setNativeStyle(rootRef.current, {
                        height: metricsRef.current.height + (nativeEvent.pageY - initEventRef.current.pageY),
                      });
                    }
                  },
                  onResponderRelease: () => {
                    setNativeStyle(maskRef.current, { opacity: 0 });
                    metricsRef.current = null;
                    initEventRef.current = null;
                    releaseResponder();
                  },
                  onResponderTerminate: () => {
                    setNativeStyle(maskRef.current, { opacity: 0 });
                    metricsRef.current = null;
                    initEventRef.current = null;
                    releaseResponder();
                  },
                });
              },
            },
          }}
        >
          <Resize svg={svg} color={theme.color('text')} />
        </BoxFactory>

        <BoxFactory ref={maskRef} position="absolute" bg="blue.main.15" i={0} opacity={0} pointerEvents="none" />
      </BoxFactory>
    );
  }),
);

ResizableFactory.displayName = 'ResizableFactory';

export default ResizableFactory;
