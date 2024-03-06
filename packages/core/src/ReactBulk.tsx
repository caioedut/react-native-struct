import { MutableRefObject, createContext, createRef, useCallback, useEffect, useState } from 'react';

import BaseNative from './BaseNative';
import BaseWeb from './BaseWeb';
import Platform from './Platform';
import Portal from './Portal';
import Toaster, { ToasterRef } from './Toaster';
import createTheme from './createTheme';
import { RbkTheme, ThemeEditProps, ThemeModeValues, ThemeProps } from './types';
import global from './utils/global';

const toasterRef = createRef<any>();

export const Context = createContext<{
  theme: RbkTheme;
  toasterRef: MutableRefObject<ToasterRef>;
}>({
  theme: {} as RbkTheme,
  toasterRef,
});

function ReactBulk({ theme, children }: any) {
  const { web, native } = Platform;

  const [themeState, setThemeState] = useState<ThemeProps>();

  global.theme = themeState;

  const setTheme = useCallback((theme: ThemeModeValues | ThemeEditProps) => {
    theme = typeof theme === 'string' ? { mode: theme } : theme;
    setThemeState((current) => createTheme(theme as ThemeProps, current));
  }, []);

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  if (!themeState) {
    return null;
  }

  return (
    <Context.Provider
      value={{
        theme: { ...themeState, setTheme },
        toasterRef,
      }}
    >
      {web && <BaseWeb theme={themeState}>{children}</BaseWeb>}

      {native && <BaseNative theme={themeState}>{children}</BaseNative>}

      <Toaster ref={toasterRef} theme={themeState} />

      <Portal />
    </Context.Provider>
  );
}

export default ReactBulk;
