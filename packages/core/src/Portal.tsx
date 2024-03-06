import { Fragment } from 'react';

import usePortals from './hooks/usePortals';

export default function Portal() {
  const [portals] = usePortals();

  return (
    <Fragment>
      {Object.entries(portals).map(([key, children]) => (
        <Fragment key={key}>{children}</Fragment>
      ))}
    </Fragment>
  );
}
