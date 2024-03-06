import React, { forwardRef, useEffect, useRef, useState } from 'react';

import rect from '../../element/rect';
import useTheme from '../../hooks/useTheme';
import extract from '../../props/extract';
import factory2 from '../../props/factory2';
import { DropdownProps } from '../../types';
import defined from '../../utils/defined';
import global from '../../utils/global';
import BackdropFactory from '../BackdropFactory';
import BoxFactory from '../BoxFactory';

const DropdownFactory = React.memo<DropdownProps>(
  forwardRef(({ stylist, children, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Dropdown;
    const { useDimensions } = global.mapping;

    // Extends from default props
    const {
      placement,
      visible,
      triggerRef,
      // Events
      onClose,
      // Styles,
      variants,
      style,
      ...rest
    } = factory2<DropdownProps>(props, options);

    const boxRef = useRef();
    const parentRef = triggerRef ?? boxRef;

    const dimensions = useDimensions();

    const [positions, setPositions] = useState({
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    });

    const extracted = extract(['i', 't', 'l', 'r', 'b', 'inset', 'top', 'left', 'right', 'bottom'], rest, style);
    const inset = extracted.i ?? extracted.inset;
    const top = extracted.t ?? extracted.top ?? inset;
    const left = extracted.l ?? extracted.left ?? inset;
    const right = extracted.r ?? extracted.right ?? inset;

    useEffect(() => {
      if (!visible || !parentRef?.current) return;

      (async () => {
        const metrics = await rect(parentRef.current);

        setPositions({
          top: metrics.pageOffsetY,
          left: metrics.pageOffsetX,
          height: metrics.height,
          width: metrics.width,
        });
      })();
    }, [parentRef, visible, placement, dimensions.height]);

    return (
      <BoxFactory ref={boxRef}>
        <BackdropFactory visible={visible} stylist={[variants.backdrop]} onPress={onClose}>
          <BoxFactory ref={ref} position="absolute" style={positions}>
            <BoxFactory
              stylist={[variants.root, stylist]}
              {...rest}
              style={[
                placement === 'top' ? { bottom: '100%' } : { top: '100%' },
                defined(inset) && { inset },
                defined(top) && { top },
                defined(left) && { left },
                defined(right) && { right },
                style,
              ]}
            >
              {children}
            </BoxFactory>
          </BoxFactory>
        </BackdropFactory>
      </BoxFactory>
    );
  }),
);

DropdownFactory.displayName = 'DropdownFactory';

export default DropdownFactory;
