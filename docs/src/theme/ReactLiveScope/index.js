import React from 'react';

import { useAnimation, useTheme } from '@react-bulk/core';
import * as Rbk from '@react-bulk/web';

const ReactBulk = Rbk.default;

// Add react-live imports you need here
const ReactLiveScope = {
  ReactBulk,
  useAnimation,
  useTheme,
  ...Rbk,
  React,
  ...React,
};

// Fix ReactLiveScope bug
delete ReactLiveScope.default;

export default ReactLiveScope;
