import React, { forwardRef, useEffect, useMemo } from 'react';

import useTheme from '../../hooks/useTheme';
import useTransition from '../../hooks/useTransition';
import extract from '../../props/extract';
import factory2 from '../../props/factory2';
import jss from '../../styles/jss';
import transform from '../../styles/transform';
import { AnimationProps, AnyObject, RbkStyleProps, RequiredSome } from '../../types';
import clone from '../../utils/clone';
import BoxFactory from '../BoxFactory';

const AnimationFactory = React.memo<AnimationProps>(
  forwardRef(({ stylist, children, component, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Animation;

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
      throttle,
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
    const iterations = useMemo(() => (loop === true ? -1 : Number(loop ?? 1)), [loop]);
    const boomerang = useMemo(() => direction.includes('alternate'), [direction]);
    const reverse = useMemo(() => direction.includes('reverse'), [direction]);

    const { styleFrom, styleTo } = useMemo(() => {
      const baseFrom: RbkStyleProps = clone(from as AnyObject);
      const baseTo: RbkStyleProps = clone(to as AnyObject);

      let { transform: transformFrom = [] } = extract('transform', baseFrom);
      let { transform: transformTo = [] } = extract('transform', baseTo);

      const opacityFrom = fade && Number(fade) < 0 ? 1 : 0;
      const scaleFrom = zoom && Number(zoom) < 0 ? 1 : 0;
      const rotateFrom = spin && Number(spin) < 0 ? '360deg' : '0deg';

      const opacityTo = fade && Number(fade) < 0 ? 0 : 1;
      const scaleTo = zoom && Number(zoom) < 0 ? 0 : 1;
      const rotateTo = spin && Number(spin) < 0 ? '0deg' : '360deg';

      const styleFrom = jss(
        { theme },
        fade && { opacity: opacityFrom },
        spin && { rotate: rotateFrom },
        zoom && { scale: scaleFrom },
        baseFrom,
      );

      const styleTo = jss(
        { theme },
        fade && { opacity: opacityTo },
        spin && { rotate: rotateTo },
        zoom && { scale: scaleTo },
        baseTo,
      );

      if (typeof transformFrom === 'string') {
        transformFrom = transform(transformFrom);
      }

      if (typeof transformTo === 'string') {
        transformTo = transform(transformTo);
      }

      if (Array.isArray(transformFrom)) {
        transformFrom.forEach((transform) => {
          Object.entries(transform).forEach(([attr, value]) => {
            styleFrom[attr] = value;
          });
        });
      }

      if (Array.isArray(transformTo)) {
        transformTo.forEach((transform) => {
          Object.entries(transform).forEach(([attr, value]) => {
            styleTo[attr] = value;
          });
        });
      }

      return { styleFrom, styleTo };
    }, [fade, from, spin, theme, to, zoom]);

    const transition = useTransition(reverse ? styleTo : styleFrom);

    useEffect(() => {
      if (!run || !transition.props.ref.current) return;

      transition.start({
        boomerang,
        delay,
        iterations,
        throttle,
        timing,
        duration: duration ?? speed,
        from: reverse ? styleTo : styleFrom,
        to: reverse ? styleFrom : styleTo,
      });

      return () => {
        transition.stop();
      };
    }, [
      run,
      boomerang,
      delay,
      duration,
      iterations,
      throttle,
      timing,
      speed,
      reverse,
      styleFrom,
      styleTo,
      transition.stop,
      transition.start,
      transition.props.ref,
    ]);

    return (
      <BoxFactory ref={ref} stylist={[variants.root, stylist]} {...rest}>
        <BoxFactory poisition="relative" {...transition.props}>
          {children}
        </BoxFactory>
      </BoxFactory>
    );
  }),
);

AnimationFactory.displayName = 'AnimationFactory';

export default AnimationFactory;
