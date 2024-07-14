import React, { forwardRef, useCallback, useMemo } from 'react';

import useDependentState from '../hooks/useDependentState';
import useTheme from '../hooks/useTheme';
import ChevronLeft from '../icons/ChevronLeft';
import ChevronRight from '../icons/ChevronRight';
import factory2 from '../props/factory2';
import { AnyObject, CalendarProps } from '../types';
import { dateify } from '../utils/date';
import global from '../utils/global';
import string from '../utils/string';
import BoxFactory from './BoxFactory';
import ButtonFactory from './ButtonFactory';
import CardFactory from './CardFactory';
import GridFactory from './GridFactory';
import InputFactory from './InputFactory';
import TextFactory from './TextFactory';

const CalendarFactory = React.memo<CalendarProps>(
  forwardRef(({ ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Calendar;
    const { locale, svg } = global.mapping;

    // Extends from default props
    let {
      color,
      date,
      disableds,
      events,
      // Events
      onPressDate,
      // Styles
      variants,
      ...rest
    } = factory2<CalendarProps>(props, options);

    const today = dateify();
    color = theme.color(color || 'primary');

    const [internal, setInternal] = useDependentState(() => dateify(date), [date]);

    const eventsDates = useMemo(() => events?.filter(Boolean)?.map((value) => dateify(value)) || [], [events]);

    const monthName = useMemo(() => internal.toLocaleDateString(locale, { month: 'long' }), [internal, locale]);

    const daysInMonth = useMemo(
      () => new Date(internal.getFullYear(), internal.getMonth() + 1, 0).getDate(),
      [internal],
    );

    const monthDates = useMemo(() => {
      const newMonthDates = Array.from({ length: daysInMonth }).map((_, index) => {
        const date = dateify(internal);
        date.setDate(index + 1);
        return date;
      });

      while (newMonthDates[0].getDay() !== 0) {
        const date = dateify(newMonthDates[0]);
        date.setDate(date.getDate() - 1);
        newMonthDates.unshift(date);
      }

      while (newMonthDates.length < 35 || newMonthDates.length % 7 !== 0) {
        const date = dateify(newMonthDates.slice(-1)[0]);
        date.setDate(date.getDate() + 1);
        newMonthDates.push(date);
      }

      return newMonthDates;
    }, [daysInMonth, internal]);

    const handleYear = useCallback(
      (year: number) => {
        if (string(year).length !== 4) return;

        setInternal((current) => {
          const newDate = dateify(current.getTime());
          newDate.setFullYear(year);
          return newDate;
        });
      },
      [setInternal],
    );

    const handleMonth = useCallback(
      (sum: number) => {
        setInternal((current) => {
          const newDate = dateify(current.getTime());
          newDate.setMonth(newDate.getMonth() + sum);
          return newDate;
        });
      },
      [setInternal],
    );

    const handleDate = useCallback(
      (e: AnyObject, date: Date) => {
        setInternal(date);
        onPressDate?.(e, date);
      },
      [onPressDate, setInternal],
    );

    return (
      <CardFactory ref={ref} variants={{ root: variants.root }} {...rest}>
        <GridFactory gap noWrap>
          <BoxFactory>
            <ButtonFactory
              variant="outline"
              color={color}
              onPress={() => handleMonth(-1)}
              accessibility={{ label: 'previous month' }}
            >
              <ChevronLeft svg={svg} color={color} />
            </ButtonFactory>
          </BoxFactory>
          <BoxFactory xs center px={0}>
            <TextFactory center numberOfLines={1} maxw="100%">
              {monthName.substring(0, 1).toUpperCase()}
              {monthName.substring(1).toLowerCase()}
            </TextFactory>
          </BoxFactory>
          <BoxFactory>
            <ButtonFactory
              variant="outline"
              color={color}
              onPress={() => handleMonth(1)}
              accessibility={{ label: 'next month' }}
            >
              <ChevronRight svg={svg} color={color} />
            </ButtonFactory>
          </BoxFactory>
          <BoxFactory w={112}>
            <InputFactory
              colorful
              controlled
              type="number"
              min={1000}
              color={color}
              value={internal.getFullYear()}
              inputStyle={{ textAlign: 'center' }}
              onChange={(_, value) => handleYear(value)}
              accessibility={{ hint: 'year' }}
            />
          </BoxFactory>
        </GridFactory>

        <BoxFactory mt={theme.shape.gap * 2} />

        <GridFactory gap={0.5} size={7}>
          {monthDates.slice(0, 7).map((date) => (
            <BoxFactory key={date.toISOString()} xs={1}>
              <TextFactory variant="secondary" color="text.disabled" bold center>
                {date.toLocaleDateString(locale, { weekday: 'narrow' }).split(/[,.]/g)?.[0]}
              </TextFactory>
            </BoxFactory>
          ))}

          {monthDates.map((date) => {
            const dateISO = date.toISOString().substring(0, 10);
            const isMuted = date.getMonth() !== internal.getMonth();
            const isToday = today.toISOString().substring(0, 10) === dateISO;

            const hasEvent = eventsDates.some((event) => dateify(event).toISOString().substring(0, 10) === dateISO);

            const isDisabled = Array.isArray(disableds)
              ? disableds.some((disabledDate) => dateify(disabledDate).toISOString().substring(0, 10) === dateISO)
              : disableds instanceof Function
                ? disableds(date)
                : false;

            return (
              <BoxFactory key={date.toISOString()} xs={1}>
                <ButtonFactory
                  disabled={isDisabled}
                  variant={!isMuted && hasEvent ? 'solid' : 'text'}
                  color={!isMuted && hasEvent ? color : 'text.primary'}
                  style={[{ px: 0, py: 0 }, isToday && !hasEvent && { bg: 'background.secondary' }]}
                  labelStyle={[{ w: 20 }, isMuted && { color: 'text.disabled' }]}
                  onPress={(e) => handleDate(e, date)}
                  accessibility={{ value: { now: date.getDate() } }}
                  data-rbk-calendar={date.getDate()}
                >
                  {date.getDate()}
                </ButtonFactory>
              </BoxFactory>
            );
          })}
        </GridFactory>
      </CardFactory>
    );
  }),
);

CalendarFactory.displayName = 'CalendarFactory';

export default CalendarFactory;
