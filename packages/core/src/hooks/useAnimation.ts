import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import cometta from 'cometta';

import extract from '../props/extract';
import omit from '../props/omit';
import { notPxProps, transformProps } from '../styles/constants';
import css from '../styles/css';
import jss from '../styles/jss';
import transform from '../styles/transform';
import { AnyObject, RbkAnimation, TimeoutType } from '../types';
import clone from '../utils/clone';
import defined from '../utils/defined';
import global from '../utils/global';
import pick from '../utils/pick';
import uuid from '../utils/uuid';
import useDefaultRef from './useDefaultRef';
import useHtmlId from './useHtmlId';

function jssWithTransform(style) {
  const resolved = jss(style);
  return omit('transform', { ...resolved, ...transform(resolved?.transform) });
}

export default function useAnimation(style?: RbkAnimation['from'], ref?: MutableRefObject<any>) {
  const { web, native } = global.mapping;

  const baseStyle = useMemo(() => jssWithTransform(style), [style]);

  const elRef = useDefaultRef<any>(ref);

  const animationName = useHtmlId();
  const styleRef = useRef<AnyObject>(clone(baseStyle));
  const transformRef = useRef<AnyObject>({});
  const runIdRef = useRef<string>();
  const timeoutRef = useRef<TimeoutType>();

  const setStyle = useCallback(
    (attr: string, value: any, unit = null) => {
      const isTransforming = transformProps.includes(attr as any);

      let prop = attr;

      if (web) {
        if (defined(value)) {
          if (!unit && !notPxProps.includes(attr as any)) {
            unit = 'px';
          }

          if (unit) {
            value = `${value}${unit}`;
          }
        }
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
      }

      // Parse "transform" props
      if (isTransforming) {
        prop = 'transform';

        styleRef.current[attr] = value;

        if (web) {
          transformRef.current[attr] = `${attr}(${value})`;
          value = Object.values(transformRef.current).join(' ');
        }

        if (native) {
          transformRef.current[attr] = { [attr]: value };
          value = Object.values(transformRef.current);
        }
      }

      requestAnimationFrame(() => {
        if (!elRef.current) return;

        if (web) {
          elRef.current.style[prop] = value;
        }

        if (native) {
          elRef.current.setNativeProps({ [prop]: value });
        }
      });

      if (!isTransforming) {
        styleRef.current[attr] = value;
      }
    },
    [elRef, native, web],
  );

  const resolveValue = useCallback((value) => {
    const match = `${value}`.match(/^(-?[\d.]+)([a-z%]*)/i);
    return [parseFloat(match?.[1] ?? '0'), match?.[2]?.trim()?.toLowerCase() || null] as const;
  }, []);

  const stop = useCallback(() => {
    if (web && elRef.current) {
      elRef.current.style.animationPlayState = 'paused';
    }

    runIdRef.current = undefined;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = null;
  }, [elRef, runIdRef, timeoutRef, web]);

  const reset = useCallback(() => {
    stop();

    if (web && elRef.current) {
      elRef.current.style.animation = '';
    }

    Object.keys(styleRef.current).forEach((attr) => {
      setStyle(attr, baseStyle?.[attr] ?? undefined);
    });
  }, [baseStyle, elRef, setStyle, stop, web]);

  const start = useCallback(
    async (options: RbkAnimation) => {
      return new Promise((resolve) => {
        stop();

        let {
          to,
          from = styleRef.current,
          boomerang = false,
          delay = 0,
          duration = 250,
          iterations = 1,
          throttle = 0,
          timing = 'linear',
          web_useRawStyle = false,
        } = options;

        from = jssWithTransform(from);
        to = jssWithTransform(to);

        const lastState = clone(to);

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

        if (web && !web_useRawStyle) {
          const transformFromArr = Object.entries(extract([...transformProps], from)).map(([attr, value]) => ({
            [attr]: value,
          }));

          const transformToArr = Object.entries(extract([...transformProps], to)).map(([attr, value]) => ({
            [attr]: value,
          }));

          cometta.createStyleSheet(
            `
             @keyframes ${animationName} {
               from { ${css(from, transformFromArr.length > 0 && { transform: transformFromArr })} }
               to { ${css(to, transformToArr.length > 0 && { transform: transformToArr })} }
             }
          `,
            { uniqueId: animationName },
          );

          const direction = boomerang ? 'alternate' : 'normal';
          iterations = iterations === -1 ? 'infinite' : iterations;
          iterations = typeof iterations === 'number' && boomerang ? iterations * 2 : iterations;

          // Reset styles
          Object.keys(to).forEach((attr) => {
            setStyle(attr, meta[attr].from, meta[attr].unit);
          });

          if (elRef.current) {
            elRef.current.addEventListener(
              'animationend',
              () => {
                // Set exact styles for last state
                Object.keys(lastState).forEach((attr) => {
                  if (boomerang) {
                    setStyle(attr, meta[attr].from, meta[attr].unit);
                  } else {
                    setStyle(attr, meta[attr].to, meta[attr].unit);
                  }
                });

                elRef.current.style.animation = '';

                setTimeout(resolve, 10);
              },
              { once: true },
            );

            elRef.current.style.animation = `${animationName} ${duration}ms ${timing} ${
              delay || 0
            }ms ${iterations} ${direction}`;
          }
        }

        if (native || web_useRawStyle) {
          const runId = uuid();
          runIdRef.current = runId;

          const timingFn = pick(timing, 'ease', {
            linear: easeLinear,
            ease: easeInSine,
            'ease-in': easeInQuad,
            'ease-out': easeOutQuad,
            'ease-in-out': easeInOutQuad,
          });

          iterations = iterations === -1 ? 'infinite' : iterations;
          iterations = iterations === 'infinite' ? Number.POSITIVE_INFINITY : Number(iterations) * (boomerang ? 2 : 1);

          timeoutRef.current = setTimeout(
            async () => {
              for (let index = 0; index < Number(iterations); index++) {
                if (runId !== runIdRef.current) {
                  break;
                }

                const isBackward = boomerang && Number(index) % 2 !== 0;

                await new Promise((resolveStep) => {
                  const startAt = Date.now();
                  const endAt = startAt + duration;

                  const apply = async () => {
                    if (endAt < Date.now() || runId !== runIdRef.current) {
                      return resolveStep(true);
                    }

                    const pos = duration - (endAt - Date.now());

                    Object.keys(to).forEach((attr) => {
                      const [startValue] = isBackward ? resolveValue(to[attr]) : resolveValue(from[attr]);
                      const [endValue] = isBackward ? resolveValue(from[attr]) : resolveValue(to[attr]);
                      const newValue = timingFn(pos, startValue, endValue - startValue, duration);
                      setStyle(attr, newValue, meta[attr].unit);
                    });

                    timeoutRef.current = setTimeout(apply, throttle);
                  };

                  timeoutRef.current = setTimeout(apply, 0);
                });

                // Set exact styles for last state
                if (runId === runIdRef.current) {
                  Object.keys(lastState).forEach((attr) => {
                    if (isBackward) {
                      setStyle(attr, meta[attr].from, meta[attr].unit);
                    } else {
                      setStyle(attr, meta[attr].to, meta[attr].unit);
                    }
                  });
                }
              }

              setTimeout(resolve, 10);
            },
            Math.max(delay || 0, 0),
          );
        }
      });
    },
    [animationName, elRef, native, resolveValue, setStyle, stop, web],
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return useMemo(
    () => ({
      start,
      stop,
      reset,
      props: { ref: elRef, style },
    }),
    [elRef, reset, start, stop, style],
  );
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
