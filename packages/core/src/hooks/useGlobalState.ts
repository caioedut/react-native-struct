import { useCallback, useEffect, useMemo, useState } from 'react';

import useHtmlId from './useHtmlId';

const store: { [key: string]: any } = {};

const listeners: { [key: string]: Record<string, Function> } = {};

/**
 * @reference https://yoavik.com/snippets/use-global-state
 */
export default function useGlobalState<T>(key: string, initialState?: T | (() => T)) {
  const listenerId = useHtmlId();

  const [state, _setState] = useState<T>(store[key] ?? initialState);

  const setState: typeof _setState = useCallback(
    (value) => {
      const next = value instanceof Function ? value(store[key]) : value;
      Object.values(listeners[key]).forEach((listener) => listener(next));
      store[key] = next;
    },
    [key],
  );

  // #HACK onBeforeMount
  useMemo(() => {
    // Store the initial state on the first call with this key
    store[key] = store[key] ?? initialState;

    // Create an empty array of listener on the first call with this key
    listeners[key] = listeners[key] ?? {};
  }, [key]);

  useMemo(() => {
    // Register the observer
    listeners[key][listenerId] = _setState;
  }, [key, listenerId]);

  useEffect(() => {
    // Cleanup when unmounting
    return () => {
      delete listeners[key][listenerId];
    };
  }, [key, listenerId]);

  return [state, setState] as const;
}
