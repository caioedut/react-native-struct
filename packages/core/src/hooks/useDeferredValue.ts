import { useEffect, useRef, useState } from 'react';

import { TimeoutType } from '../types';

export default function useDeferredValue<T>(value: T, initialValue?: T, delayMs = 500) {
  const timeoutRef = useRef<TimeoutType>();

  const [state, setState] = useState(initialValue);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setState(value);
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs]);

  return state;
}
