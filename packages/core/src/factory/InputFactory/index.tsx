import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import reference from '../../element/reference';
import useHtmlId from '../../hooks/useHtmlId';
import useTheme from '../../hooks/useTheme';
import ChevronDown from '../../icons/ChevronDown';
import ChevronUp from '../../icons/ChevronUp';
import extract from '../../props/extract';
import factory2 from '../../props/factory2';
import get from '../../props/get';
import { customStyleProps } from '../../styles/constants';
import { AnyObject, InputProps, InputValue, RbkInputEvent, RequiredSome } from '../../types';
import defined from '../../utils/defined';
import global from '../../utils/global';
import pick from '../../utils/pick';
import string from '../../utils/string';
import BoxFactory from '../BoxFactory';
import ButtonFactory from '../ButtonFactory';
import { useForm } from '../FormFactory';
import LabelFactory from '../LabelFactory';
import TextFactory from '../TextFactory';

const InputFactory = React.memo<InputProps>(
  forwardRef(({ stylist, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Input;
    const { web, native, svg, Input, TextArea } = global.mapping;

    // Extends from default props
    let {
      _internalTriggerChange = false,
      autoCapitalize,
      autoCorrect,
      autoComplete,
      caretHidden,
      color,
      colorful,
      controlled,
      defaultValue,
      disabled,
      endAddon,
      endIcon,
      error: errorProp,
      hidden,
      hint,
      id,
      inputMode,
      label,
      mask,
      max,
      maxLength,
      min,
      multiline,
      name,
      notNull,
      placeholderColor,
      readOnly,
      returnKeyType,
      rows,
      secure,
      selectionColor,
      selectTextOnFocus,
      size,
      startAddon,
      startIcon,
      textColor,
      type,
      unmask,
      value,
      // Events
      onChange,
      onFocus,
      onBlur,
      onFormChange,
      onSubmit,
      // Styles
      variants,
      contentStyle,
      errorStyle,
      hintStyle,
      inputStyle,
      labelStyle,
      style,
      ...rest
    } = factory2<RequiredSome<InputProps, 'autoCapitalize' | 'color' | 'returnKeyType' | 'size' | 'type'>>(
      props,
      options,
    );

    id = useHtmlId(id);

    const form = useForm();
    const inputRef = useRef<any>(null);

    const [initialValue] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState<InputProps['error']>();
    const [_internal, _setInternal] = useState(value ?? initialValue);

    const maskValue = useCallback(
      (value) => {
        value = typeof mask === 'function' ? mask(value) : value;
        return `${value ?? ''}`; // React Native only accepts STRING
      },
      [mask],
    );

    const unmaskValue = useCallback(
      (value) => {
        let emptyValue: InputValue = '';

        if (maxLength) {
          value = `${value ?? ''}`.substring(0, maxLength);
        }

        // Number parser
        if (type === 'number') {
          emptyValue = 0;

          if (value) {
            value = Number(value);
          }

          if (defined(value)) {
            if (defined(min) && value < (min as number)) {
              value = min;
            }

            if (defined(max) && value > (max as number)) {
              value = max;
            }
          }
        }

        if (typeof unmask === 'function') {
          value = unmask(value);
        }

        if (!notNull && [undefined, null, NaN, ''].includes(value)) {
          return null;
        }

        return value ?? emptyValue;
      },
      [maxLength, type, unmask, notNull, min, max],
    );

    const resolveValue = useCallback(
      (value) => {
        return unmaskValue(maskValue(value));
      },
      [maskValue, unmaskValue],
    );

    const internal = useMemo(() => {
      return resolveValue(_internal);
    }, [_internal, resolveValue]);

    const setInternal = useCallback(
      (value) => {
        if (controlled) return;
        _setInternal(value);
      },
      [controlled],
    );

    color = theme.color(error ? 'error' : color || 'primary');
    selectionColor = theme.color(selectionColor ?? color);
    placeholderColor = theme.color(
      // @ts-expect-error
      placeholderColor ?? get('color', inputStyle) ?? options.defaultStyles.input?.color ?? 'text.primary',
      0.4,
    );
    const shadowColor = theme.color(color, 0.3);

    autoCapitalize = !autoCapitalize ? 'none' : autoCapitalize;
    startAddon = startAddon ?? startIcon;
    endAddon = endAddon ?? endIcon;

    if (web) {
      Object.assign(rest, {
        autoCapitalize,
        autoCorrect: autoCorrect ? 'on' : 'off',
        enterKeyHint: returnKeyType,
        disabled,
        readOnly,
        type:
          pick(secure ? 'password' : type, 'default', {
            default: type,
            password: 'password',
            phone: 'tel',
            hidden: 'text',
          }) || 'text',
      });

      if (typeof onSubmit === 'function') {
        Object.assign(rest, {
          onKeyDown: (e) => (e.key === 'Enter' || e.keyCode === 13) && handleSubmit(e),
        });
      }
    }

    if (native) {
      Object.assign(rest, {
        autoCapitalize,
        autoCorrect,
        caretHidden,
        multiline,
        editable: disabled ? false : !readOnly,
        keyboardAppearance: theme.mode,
        placeholderTextColor: placeholderColor,
        returnKeyType: returnKeyType === 'default' ? 'done' : returnKeyType,
        secureTextEntry: type === 'password' || secure,
        selectionColor,
        selectTextOnFocus,
        cursorColor: selectionColor,
        underlineColorAndroid: 'transparent',
        keyboardType: pick(type, 'text', {
          text: 'default',
          number: 'number-pad',
          email: 'email-address',
          phone: 'phone-pad',
          url: 'url',
          hidden: 'default',
        }),
      });

      if (typeof onSubmit === 'function') {
        Object.assign(rest, {
          onSubmitEditing: handleSubmit,
        });
      }
    }

    if (typeof size === 'string') {
      size = pick(size, 'medium', {
        xsmall: 1.25,
        small: 1.75,
        medium: 2.25,
        large: 2.75,
        xlarge: 3.25,
      });
    }

    const baseSize = theme.rem(size as number);
    const spacing = (baseSize - theme.rem()) / 2;
    const height = multiline ? theme.rem() * (rows ?? 6) + spacing * 2 : baseSize;

    const focus = useCallback(() => inputRef?.current?.focus?.(), [inputRef]);
    const blur = useCallback(() => inputRef?.current?.blur?.(), [inputRef]);
    const clear = useCallback(() => setInternal(initialValue), [initialValue, setInternal]);
    const isFocused = useCallback(
      () => Boolean(inputRef?.current?.isFocused?.()) || inputRef?.current === document?.activeElement,
      [inputRef],
    );

    const dispatchEvent = useCallback(
      (
        type: string,
        newValue: InputValue,
        event: AnyObject | null,
        eventHandler?: (event: RbkInputEvent, value: InputValue) => void,
      ) => {
        const nativeEvent = event?.nativeEvent ?? event ?? null;
        const value = resolveValue(newValue) ?? null;

        if (type === 'change') {
          setInternal(value);
        }

        if (eventHandler instanceof Function) {
          eventHandler(
            {
              type,
              value,
              name,
              target: inputRef.current,
              form,
              focus,
              blur,
              clear,
              isFocused,
              nativeEvent,
            },
            value,
          );
        }
      },
      [inputRef, name, form, focus, blur, clear, isFocused, resolveValue, setInternal],
    );

    useEffect(() => {
      // TODO (?)
      // dispatchEvent('change', value, null, onChange);

      if (typeof value === 'undefined') return;
      _setInternal(value);
    }, [value]);

    useEffect(() => {
      if (_internalTriggerChange) {
        dispatchEvent('change', value, {}, onChange);
      }
    }, [value, _internalTriggerChange]);

    useEffect(() => {
      setError(errorProp);
    }, [errorProp]);

    useEffect(() => {
      if (!name || !form) return;

      form.setField({
        name,
        get: () => internal ?? null,
        set: (value) => dispatchEvent('change', value, null, onChange),
        setError,
        onFormChange,
      });

      return () => {
        form.unsetField(name as string);
      };
    }, [name, form, internal, dispatchEvent, onChange, onFormChange]);

    const handleChange = (event) => {
      if (disabled || readOnly) return;

      const value = event?.value ?? event?.target?.value ?? event?.nativeEvent?.text;
      dispatchEvent('change', value, event, onChange);
    };

    const handleIncDec = (event, signal) => {
      const value = Number(internal || 0) + (signal || 1);
      dispatchEvent('change', value, event, onChange);
    };

    const handleFocus = (event) => {
      setFocused(true);

      if (web) {
        if (selectTextOnFocus) {
          inputRef.current?.select();
        } else {
          const end = string(internal).length;
          inputRef.current?.setSelectionRange(end, end);
        }
      }

      dispatchEvent('focus', internal, event, onFocus);
    };

    const handleBlur = (event) => {
      setFocused(false);
      dispatchEvent('blur', internal, event, onBlur);
    };

    function handleSubmit(event) {
      event?.preventDefault();
      dispatchEvent('submit', internal, event, onSubmit);
    }

    // @ts-expect-error
    style = [extract(customStyleProps, rest), style];

    labelStyle = [error && { color: 'error' }, labelStyle];

    hintStyle = [error && { color: 'error' }, hintStyle];

    contentStyle = [
      !disabled && {
        borderColor: !error && !focused && !colorful ? 'gray.light' : color,
      },

      web &&
        focused && {
          boxShadow: `0 0 0 4px ${shadowColor}`,
        },

      contentStyle,
    ];

    inputStyle = [
      {
        height,
        paddingHorizontal: spacing,
      },

      textColor && { color: textColor },

      web && { paddingVertical: spacing },

      web && { caretColor: caretHidden ? theme.colors.common.trans : selectionColor },

      web &&
        placeholderColor && {
          '&::-webkit-input-placeholder': { color: placeholderColor },
          '&::-ms-input-placeholder': { color: placeholderColor },
          '&::placeholder': { color: placeholderColor },
        },

      web &&
        selectionColor && {
          '&::selection': { backgroundColor: selectionColor, color: theme.contrast(selectionColor) },
        },

      inputStyle,
    ];

    return (
      <BoxFactory hidden={hidden || type === 'hidden'} style={style} stylist={[variants.root, stylist]}>
        {Boolean(label) && (
          <LabelFactory
            numberOfLines={1}
            for={id}
            forRef={inputRef}
            style={labelStyle}
            stylist={[variants.label]}
            onPress={native ? focus : undefined}
          >
            {label}
          </LabelFactory>
        )}

        <BoxFactory style={contentStyle} stylist={[variants.content]}>
          {native && focused && (
            <BoxFactory
              position="absolute"
              pointerEvents="none"
              border={`4px solid ${shadowColor}`}
              corners={get('corners', options.defaultStyles.content, contentStyle)}
              borderRadius={get('borderRadius', options.defaultStyles.content, contentStyle)}
              style={{ inset: -4 }}
            />
          )}

          <BoxFactory row noWrap alignItems="center" justifyContent="space-between" style={{ marginVertical: -1 }}>
            {Boolean(startAddon) && (
              <BoxFactory style={{ marginLeft: spacing }} onPress={focus}>
                {startAddon}
              </BoxFactory>
            )}

            <BoxFactory
              ref={reference(ref, inputRef)}
              component={multiline ? TextArea : Input}
              style={inputStyle}
              stylist={[variants.input]}
              {...rest}
              noRootStyles
              id={id}
              autoComplete={autoComplete}
              disabled={disabled}
              inputMode={inputMode}
              maxLength={maxLength}
              name={name}
              value={maskValue(unmaskValue(internal))}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {type === 'number' && (
              <BoxFactory h={baseSize} style={{ marginRight: spacing / (endAddon ? 1 : 2) }}>
                {[+1, -1].map((item) => {
                  const isInc = item > 0;
                  const Icon = isInc ? ChevronUp : ChevronDown;

                  return (
                    <ButtonFactory
                      key={item}
                      variant="text"
                      color={color}
                      size={(size as number) / 2}
                      disabled={disabled}
                      h="50%"
                      p={0}
                      accessibility={{ label: isInc ? 'plus' : 'minus' }}
                      contentStyle={{ align: isInc ? 'end' : 'start' }}
                      onPress={(e) => handleIncDec(e, item)}
                    >
                      <Icon svg={svg} size={Math.round(baseSize * 0.45)} color={color} />
                    </ButtonFactory>
                  );
                })}
              </BoxFactory>
            )}

            {Boolean(endAddon) && (
              <BoxFactory style={{ marginRight: spacing }} onPress={focus}>
                {endAddon}
              </BoxFactory>
            )}
          </BoxFactory>
        </BoxFactory>

        {Boolean(hint) && (
          <TextFactory variant="caption" style={hintStyle} stylist={[variants.hint]}>
            {hint}
          </TextFactory>
        )}

        {Boolean(error) && typeof error === 'string' && (
          <TextFactory variant="caption" style={errorStyle} stylist={[variants.error]}>
            {error}
          </TextFactory>
        )}
      </BoxFactory>
    );
  }),
);

InputFactory.displayName = 'InputFactory';

export default InputFactory;
