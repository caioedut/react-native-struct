import { useCallback, useContext } from 'react';

import { Context } from '../ReactBulk';
import { RbkColor, ToasterProps } from '../types';

export default function useToaster() {
  const { toasterRef } = useContext(Context);

  const _open = useCallback(
    (options: string | ToasterProps, color?: RbkColor) => {
      const content = typeof options === 'string' ? options : options?.content;
      const rest = typeof options === 'string' ? {} : options;

      toasterRef?.current?.setProps({
        ...rest,
        content,
        color: color ?? rest?.color,
      });
    },
    [toasterRef],
  );

  const close = useCallback(() => toasterRef?.current?.setProps(undefined), [toasterRef]);

  const open = useCallback((options: string | ToasterProps) => _open(options), [_open]);

  const info = useCallback((options: string | Omit<ToasterProps, 'color'>) => _open(options, 'info'), [_open]);

  const success = useCallback((options: string | Omit<ToasterProps, 'color'>) => _open(options, 'success'), [_open]);

  const warning = useCallback((options: string | Omit<ToasterProps, 'color'>) => _open(options, 'warning'), [_open]);

  const error = useCallback((options: string | Omit<ToasterProps, 'color'>) => _open(options, 'error'), [_open]);

  const primary = useCallback((options: string | Omit<ToasterProps, 'color'>) => _open(options, 'primary'), [_open]);

  const secondary = useCallback(
    (options: string | Omit<ToasterProps, 'color'>) => _open(options, 'secondary'),
    [_open],
  );

  return { open, close, info, success, warning, error, primary, secondary };
}
