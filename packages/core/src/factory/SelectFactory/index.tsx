import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useTheme } from '../../ReactBulk';
import extract from '../../props/extract';
import factory from '../../props/factory';
import { spacings } from '../../styles/jss';
import { AnyObject, FactoryProps, SelectProps } from '../../types';
import useHtmlId from '../../useHtmlId';
import useStylist from '../../useStylist';
import pick from '../../utils/pick';
import BackdropFactory from '../BackdropFactory';
import BoxFactory from '../BoxFactory';
import ButtonFactory from '../ButtonFactory';
import CardFactory from '../CardFactory';
import { useForm } from '../FormFactory';
import LabelFactory from '../LabelFactory';
import LoadingFactory from '../LoadingFactory';
import ScrollableFactory from '../ScrollableFactory';
import TextFactory from '../TextFactory';

function SelectFactory({ stylist, map, innerRef, ...props }: FactoryProps & SelectProps) {
  const theme = useTheme();
  const options = theme.components.Select;
  const { web, native, dimensions, Input } = map;

  // Extends from default props
  let {
    defaultValue,
    id,
    color,
    error,
    label,
    loading,
    name,
    options: arrOptions,
    placeholder,
    readOnly,
    size,
    value,
    // Events
    onChange,
    onFormChange,
    // Styles
    buttonStyle,
    errorStyle,
    labelStyle,
    style,
    ...rest
  } = factory(props, options.defaultProps);

  id = useHtmlId(id);

  const form = useForm();
  const defaultRef: any = useRef(null);
  const buttonRef = innerRef || defaultRef;
  const scrollRef: any = useRef(null);
  const selectedRef: any = useRef(null);
  const optionsRef: any = useRef([]);

  const [metrics, setMetrics] = useState<AnyObject>({});
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState(arrOptions?.find((item) => item.value == defaultValue));
  const [activeIndex, setActiveIndex] = useState(arrOptions?.findIndex((item) => item.value == defaultValue));

  const gutter = theme.spacing(3);

  const nativeProps = !native ? {} : { onRequestClose: () => setVisible(false) };

  if (typeof size === 'string') {
    size = pick(size, 'medium', {
      xsmall: 0.625,
      small: 0.75,
      medium: 1,
      large: 1.25,
      xlarge: 1.625,
    });
  }

  const fontSize = theme.rem(size);
  const spacing = theme.rem(0.5, fontSize);

  useEffect(() => {
    if (typeof value === 'undefined') return;
    setInternal(arrOptions?.find((item) => item.value == value));
  }, [value, arrOptions]);

  useEffect(() => {
    if (!name || !form) return;

    form.setField({
      name,
      set: setInternal,
      get: () => internal?.value,
      onFormChange,
    });

    return () => {
      form.unsetField(name);
    };
  }, [name, form, onFormChange, internal]);

  useEffect(() => {
    if (!visible || !selectedRef.current) return;

    if (web) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }

    if (native) {
      setTimeout(() => {
        if (selectedRef.current && scrollRef.current) {
          // @ts-ignore
          selectedRef.current.measureLayout(scrollRef.current, (left, top) => {
            const y = Math.max(0, top - metrics?.maxHeight / 2);
            scrollRef.current.scrollTo({ x: 0, y, animated: true });
          });
        }
      }, 100);
    }
  }, [visible]);

  const focus = useCallback(() => buttonRef?.current?.focus?.(), [buttonRef]);
  const blur = useCallback(() => buttonRef?.current?.blur?.(), [buttonRef]);
  const clear = useCallback(() => setInternal(arrOptions?.find((item) => item.value == defaultValue)), []);
  const isFocused = useCallback(() => buttonRef?.current?.isFocused?.() || buttonRef?.current === document?.activeElement, [buttonRef]);

  function dispatchEvent(type: string, option, nativeEvent?: any) {
    const callback = {
      change: onChange,
    }[type];

    if (typeof callback === 'function') {
      const target = buttonRef.current;
      const value = option?.value;
      callback({ type, value, name, target, focus, blur, clear, isFocused, nativeEvent }, value, option);
    }
  }

  const handleOpen = () => {
    const callback = ({ top, left, height, width }) => {
      const newMetrics: any = { left, width };

      if (top <= dimensions.height / 2) {
        newMetrics.top = Math.max(gutter, top + height);
      } else {
        newMetrics.bottom = Math.max(gutter, dimensions.height - top);
      }

      const sub = (newMetrics.top || 0) + (newMetrics.bottom || 0);
      newMetrics.maxHeight = Math.min(theme.rem(20), dimensions.height - gutter - sub);
      newMetrics.maxWidth = dimensions.width - gutter * 2;

      setMetrics(newMetrics);
      setVisible((current) => (readOnly ? false : !current));
    };

    if (web) {
      callback(buttonRef.current.getBoundingClientRect());
    }

    if (native) {
      // @ts-ignore
      buttonRef.current.measure((x, y, width, height, left, top) => callback({ top, left, height, width }));
    }
  };

  const handleChange = (e, option, autoFocus = false) => {
    const nativeEvent = e?.nativeEvent ?? e;

    setInternal(arrOptions?.find((item) => item.value == option.value));
    setVisible(false);

    dispatchEvent('change', option, nativeEvent);

    if (autoFocus) {
      setTimeout(focus, 100);
    }
  };

  const handleChangeBrowser = (e) => {
    const option = arrOptions.find((item) => item.value == e.target.value);
    handleChange(e, option, false);
  };

  const handleKeyDown = (e) => {
    const { code } = e;

    let newIndex = activeIndex;

    if (!['Enter', 'Escape'].includes(code)) {
      e?.preventDefault?.();
    }

    if (code === 'Escape') {
      return setVisible(false);
    }

    if (code === 'ArrowUp') {
      newIndex -= 1;
    }

    if (code === 'ArrowDown') {
      newIndex += 1;
    }

    if (code === 'Home') {
      newIndex = 0;
    }

    if (code === 'End') {
      newIndex = arrOptions.length - 1;
    }

    if (code === 'PageUp') {
      newIndex = Math.max(newIndex - 3, 0);
    }

    if (code === 'PageDown') {
      newIndex = Math.min(newIndex + 3, arrOptions.length - 1);
    }

    if (newIndex >= arrOptions.length) {
      newIndex = 0;
    }

    if (newIndex < 0) {
      newIndex = arrOptions.length - 1;
    }

    optionsRef?.current?.[newIndex]?.focus?.();
    setActiveIndex(newIndex);
  };

  const styleRoot = useStylist({
    name: arrOptions.name,
    style: options.defaultStyles.root,
  });

  const styleLabel = useStylist({
    name: options.name + '-label',
    style: options.defaultStyles.label,
  });

  const styleError = useStylist({
    name: options.name + '-error',
    style: options.defaultStyles.error,
  });

  const styleState = useStylist({
    style: extract(spacings, rest),
  });

  return (
    <BoxFactory map={map} style={style} stylist={[styleRoot, styleState, stylist]} onKeyDown={handleKeyDown}>
      {Boolean(label) && (
        <LabelFactory map={map} numberOfLines={1} for={buttonRef} style={labelStyle} stylist={[styleLabel]}>
          {label}
        </LabelFactory>
      )}

      <ButtonFactory
        innerRef={buttonRef}
        map={map}
        block
        color={color}
        endIcon={
          loading ? (
            <LoadingFactory map={map} />
          ) : (
            <TextFactory map={map} color={color} style={{ fontSize, transform: [{ scaleY: 0.65 }] }}>
              {visible ? '▲' : '▼'}
            </TextFactory>
          )
        }
        {...rest}
        id={id}
        size={size}
        variant="outline"
        style={[{ paddingHorizontal: spacing }, buttonStyle]}
        contentStyle={{ flex: 1 }}
        onPress={handleOpen}
      >
        <TextFactory map={map}>{internal?.label ?? internal?.value ?? placeholder ?? ''}</TextFactory>
      </ButtonFactory>

      {Boolean(error) && typeof error === 'string' && (
        <TextFactory map={map} variant="caption" style={errorStyle} stylist={[styleError]}>
          {error}
        </TextFactory>
      )}

      {web && (
        <Input //
          hidden
          type="text"
          name={name}
          readOnly={readOnly}
          value={`${internal?.value ?? ''}`}
          onChange={handleChangeBrowser}
        />
      )}

      <BackdropFactory map={map} visible={visible} style={{ bg: 'rgba(0, 0, 0, 0.2)' }} onPress={() => setVisible(false)} {...nativeProps}>
        <CardFactory map={map} position="absolute" p={0} style={[{ overflow: 'hidden' }, metrics]}>
          <ScrollableFactory map={map} innerRef={scrollRef} contentInset={1} maxh={metrics?.maxHeight} maxw={metrics?.maxWidth}>
            {arrOptions?.map((option, index) => {
              const isSelected = option.value == internal?.value;

              return (
                <ButtonFactory
                  key={option.value}
                  map={map}
                  size={size}
                  variant="text"
                  block
                  disabled={option.disabled}
                  bg={isSelected && theme.hex2rgba(color, 0.1)}
                  style={{ paddingHorizontal: spacing }}
                  contentStyle={{ flex: 1 }}
                  onPress={(e) => handleChange(e, option, true)}
                  endIcon={
                    <BoxFactory map={map} center w={fontSize} pl={1}>
                      {isSelected && (
                        <TextFactory map={map} color={color} style={{ fontSize: theme.rem(1.25, fontSize) }}>
                          ✓
                        </TextFactory>
                      )}
                    </BoxFactory>
                  }
                  innerRef={(el) => {
                    optionsRef.current[index] = el;

                    if (isSelected) {
                      selectedRef.current = el;
                    }
                  }}
                  platform={{
                    web: {
                      accessibility: {
                        role: 'option',
                        state: { selected: isSelected },
                      },
                    },
                  }}
                >
                  <TextFactory map={map}>{option.label}</TextFactory>
                </ButtonFactory>
              );
            })}
          </ScrollableFactory>
        </CardFactory>
      </BackdropFactory>
    </BoxFactory>
  );
}

export default React.memo(SelectFactory);
