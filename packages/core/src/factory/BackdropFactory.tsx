import React, { forwardRef, useEffect, useRef } from 'react';

import createPortal from '../createPortal';
import setNativeStyle from '../element/setNativeStyle';
import pointer from '../events/pointer';
import useDefaultRef from '../hooks/useDefaultRef';
import useDeferredValue from '../hooks/useDeferredValue';
import useHtmlId from '../hooks/useHtmlId';
import useTheme from '../hooks/useTheme';
import factory2 from '../props/factory2';
import { BackdropProps } from '../types';
import global from '../utils/global';
import BoxFactory from './BoxFactory';

const BackdropFactory = React.memo<BackdropProps>(
  forwardRef(({ children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Backdrop;
    const { web, native, Dialog, BackHandler } = global.mapping;

    const portalId = useHtmlId();

    // Extends from default props
    const {
      keepMounted,
      visible,
      // Events
      onPress,
      // Styles
      variants,
      containerStyle,
      ...rest
    } = factory2<BackdropProps>(props, options);

    const rootRef = useDefaultRef<any>(ref);
    const dialogRef = useRef<any>();

    const visibleAfterAnim = useDeferredValue(visible, visible, 250);

    useEffect(() => {
      if (!web) return;

      if (visible) {
        // @ts-ignore
        setTimeout(() => rootRef.current?.focus?.(), 100);

        const top = document.documentElement.scrollTop;
        const left = document.documentElement.scrollLeft;

        window.onscroll = () => window.scrollTo({ top, left, behavior: 'auto' });
      }

      return () => {
        window.onscroll = null;
      };
    }, [rootRef, visible, web]);

    useEffect(() => {
      if (!native) return;
      if (!visible) return;
      if (typeof onPress !== 'function') return;

      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        // @ts-expect-error
        onPress?.();
        return true;
      });

      return () => {
        backHandler.remove();
      };
    }, [native, visible, onPress]);

    if (!keepMounted && !visible && !visibleAfterAnim) {
      return null;
    }

    const $el = (
      <BoxFactory
        noRootStyles
        ref={dialogRef}
        animation={{
          to: { opacity: visible ? 1 : 0 },
          onStart: () => {
            if (visible) {
              setNativeStyle(dialogRef.current, { zIndex: theme.mixins.zIndex.backdrop });
            }
          },
          onEnd: () => {
            if (!visible) {
              setNativeStyle(dialogRef.current, { zIndex: -1 });
            }
          },
        }}
        style={[
          {
            inset: 0,
            opacity: 0,
            zIndex: -1,
            pointerEvents: visible ? 'auto' : 'none',

            web: {
              position: 'fixed',
              cursor: 'auto !important',
            },

            native: {
              position: 'absolute',
            },
          },
        ]}
      >
        <BoxFactory ref={rootRef} variants={{ root: variants.root }} tabIndex={visible ? '0' : '-1'} {...rest}>
          <BoxFactory
            position="absolute"
            i={0}
            zIndex={0}
            accessibility={{
              label: 'close',
            }}
            style={{
              cursor: 'auto',
              web: { '& ~ *': { zIndex: 1 } },
            }}
            onPress={onPress}
          />
          {children}
        </BoxFactory>
      </BoxFactory>
    );

    return keepMounted ? (
      createPortal(portalId, $el)
    ) : native ? (
      <Dialog
        transparent
        hardwareAccelerated
        statusBarTranslucent
        visible={Boolean(visible)}
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={(e) => onPress?.(pointer(e))}
      >
        {$el}
      </Dialog>
    ) : (
      $el
    );
  }),
);

BackdropFactory.displayName = 'BackdropFactory';

export default BackdropFactory;
