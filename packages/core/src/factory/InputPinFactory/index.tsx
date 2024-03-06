import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import { InputPinProps, RequiredSome } from '../../types';
import defined from '../../utils/defined';
import global from '../../utils/global';
import pick from '../../utils/pick';
import string from '../../utils/string';
import BoxFactory from '../BoxFactory';
import GridFactory from '../GridFactory';
import InputFactory from '../InputFactory';

const InputPinFactory = React.memo<InputPinProps>(
  forwardRef(({ stylist, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.InputPin;
    const { web } = global.mapping;

    // Extends from default props
    let {
      autoFocus,
      color,
      colorful,
      defaultValue,
      disabled,
      length,
      name,
      notNull,
      placeholder,
      placeholderColor,
      readOnly,
      returnKeyType,
      secure,
      size,
      textColor,
      type,
      value,
      // Events
      onChange,
      onFormChange,
      onSubmit,
      // Styles
      variants,
      inputStyle,
      ...rest
    } = factory2<RequiredSome<InputPinProps, 'length'>>(props, options);

    const resolveValue = useCallback(
      (value) => {
        value = string(value).replace(/[^0-9a-zA-Z]/g, '');

        if (type === 'alphabetic') {
          value = value.replace(/[^a-zA-Z]/g, '');
        }

        if (type === 'numeric') {
          value = value.replace(/\D/g, '');
        }

        return value.slice(0, length);
      },
      [type, length],
    );

    const inputRefs = useRef<any>([]);
    const [focused, setFocused] = useState(-1);

    const [digits, _setDigits] = useState<string[]>(resolveValue(defaultValue ?? value).split(''));

    const setDigits: typeof _setDigits = useCallback(
      (value) => {
        _setDigits((current) => {
          const newValue = [...(value instanceof Function ? value(current) : value)];

          while (newValue.length < length) {
            newValue.push('');
          }

          return newValue.slice(0, length);
        });
      },
      [length],
    );

    if (typeof size === 'string') {
      size = pick(size, 'medium', {
        xsmall: 1.25,
        small: 1.75,
        medium: 2.25,
        large: 2.75,
        xlarge: 3.25,
      });
    }

    const inputSize = theme.rem(size as number);

    inputStyle = [
      {
        textAlign: 'center',
        px: 0,
        flex: 0,
        h: inputSize,
        w: inputSize * 0.9,
      },

      inputStyle,
    ];

    useEffect(() => {
      if (typeof value === 'undefined') return;
      setDigits(value);
    }, [value]);

    const focusOnInput = useCallback(
      (index: number) => {
        const input = inputRefs.current?.[index];
        input?.focus();

        if (web) {
          input?.setSelectionRange(0, 0);
        }
      },
      [web],
    );

    const handleFocus = (_, index: number) => {
      setFocused(index);
      focusOnInput(index);
    };

    const handlePress = (_, index: number) => {
      focusOnInput(index);
    };

    const handleKey = (event, index: number) => {
      const { key } = event.nativeEvent;

      // Ignore modifier keys
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      let digitValue;
      let focusInput;

      if (key === 'Home') {
        focusInput = inputRefs.current?.[0];
      }

      if (key === 'End') {
        focusInput = inputRefs.current?.[length - 1];
      }

      if (key === 'PageUp') {
        focusInput = inputRefs.current?.[Math.max(index - 2, 0)];
      }

      if (key === 'PageDown') {
        focusInput = inputRefs.current?.[Math.min(index + 2, length - 1)];
      }

      if (['ArrowLeft', 'ArrowUp'].includes(key)) {
        focusInput = inputRefs.current?.[index - 1];
      }

      if (['ArrowRight', 'ArrowDown'].includes(key)) {
        focusInput = inputRefs.current?.[index + 1];
      }

      if (['Backspace', 'Delete'].includes(key)) {
        digitValue = '';
        focusInput = inputRefs.current?.[index - 1];
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.nativeEvent?.preventDefault();
      }

      if (defined(focusInput)) {
        focusInput.focus();
      }

      if (defined(digitValue)) {
        setDigits((current) => {
          current[index] = digitValue;
          return [...current];
        });
      }
    };

    const handleChange = (event, index) => {
      if (disabled || readOnly) {
        return;
      }

      let newDigits = resolveValue(event.value).split('');
      if (newDigits.length < length) {
        newDigits = newDigits.slice(0, 1);
      }

      if (newDigits.length) {
        setDigits((current) => {
          newDigits.forEach((newDigit, newDigitIndex) => {
            current[index + newDigitIndex] = newDigit;
          });

          return [...current];
        });

        setTimeout(() => {
          focusOnInput(Math.min(length - 1, index + newDigits.length));
        }, 10);
      }
    };

    return (
      <BoxFactory ref={ref} stylist={[variants.root, stylist]} {...rest}>
        <InputFactory
          _internalTriggerChange
          hidden
          name={name}
          notNull={notNull}
          secure={secure}
          value={digits.join('')}
          onChange={onChange}
          onFormChange={onFormChange}
        />

        <GridFactory row noWrap gap>
          {Array.from({ length }).map((_, index) => {
            const isLast = index === inputRefs.current.length - 1;

            return (
              <BoxFactory key={index}>
                <InputFactory
                  ref={($el) => (inputRefs.current[index] = $el)}
                  caretHidden
                  controlled
                  autoCapitalize="none"
                  autoComplete="one-time-code"
                  autoCorrect={false}
                  autoFocus={autoFocus && index === 0}
                  color={color}
                  colorful={colorful}
                  disabled={disabled}
                  inputMode={type === 'numeric' ? 'numeric' : 'text'}
                  inputStyle={inputStyle}
                  placeholder={focused === index ? undefined : placeholder?.[index]}
                  placeholderColor={placeholderColor}
                  readOnly={readOnly}
                  returnKeyType={isLast ? returnKeyType : 'next'}
                  secure={secure}
                  selectTextOnFocus={false}
                  size={size}
                  textColor={textColor}
                  value={digits[index]}
                  onChange={(e) => handleChange(e, index)}
                  onSubmit={isLast ? onSubmit : () => inputRefs.current[index + 1].focus()}
                  onFocus={(e) => handleFocus(e, index)}
                  onBlur={() => setFocused(-1)}
                  onPress={(e) => handlePress(e, index)}
                  platform={{
                    web: {
                      onKeyDown: (e) => handleKey(e, index),
                    },
                    native: {
                      selection: { start: 0, end: 0 },
                      onKeyPress: (e) => handleKey(e, index),
                    },
                  }}
                />
              </BoxFactory>
            );
          })}
        </GridFactory>
      </BoxFactory>
    );
  }),
);

InputPinFactory.displayName = 'InputPinFactory';

export default InputPinFactory;
