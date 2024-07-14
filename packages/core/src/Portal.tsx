import { Fragment } from 'react';

import useDeferredValue from './hooks/useDeferredValue';
import usePortals from './hooks/usePortals';

export default function Portal() {
  const [portals] = usePortals();

  const portalsDeferred = useDeferredValue(portals, {}, 0);

  return (
    <Fragment>
      {Object.entries(portalsDeferred!).map(([key, children]) => (
        <Fragment key={key}>{children}</Fragment>
      ))}
    </Fragment>
  );
}
