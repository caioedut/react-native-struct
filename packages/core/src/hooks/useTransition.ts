import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import { notPxProps, transformProps } from '../styles/constants';
import jss from '../styles/jss';
import { IntervalType, RbkStyleProps, RbkTransition, TimeoutType } from '../types';
import clone from '../utils/clone';
import defined from '../utils/defined';
import global from '../utils/global';
import stdout from '../utils/stdout';
import uuid from '../utils/uuid';
import useTheme from './useTheme';

export default function useTransition(style?: RbkStyleProps, ref?: MutableRefObject<any>) {
  const theme = useTheme();
  const { web, native } = global.mapping;

  const baseStyle = useMemo(() => jss({ theme }, style), [theme, style]);

  const defaultRef = useRef();
  const elRef = ref ?? defaultRef;

  const styleRef = useRef(clone(baseStyle));
  const runIdRef = useRef<string>();
  const timeoutRef = useRef<TimeoutType>();
  const intervalRef = useRef<IntervalType>();

  const setStyle = useCallback(
    (attr: string, value: any, unit = null) => {
      if (web) {
        if (defined(value)) {
          if (!unit && !notPxProps.includes(attr as any)) {
            unit = 'px';
          }

          if (unit) {
            value = `${value}${unit}`;
          }
        }

        requestAnimationFrame(() => {
          if (elRef.current) {
            elRef.current.style[attr] = value;
          }
        });
      }

      if (native) {
        if (defined(value)) {
          if (unit === 'px') {
            unit = null;
          }

          if (unit) {
            value = `${value}${unit}`;
          }
        }

        // Parse "transform" props
        if (transformProps.includes(attr as any)) {
          value = [{ [attr]: value }];
          attr = 'transform';
        }

        requestAnimationFrame(() => {
          if (elRef.current) {
            elRef.current.setNativeProps({ [attr]: value });
          }
        });
      }

      styleRef.current[attr] = value;
    },
    [elRef, native, web],
  );

  const resolveValue = useCallback((value) => {
    const match = `${value}`.match(/^(-?[\d.]+)([a-z%]*)/i);
    return [parseFloat(match?.[1] ?? '0'), match?.[2]?.trim()?.toLowerCase() || null] as const;
  }, []);

  const stop = useCallback(() => {
    runIdRef.current = undefined;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();

    Object.keys(styleRef.current).forEach((attr) => {
      setStyle(attr, baseStyle?.[attr] ?? undefined);
    });
  }, [baseStyle, setStyle, stop]);

  const start = useCallback(
    (options: RbkTransition) => {
      stop();

      const runId = uuid();
      runIdRef.current = runId;

      let {
        to,
        from = styleRef.current,
        boomerang = false,
        delay = 0,
        duration = 350,
        iterations = 1,
        timing = 'linear',
        throttle = 10,
      } = options;

      if (throttle < 1) {
        throttle = 1;
        stdout.warn('"useTransition" "throttle" must be greater than 0.');
      }

      from = jss({ theme }, from);
      to = jss({ theme }, to);

      const timingFn =
        {
          ease: easeInOutSine,
          'ease-in': easeInQuad,
          'ease-out': easeOutQuad,
          'ease-in-out': easeInOutQuad,
        }[timing] || easeLinear;

      const meta = Object.fromEntries(
        Object.keys(to).map((attr) => {
          const [fromValue, fromUnit] = resolveValue(from?.[attr] || 0);
          const [toValue, toUnit] = resolveValue(to[attr]);

          return [
            attr,
            {
              from: fromValue,
              to: toValue,
              unit: toUnit || fromUnit,
            },
          ];
        }),
      );

      const animate = () => {
        if (!iterations || runId !== runIdRef.current) {
          return;
        }

        if (typeof iterations === 'number' && iterations > 0) {
          iterations--;
        }

        // Reset styles
        Object.keys(to).forEach((attr) => {
          setStyle(attr, meta[attr].from, meta[attr].unit);
        });

        let startAt = Date.now();
        let endAt = startAt + duration;

        intervalRef.current = setInterval(() => {
          const pos = duration - (endAt - Date.now());

          Object.keys(to).forEach((attr) => {
            const [startValue] = resolveValue(from[attr]);
            const [endValue] = resolveValue(to[attr]);
            const newValue = timingFn(pos, startValue, endValue - startValue, duration);
            setStyle(attr, newValue, meta[attr].unit);
          });

          if (endAt < Date.now() && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;

            // Set exact target value on last iteration
            Object.keys(to).forEach((attr) => {
              setStyle(attr, meta[attr].to, meta[attr].unit);
            });

            // Create forward interval for boomerang
            if (boomerang) {
              startAt = Date.now();
              endAt = startAt + duration;

              intervalRef.current = setInterval(() => {
                const pos = duration - (endAt - Date.now());

                Object.keys(to).forEach((attr) => {
                  const [startValue] = resolveValue(to[attr]);
                  const [endValue] = resolveValue(from[attr]);
                  const newValue = timingFn(pos, startValue, endValue - startValue, duration);
                  setStyle(attr, newValue, meta[attr].unit);
                });

                if (endAt < Date.now() && intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;

                  // Set exact target value on last iteration
                  Object.keys(to).forEach((attr) => {
                    setStyle(attr, meta[attr].from, meta[attr].unit);
                  });

                  // Loop?
                  animate();
                }
              }, throttle);
            } else {
              // Loop?
              animate();
            }
          }
        }, throttle);
      };

      timeoutRef.current = setTimeout(animate, Math.max(delay || 0, 0));
    },
    [resolveValue, setStyle, stop, theme],
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    reset,
    props: { ref: elRef, style },
  };
}

/**
 * currentIteration = Time - Usually starts at 0 and is slowly increased using a game loop or other update function.
 * startValue = Beginning value - The starting point of the animation. Usually it's a static value, you can start at 0 for example.
 * changeInValue = Change in value - The amount of change needed to go from starting point to end point (endValue - startValue). It's also usually a static value.
 * totalIterations = Duration - Amount of time the animation will take. Usually a static value as well.
 */

function easeLinear(currentIteration, startValue, changeInValue, totalIterations) {
  return (changeInValue * currentIteration) / totalIterations + startValue;
}

function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
}

function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
  return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}

function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * currentIteration * currentIteration + startValue;
  }
  return (-changeInValue / 2) * (--currentIteration * (currentIteration - 2) - 1) + startValue;
}

function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
}

function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * Math.pow(currentIteration, 3) + startValue;
  }
  return (changeInValue / 2) * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
}

function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
}

function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
  return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
}

function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * Math.pow(currentIteration, 4) + startValue;
  }
  return (-changeInValue / 2) * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
}

function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
}

function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
}

function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * Math.pow(currentIteration, 5) + startValue;
  }
  return (changeInValue / 2) * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
}

function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (1 - Math.cos((currentIteration / totalIterations) * (Math.PI / 2))) + startValue;
}

function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.sin((currentIteration / totalIterations) * (Math.PI / 2)) + startValue;
}

function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
  return (changeInValue / 2) * (1 - Math.cos((Math.PI * currentIteration) / totalIterations)) + startValue;
}

function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
}

function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (-Math.pow(2, (-10 * currentIteration) / totalIterations) + 1) + startValue;
}

function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
  }
  return (changeInValue / 2) * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
}

function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
}

function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
  return (
    changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) +
    startValue
  );
}

function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return (changeInValue / 2) * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
  }
  return (changeInValue / 2) * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
}
