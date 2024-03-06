import React, { forwardRef, useEffect, useMemo, useRef } from 'react';

import createStyle from '../../createStyle';
import useHtmlId from '../../hooks/useHtmlId';
import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import get from '../../props/get';
import css from '../../styles/css';
import jss from '../../styles/jss';
import { AnimationProps, RbkStyle, RequiredSome } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';

const AnimationFactory = React.memo<AnimationProps>(
  forwardRef(({ stylist, children, component, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Animation;
    const { web, native, Animated, Easing } = global.mapping;

    // Extends from default props
    let {
      delay,
      direction,
      duration,
      from,
      in: run,
      loop,
      speed,
      to,
      timing,
      // Animations
      fade,
      zoom,
      spin,
      // Styles
      variants,
      ...rest
    } = factory2<RequiredSome<AnimationProps, 'direction' | 'duration' | 'timing'>>(props, options);

    direction = direction ?? 'normal';

    let transformFrom = get('transform', from) ?? [];
    let transformTo = get('transform', to) ?? [];

    const opacityFrom = fade && Number(fade) < 0 ? 1 : 0;
    const scaleFrom = zoom && Number(zoom) < 0 ? 1 : 0;
    const rotateFrom = spin && Number(spin) < 0 ? '360deg' : '0deg';

    const opacityTo = fade && Number(fade) < 0 ? 0 : 1;
    const scaleTo = zoom && Number(zoom) < 0 ? 0 : 1;
    const rotateTo = spin && Number(spin) < 0 ? '0deg' : '360deg';

    if (Array.isArray(transformFrom)) {
      zoom && transformFrom.push({ scale: scaleFrom });
      spin && transformFrom.push({ rotate: rotateFrom });
    }

    if (typeof transformFrom === 'string') {
      transformFrom += zoom ? ` scale(${scaleFrom})` : '';
      transformFrom += spin ? ` rotate(${rotateFrom})` : '';
    }

    if (Array.isArray(transformTo)) {
      zoom && transformTo.push({ scale: scaleTo });
      spin && transformTo.push({ rotate: rotateTo });
    }

    if (typeof transformTo === 'string') {
      transformTo += zoom ? ` scale(${scaleTo})` : '';
      transformTo += spin ? ` rotate(${rotateTo})` : '';
    }

    from = jss({ theme }, fade && { opacity: opacityFrom }, { transform: transformFrom }, from);
    to = jss({ theme }, fade && { opacity: opacityTo }, { transform: transformTo }, to);

    const name = useHtmlId();
    const iterations = useMemo(() => (loop === true ? -1 : Number(loop ?? 1)), [loop]);
    const isBoomerang = useMemo(() => direction.includes('alternate'), [direction]);
    const initRangeValue = useMemo(
      () => (!direction.includes('reverse') ? 0 : isBoomerang ? 2 : 1),
      [direction, isBoomerang],
    );

    const animationRef = useRef(native ? new Animated.Value(initRangeValue) : null);

    useEffect(() => {
      if (!native) return;

      animationRef.current.setValue(initRangeValue);

      const easing = timing
        .split('-')
        .map((str, index) => (!index ? str : str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()))
        .join('');

      const animation = Animated.loop(
        Animated.timing(animationRef.current, {
          useNativeDriver: false,
          delay,
          duration: duration ?? speed,
          easing: Easing[easing],
          toValue: initRangeValue ? 0 : isBoomerang ? 2 : 1,
        }),
        { iterations },
      );

      if (run) {
        animation.start();
      }

      return () => {
        animation.stop();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run, timing, delay, duration, speed, iterations, isBoomerang, initRangeValue]);

    if (web) {
      const fromJSS = jss({ theme }, from);
      const fromCSS = css(fromJSS, 'from');

      const toJSS = jss({ theme }, to);
      const toCSS = css(toJSS, 'to');

      createStyle({
        global: true,
        theme,
        style: `
        @keyframes ${name} {
          ${fromCSS}
          ${toCSS}
        }
      `,
      });
    }

    const style: RbkStyle = { position: 'relative' };

    if (web) {
      style.animation = `${name} ${duration ?? speed}ms ${timing} ${delay ? `${delay}ms` : ''} ${
        iterations === -1 ? 'infinite' : iterations
      } ${run ? 'running' : 'paused'} ${direction}`;
    }

    if (native) {
      Object.entries(from).forEach(([attr, val]) => {
        if (attr === 'transform' && Array.isArray(val)) {
          style.transform = (val as any[]).map((obj) => {
            Object.entries(obj).map(([transfAttr, transfValue]) => {
              // @ts-expect-error
              const toValue = get(transfAttr, ...(to?.transform || []));

              obj[transfAttr] = animationRef.current.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [transfValue, toValue, transfValue],
              });
            });

            return obj;
          });

          return;
        }

        style[attr] = animationRef.current.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [val, to?.[attr], val],
        });
      });
    }

    const child = <BoxFactory component={component}>{children}</BoxFactory>;

    return (
      <BoxFactory ref={ref} stylist={[variants.root, stylist]} {...rest}>
        {native ? (
          <Animated.View style={style}>{child}</Animated.View>
        ) : (
          <BoxFactory component={Animated.View} style={style} noRootStyles>
            {child}
          </BoxFactory>
        )}
      </BoxFactory>
    );
  }),
);

AnimationFactory.displayName = 'AnimationFactory';

export default AnimationFactory;
