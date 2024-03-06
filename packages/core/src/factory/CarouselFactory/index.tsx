import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import rect from '../../element/rect';
import scrollTo from '../../element/scrollTo';
import scrollToEnd from '../../element/scrollToEnd';
import scrollToStart from '../../element/scrollToStart';
import useTheme from '../../hooks/useTheme';
import ChevronLeft from '../../icons/ChevronLeft';
import ChevronRight from '../../icons/ChevronRight';
import childrenize from '../../props/childrenize';
import factory2 from '../../props/factory2';
import { CarouselProps, RequiredSome } from '../../types';
import event from '../../utils/event';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';
import ButtonFactory from '../ButtonFactory';
import ScrollableFactory from '../ScrollableFactory';

const CarouselFactory = React.memo<CarouselProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Carousel;
    const { web, native, svg, useDimensions } = global.mapping;

    const dimensions = useDimensions();

    // Extends from default props
    let {
      chevron,
      color,
      gap,
      pagingEnabled,
      pointerScroll,
      // Column Count
      xs,
      sm,
      md,
      lg,
      xl,
      // Styles
      variants,
      itemStyle,
      chevronStyle,
      style,
      ...rest
    } = factory2<RequiredSome<CarouselProps, 'chevron' | 'color' | 'gap' | 'pagingEnabled' | 'pointerScroll' | 'xs'>>(
      props,
      options,
    );

    const contentRef = useRef<any>(null);
    const itemRef = useRef<any>(null);
    const offsetRef = useRef(0);

    const [contentWidth, setContentWidth] = useState<number | null>(null);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const showChevron = chevron && chevron !== 'hidden';
    gap = gap === true ? theme.shape.gap : gap;

    const scrollByCount = useCallback(
      async (count) => {
        let size = contentWidth ?? 0;

        if (web) {
          size = (await rect(itemRef.current)).width;
        }

        scrollTo(contentRef.current, count * size + offsetRef.current);
      },
      [contentWidth, web],
    );

    const scrollToPrev = useCallback(() => {
      scrollByCount(-1).catch(() => null);
    }, [scrollByCount]);

    const scrollToNext = useCallback(() => {
      scrollByCount(1).catch(() => null);
    }, [scrollByCount]);

    const handleScroll = useCallback(
      (e?: any) => {
        let scrollLeft = 0;
        let scrollOverflowWidth = 0;

        if (web) {
          const $target = contentRef.current;
          scrollLeft = $target.scrollLeft;
          scrollOverflowWidth = $target.scrollWidth - $target.clientWidth;
        }

        if (native) {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          scrollLeft = contentOffset.x;
          scrollOverflowWidth = contentSize.width - layoutMeasurement.width;
        }

        offsetRef.current = scrollLeft;

        setHasPrev(scrollLeft - 10 > 0);
        setHasNext(scrollOverflowWidth > scrollLeft + 10);
      },
      [native, web],
    );

    useLayoutEffect(() => {
      if (!web || !contentRef.current) return;
      setContentWidth(contentRef.current.clientWidth);
    }, [dimensions.width, web]);

    useEffect(() => {
      if (!contentRef.current || !contentWidth) return;

      setTimeout(() => {
        scrollToEnd(contentRef.current, false);
        scrollToStart(contentRef.current, false);
      }, 0);
    }, [contentRef, contentWidth]);

    useEffect(() => {
      if (!web || !pointerScroll || !contentRef.current) return;

      return event(contentRef.current, 'wheel', (e) => {
        if (e.deltaY > 0 && hasNext) {
          e.preventDefault();
          scrollToNext();
        }

        if (e.deltaY <= 0 && hasPrev) {
          e.preventDefault();
          scrollToPrev();
        }
      });
    }, [contentRef, hasPrev, hasNext, scrollToNext, scrollToPrev, pointerScroll, web]);

    if (native) {
      Object.assign(rest, {
        decelerationRate: 'fast',
        onLayout: ({ nativeEvent }) => setContentWidth(nativeEvent.layout.width),
      });
    }

    const base = contentWidth ?? 100;

    const xsValue = typeof xs === 'number' || xs === 'auto' ? xs : 'auto';
    const smValue = typeof sm === 'number' || sm === 'auto' ? sm : xsValue;
    const mdValue = typeof md === 'number' || md === 'auto' ? md : smValue;
    const lgValue = typeof lg === 'number' || lg === 'auto' ? lg : mdValue;
    const xlValue = typeof xl === 'number' || xl === 'auto' ? xl : lgValue;

    itemStyle = [
      itemStyle,
      {
        xs: {
          width: typeof xsValue === 'number' ? base / Number(xsValue) : 'auto',
          ...(xs && typeof xs === 'object' ? xs : {}),
        },
        sm: {
          width: typeof smValue === 'number' ? base / Number(smValue) : 'auto',
          ...(sm && typeof sm === 'object' ? sm : {}),
        },
        md: {
          width: typeof mdValue === 'number' ? base / Number(mdValue) : 'auto',
          ...(md && typeof md === 'object' ? md : {}),
        },
        lg: {
          width: typeof lgValue === 'number' ? base / Number(lgValue) : 'auto',
          ...(lg && typeof lg === 'object' ? lg : {}),
        },
        xl: {
          width: typeof xlValue === 'number' ? base / Number(xlValue) : 'auto',
          ...(xl && typeof xl === 'object' ? xl : {}),
        },
      },
    ];

    const chevronProps = {
      color: theme.color(color),
      size: theme.rem(),
    };

    return (
      <BoxFactory ref={ref} style={style} stylist={[variants.root, stylist]} {...rest}>
        <ScrollableFactory
          ref={contentRef}
          stylist={[variants.content]}
          pagingEnabled={pagingEnabled}
          hideScrollBar
          direction="horizontal"
          onScroll={handleScroll}
        >
          {contentWidth !== null &&
            childrenize(children).map((child, index) => (
              <BoxFactory key={index} ref={itemRef} style={itemStyle} px={(gap as number) / 2}>
                {child}
              </BoxFactory>
            ))}
        </ScrollableFactory>

        {showChevron && hasPrev && (
          <BoxFactory l={0} stylist={[variants.chevron]}>
            {typeof chevron === 'function' ? (
              chevron({ prev: true, next: false, color, onPress: scrollToPrev })
            ) : (
              <ButtonFactory variant="outline" color={color} onPress={scrollToPrev} style={chevronStyle}>
                <ChevronLeft svg={svg} {...chevronProps} />
              </ButtonFactory>
            )}
          </BoxFactory>
        )}

        {showChevron && hasNext && (
          <BoxFactory r={0} stylist={[variants.chevron]}>
            {typeof chevron === 'function' ? (
              chevron({ prev: false, next: true, color, onPress: scrollToNext })
            ) : (
              <ButtonFactory variant="outline" color={color} onPress={scrollToNext} style={chevronStyle}>
                <ChevronRight svg={svg} {...chevronProps} />
              </ButtonFactory>
            )}
          </BoxFactory>
        )}
      </BoxFactory>
    );
  }),
);

CarouselFactory.displayName = 'CarouselFactory';

export default CarouselFactory;
