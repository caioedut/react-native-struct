import React, { isValidElement } from 'react';

import { useTheme } from '../../ReactBulk';
import factory from '../../props/factory';
import { FactoryProps, TableProps } from '../../types';
import useStylist from '../../useStylist';
import BoxFactory from '../BoxFactory';
import ScrollableFactory from '../ScrollableFactory';
import TextFactory from '../TextFactory';

function TableFactory({ stylist, map, innerRef, ...props }: FactoryProps & TableProps) {
  const theme = useTheme();
  const options = theme.components.Table;

  // Extends from default props
  let { border, columns, rows, ...rest } = factory(props, options.defaultProps);

  const width = `${100 / columns?.length}%`;

  const renderContent = (child: any, data: any = undefined, bold = false) => {
    if (child) {
      if (isValidElement(child)) {
        return child;
      }

      if (typeof child === 'function') {
        child = child(data);
      }

      if (['string', 'number'].includes(typeof child)) {
        child = <TextFactory map={map} bold={bold} children={child} />;
      }
    }

    return child ?? null;
  };

  const buildStyle = (column, borderTop = false, borderLeft = false) => {
    return [
      {
        border,
        p: 1,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      },

      !borderTop && { borderTopWidth: 0 },
      !borderLeft && { borderLeftWidth: 0 },

      column.style,

      {
        width,
        flexGrow: 0,
        flexShrink: 0,
      },
    ];
  };

  const styleRoot = useStylist({
    name: options.name,
    style: options.defaultStyles.root,
  });

  const styleState = useStylist({
    style: { border },
  });

  return (
    <ScrollableFactory innerRef={innerRef} map={map} stylist={[styleRoot, styleState, stylist]} direction="horizontal" {...rest}>
      <BoxFactory map={map} row noWrap>
        {columns?.map((column, index) => (
          <BoxFactory key={index} map={map} style={buildStyle(column, false, index > 0)}>
            {renderContent(column.header, column, true)}
          </BoxFactory>
        ))}
      </BoxFactory>
      {rows?.map((row, rowIndex) => (
        <BoxFactory key={rowIndex} map={map} row noWrap>
          {columns.map((column, index) => (
            <BoxFactory key={index} map={map} style={buildStyle(column, true, index > 0)}>
              {renderContent(column.content, row)}
            </BoxFactory>
          ))}
        </BoxFactory>
      ))}
    </ScrollableFactory>
  );
}

export default React.memo(TableFactory);
