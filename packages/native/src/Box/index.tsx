import { forwardRef } from 'react';
import { Text, View, ViewProps, useWindowDimensions } from 'react-native';

import { createBox } from '@react-bulk/core';
import { BoxProps } from '@react-bulk/core/types';

type BoxPropsNative = ViewProps & BoxProps;

const Box = forwardRef(({ ...props }: BoxPropsNative, ref) => {
  const dimensions = useWindowDimensions();
  return createBox(props, ref, { native: true, Text, dimensions }, View);
});

export default Box;
