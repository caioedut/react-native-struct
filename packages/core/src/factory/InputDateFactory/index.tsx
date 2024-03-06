import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useTheme from '../../hooks/useTheme';
import Calendar from '../../icons/Calendar';
import factory2 from '../../props/factory2';
import { InputDateProps } from '../../types';
import { dateify } from '../../utils/date';
import global from '../../utils/global';
import pick from '../../utils/pick';
import BackdropFactory from '../BackdropFactory';
import BoxFactory from '../BoxFactory';
import ButtonFactory from '../ButtonFactory';
import CalendarFactory from '../CalendarFactory';
import CardFactory from '../CardFactory';
import CollapseFactory from '../CollapseFactory';
import DividerFactory from '../DividerFactory';
import DropdownFactory from '../DropdownFactory';
import GridFactory from '../GridFactory';
import InputFactory from '../InputFactory';

const InputDateFactory = React.memo<InputDateProps>(
  forwardRef(({ stylist, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.InputDate;
    const { locale, svg } = global.mapping;

    // Extends from default props
    let {
      defaultValue,
      disabled,
      color,
      error,
      format,
      locale: localeProp,
      max,
      min,
      name,
      readOnly,
      size,
      translate,
      value,
      variant,
      // Events
      onChange,
      onFocus,
      onBlur,
      onSubmit,
      onFormChange,
      // Styles
      variants,
      ...rest
    } = factory2<InputDateProps>(props, options);

    const resolveAsDate = useCallback(
      (value) => {
        if (!value) {
          return null;
        }

        let dateValue = dateify(value);
        const dateMin = min ? dateify(min) : null;
        const dateMax = max ? dateify(max) : null;

        if (dateMin && dateValue < dateMin) {
          dateValue = dateMin;
        }

        if (dateMax && dateValue > dateMax) {
          dateValue = dateMax;
        }

        return dateValue ?? null;
      },
      [max, min],
    );

    const resolveAsISO = useCallback(
      (value) => {
        return resolveAsDate(value)?.toISOString()?.substring(0, 10) ?? null;
      },
      [resolveAsDate],
    );

    const resolveToFormat = useCallback(
      (value) => {
        const dateValue = resolveAsDate(value);

        if (!dateValue) {
          return null;
        }

        if (format || localeProp || locale) {
          return dateValue.toLocaleDateString(localeProp || locale, {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            ...format,
          });
        }

        return dateValue.toISOString().substring(0, 10);
      },
      [format, locale, localeProp, resolveAsDate],
    );

    const triggerRef = useRef();

    const [calendarVisible, setCalendarVisible] = useState(false);
    // const [_internal, _setInternal] = useState(value ?? defaultValue);
    const [_internal, _setInternal] = useState<Date | null>(resolveAsDate(value ?? defaultValue));

    const internal = useMemo(() => {
      return resolveAsDate(_internal);
    }, [_internal, resolveAsDate]);

    const setInternal = useCallback(
      (value) => {
        _setInternal(resolveAsDate(value));
      },
      [_setInternal, resolveAsDate],
    );

    color = theme.color(error ? 'error' : color || 'primary');

    const Component =
      variant === 'dropdown' ? DropdownFactory : variant === 'inline' ? CollapseFactory : BackdropFactory;

    if (typeof size === 'string') {
      size = pick(size, 'medium', {
        xsmall: 1.25,
        small: 1.75,
        medium: 2.25,
        large: 2.75,
        xlarge: 3.25,
      });
    }

    useEffect(() => {
      if (typeof value === 'undefined') return;
      _setInternal(resolveAsDate(value));
    }, [value]);

    const handleChangeInternal = useCallback(
      (e, date) => {
        const newDate = resolveAsDate(date);
        setInternal(newDate);
        setCalendarVisible(false);
        onChange?.(e, newDate);
      },
      [resolveAsDate, setInternal, onChange],
    );

    return (
      <BoxFactory position="relative">
        <InputFactory
          ref={ref}
          readOnly
          name={name}
          type="hidden"
          disabled={disabled}
          value={resolveAsISO(internal)}
          onChange={handleChangeInternal}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmit={onSubmit}
          onFormChange={onFormChange}
        />
        <InputFactory
          {...rest}
          readOnly
          disabled={disabled}
          error={error}
          color={color}
          value={resolveToFormat(internal)}
          endAddon={
            <ButtonFactory
              ref={triggerRef}
              variant="text"
              color={color}
              size={size}
              disabled={disabled || readOnly}
              p={0}
              mr={-theme.shape.gap / 2}
              accessibility={{ label: 'calendar' }}
              onPress={() => setCalendarVisible((current) => !current)}
            >
              <Calendar svg={svg} size={Math.round(theme.rem(size / 2))} color={color} />
            </ButtonFactory>
          }
        />

        <Component
          visible={calendarVisible}
          {...(variant === 'dropdown'
            ? {
                triggerRef: triggerRef,
                r: 0,
                pt: 0.5,
                onClose: () => setCalendarVisible(false),
              }
            : variant === 'inline'
              ? {
                  alignItems: 'end',
                  p: 1,
                }
              : {
                  center: true,
                  onPress: () => setCalendarVisible(false),
                })}
        >
          <CardFactory minw={320} maxw={360} shadow={1} p={0}>
            <BoxFactory h={380}>
              <CalendarFactory
                color={color}
                date={internal}
                events={internal ? [internal] : []}
                onPressDate={handleChangeInternal}
                disableds={(date) => {
                  const currentDate = dateify(date);
                  const minDate = min ? dateify(min) : null;
                  const maxDate = max ? dateify(max) : null;

                  if (minDate && currentDate < minDate) {
                    return true;
                  }

                  if (maxDate && currentDate > maxDate) {
                    return true;
                  }

                  return false;
                }}
              />
            </BoxFactory>

            <DividerFactory />

            <GridFactory gap m={0}>
              <BoxFactory>
                <ButtonFactory
                  variant="text"
                  color={color}
                  size={size}
                  accessibility={{ label: translate?.clear }}
                  onPress={(e) => handleChangeInternal(e, null)}
                >
                  {translate?.clear}
                </ButtonFactory>
              </BoxFactory>
              <BoxFactory xs p={0} />
              <BoxFactory>
                <ButtonFactory
                  variant="text"
                  color={color}
                  size={size}
                  accessibility={{ label: translate?.cancel }}
                  onPress={() => setCalendarVisible(false)}
                >
                  {translate?.cancel}
                </ButtonFactory>
              </BoxFactory>
              <BoxFactory>
                <ButtonFactory
                  variant="text"
                  color={color}
                  size={size}
                  accessibility={{ label: translate?.today }}
                  onPress={(e) => handleChangeInternal(e, dateify())}
                >
                  {translate?.today}
                </ButtonFactory>
              </BoxFactory>
            </GridFactory>
          </CardFactory>
        </Component>
      </BoxFactory>
    );
  }),
);

InputDateFactory.displayName = 'InputDateFactory';

export default InputDateFactory;
