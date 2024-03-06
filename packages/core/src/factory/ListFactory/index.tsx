import React, {
  MutableRefObject,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import rect from '../../element/rect';
import useTheme from '../../hooks/useTheme';
import childrenize from '../../props/childrenize';
import factory2 from '../../props/factory2';
import { ListProps, ReactElement } from '../../types';
import global from '../../utils/global';
import sleep from '../../utils/sleep';
import ScrollableFactory from '../ScrollableFactory';

const ListFactory = React.memo<ListProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.List;
    const { View } = global.mapping;

    // Extends from default props
    const {
      renderDelay,
      rowHeight,
      rowFallbackComponent = View,
      // Events
      onScroll,
      // Styles
      variants,
      ...rest
    } = factory2<ListProps>(props, options);

    const defaultRef = useRef();
    const scrollRef = (ref ?? defaultRef) as MutableRefObject<ReactElement>;
    const childrenArray = useMemo(() => childrenize(children), [children]);
    const [visible, setVisible] = useState<number[]>([]);

    const render = useCallback(
      ({ clientHeight = 0, offsetTop = 0 }) => {
        const newVisible: typeof visible = [];

        let curPosY = 0;

        for (const index in childrenArray) {
          const child = childrenArray[index];
          const height = child?.props?.height ?? rowHeight ?? 0;

          curPosY += height;
          const minPosY = offsetTop - height;
          const maxPosY = clientHeight + offsetTop + height;

          if (curPosY >= minPosY && curPosY <= maxPosY) {
            newVisible.push(Number(index));
          }
        }

        setVisible(newVisible);
      },
      [childrenArray, rowHeight],
    );

    useEffect(() => {
      if (!scrollRef.current) return;

      (async () => {
        if (renderDelay) {
          await sleep(renderDelay);
        }

        const { height } = await rect(scrollRef.current);

        render({ clientHeight: height });
      })();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollRef, childrenArray]);

    const handleScroll = useCallback(
      (event) => {
        const { target, nativeEvent } = event;

        const clientHeight = target?.clientHeight ?? nativeEvent?.layoutMeasurement?.height ?? 0;
        const offsetTop = target?.scrollTop ?? nativeEvent?.contentOffset?.y ?? 0;

        render({ clientHeight, offsetTop });

        onScroll?.(event);
      },
      [render, onScroll],
    );

    return (
      <ScrollableFactory ref={scrollRef} stylist={[variants.root, stylist]} {...rest} onScroll={handleScroll}>
        {childrenArray.map((child, index) => {
          if (visible.includes(index)) {
            return cloneElement(child, { key: index });
          }

          const Component = rowFallbackComponent;
          const ref = (child as any)?.ref;
          const height = child?.props?.height ?? rowHeight ?? 0;
          const width = child?.props?.width;

          return <Component key={index} ref={ref} style={{ height, width }} />;
        })}
      </ScrollableFactory>
    );
  }),
);

ListFactory.displayName = 'ListFactory';

export default ListFactory;
