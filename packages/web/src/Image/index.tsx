import { forwardRef, memo, useMemo } from 'react';

import { ImageFactory, ImageProps } from '@react-bulk/core';

import useMap from '../useMap';

function Image({ source, corners, rounded, style, ...props }: ImageProps, ref) {
  const map = useMap();

  style = [
    rounded && {
      borderRadius: '50%',
    },

    style,
  ];

  // @ts-ignore
  props.src = useMemo(() => source?.uri ?? source, [source]);

  return <ImageFactory innerRef={ref} {...props} map={map} style={style} />;
}

export default memo(forwardRef<typeof Image, ImageProps>(Image));
