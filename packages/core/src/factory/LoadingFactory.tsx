import React, { forwardRef } from 'react';

import useTheme from '../hooks/useTheme';
import factory2 from '../props/factory2';
import toPx from '../styles/toPx';
import { LoadingProps, RequiredSome } from '../types';
import global from '../utils/global';
import BoxFactory from './BoxFactory';
import TextFactory from './TextFactory';

const LoadingFactory = React.memo<LoadingProps>(
  forwardRef(({ ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Loading;
    const { Svg, Circle } = global.mapping.svg;

    // Extends from default props
    let {
      duration,
      color,
      label,
      size,
      // Styles,
      variants,
      labelStyle,
      ...rest
    } = factory2<RequiredSome<LoadingProps, 'color' | 'size'>>(props, options);

    color = theme.color(color ?? 'primary');

    const sizePx = toPx(size, theme)!;
    const c = sizePx / 2;
    const w = c / 4;
    const r = c - w / 2;

    labelStyle = [
      {
        color,
        fontSize: size,
        marginLeft: size,
      },
      labelStyle,
    ];

    return (
      <BoxFactory ref={ref} variants={{ root: variants.root }} {...rest}>
        <BoxFactory
          animation={{
            throttle: 0,
            duration,
            timing: 'linear',
            iterations: 'infinite',
            from: { rotate: '0deg' },
            to: { rotate: '360deg' },
          }}
        >
          <Svg viewBox={`0 0 ${sizePx} ${sizePx}`} height={sizePx} width={sizePx}>
            <Circle //
              cx={c}
              cy={c}
              fill="none"
              r={r}
              stroke={color}
              strokeWidth={w}
              strokeOpacity={0.2}
            />
            <Circle //
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={w}
              strokeDasharray={sizePx * 2.5}
              strokeDashoffset={sizePx * 1.875}
            />
          </Svg>
        </BoxFactory>

        {Boolean(label) && (
          <TextFactory style={labelStyle} variants={{ root: variants.label }}>
            {label}
          </TextFactory>
        )}
      </BoxFactory>
    );
  }),
);

LoadingFactory.displayName = 'LoadingFactory';

export default LoadingFactory;
