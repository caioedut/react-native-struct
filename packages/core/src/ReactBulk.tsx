import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BaseNative from './BaseNative';
import BaseWeb from './BaseWeb';
import Platform from './Platform';
import Portal from './Portal';
import RbkContext from './RbkContext';
import Toaster from './Toaster';
import createTheme from './createTheme';
import BoxFactory from './factory/BoxFactory';
import { AnyObject, ThemeEditProps, ThemeModeValues, ThemeProps } from './types';
import global from './utils/global';

const toasterRef = createRef<any>();

export default function ReactBulk({ theme: themeProp, children }: any) {
  const { web, native } = Platform;

  const mountedRef = useRef(false);

  // Handled by useDraggable
  const [draggable, setDraggable] = useState<AnyObject>();

  const [theme, _setTheme] = useState<ThemeProps>(() => {
    return createTheme(typeof themeProp === 'string' ? { mode: themeProp } : themeProp);
  });

  global.theme = theme;

  const setTheme = useCallback((theme: ThemeModeValues | ThemeEditProps | ((theme: ThemeProps) => ThemeEditProps)) => {
    _setTheme((current) => {
      return createTheme(
        theme instanceof Function ? theme(current) : typeof theme === 'string' ? { mode: theme } : theme,
      );
    });
  }, []);

  useEffect(() => {
    // Avoid double render with initial theme
    if (mountedRef.current) {
      setTheme(themeProp);
    }

    mountedRef.current = true;
  }, [mountedRef, themeProp, setTheme]);

  const context = useMemo(
    () => ({
      theme: { ...theme, setTheme },
      setDraggable,
      toasterRef,
    }),
    [theme, setTheme],
  );

  return (
    <RbkContext.Provider value={context}>
      {web && <BaseWeb theme={theme}>{children}</BaseWeb>}

      {native && (
        <BoxFactory flex minh="100%" minw="100%" {...draggable}>
          <BaseNative theme={theme}>{children}</BaseNative>
        </BoxFactory>
      )}

      <Toaster ref={toasterRef} theme={theme} />

      <Portal />
    </RbkContext.Provider>
  );
}
