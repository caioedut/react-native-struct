import { MutableRefObject, createContext, createRef, useCallback, useMemo, useState } from 'react';

import BaseNative from './BaseNative';
import BaseWeb from './BaseWeb';
import Platform from './Platform';
import Portal from './Portal';
import Toaster, { ToasterRef } from './Toaster';
import createTheme from './createTheme';
import BoxFactory from './factory/BoxFactory';
import { RbkTheme, ThemeEditProps, ThemeModeValues, ThemeProps } from './types';
import global from './utils/global';

export type Responder = {
  onStartShouldSetResponder?: () => boolean;
  onMoveShouldSetResponder?: () => boolean;
  onResponderGrant?: ({ nativeEvent }) => void;
  onResponderMove?: ({ nativeEvent }) => void;
  onResponderRelease?: ({ nativeEvent }) => void;
  onResponderTerminate?: ({ nativeEvent }) => void;
};

const toasterRef = createRef<any>();

export const Context = createContext<{
  theme: RbkTheme;
  setResponder: (value: Responder | undefined) => void;
  toasterRef: MutableRefObject<ToasterRef>;
}>(null as any);

export default function ReactBulk({ theme, children }: any) {
  const { web, native } = Platform;

  const [responder, setResponder] = useState<Responder>();

  const [themeState, setThemeState] = useState<ThemeProps>();

  global.theme = themeState;

  const setTheme = useCallback((theme: ThemeModeValues | ThemeEditProps | ((theme: ThemeProps) => ThemeEditProps)) => {
    setThemeState((current) =>
      createTheme(theme instanceof Function ? theme(current!) : typeof theme === 'string' ? { mode: theme } : theme),
    );
  }, []);

  useMemo(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  if (!themeState) {
    return null;
  }

  return (
    <Context.Provider
      value={{
        theme: { ...themeState, setTheme },
        setResponder,
        toasterRef,
      }}
    >
      {web && <BaseWeb theme={themeState}>{children}</BaseWeb>}

      {native && (
        <BoxFactory flex minh="100%" minw="100%" {...responder}>
          <BaseNative theme={themeState}>{children}</BaseNative>
        </BoxFactory>
      )}

      <Toaster ref={toasterRef} theme={themeState} />

      <Portal />
    </Context.Provider>
  );
}
