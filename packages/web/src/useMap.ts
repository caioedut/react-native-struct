import { useEffect, useRef, useState } from 'react';

import { TimeoutType } from '@react-bulk/core';

export default function useMap() {
  const timeoutRef = useRef<TimeoutType>(null);

  const [dimensions, setDimensions] = useState({
    height: window?.innerHeight,
    width: window?.innerWidth,
  });

  const handleResize = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDimensions({ height: window?.innerHeight, width: window?.innerWidth });
    }, 10);
  };

  useEffect(() => {
    if (!window) return;

    window?.addEventListener('resize', handleResize);
    return () => window?.removeEventListener('resize', handleResize);
  }, []);

  return {
    web: true,
    native: false,
    ios: false,
    android: false,

    dimensions,

    Button: 'button',
    Dialog: 'div',
    Form: 'form',
    Image: 'img',
    Input: 'input',
    Label: 'label',
    Link: 'a',
    ScrollView: 'div',
    Text: 'span',
    TextArea: 'textarea',
    View: 'div',

    Animated: {
      View: 'div',
    },

    // Svg
    svg: {
      Svg: 'svg',
      Circle: 'circle',
      Ellipse: 'ellipse',
      G: 'g',
      Text: 'text',
      TSpan: 'tspan',
      TextPath: 'textPath',
      Path: 'path',
      Polygon: 'polygon',
      Polyline: 'polyline',
      Line: 'line',
      Rect: 'rect',
      Use: 'use',
      Image: 'image',
      Symbol: 'symbol',
      Defs: 'defs',
      LinearGradient: 'linearGradient',
      RadialGradient: 'radialGradient',
      Stop: 'stop',
      ClipPath: 'clipPath',
      Pattern: 'pattern',
      Mask: 'mask',
    },
  };
}
