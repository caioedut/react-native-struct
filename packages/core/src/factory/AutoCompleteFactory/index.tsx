// @ts-nocheck
import React, { forwardRef, useCallback, useRef, useState } from 'react';

import useTheme from '../../hooks/useTheme';
import Times from '../../icons/Times';
import factory2 from '../../props/factory2';
import { AutoCompleteProps, SelectOption } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';
import ButtonFactory from '../ButtonFactory';
import CardFactory from '../CardFactory';
import OutlineFactory from '../OutlineFactory';
import TextFactory from '../TextFactory';

const AutoCompleteFactory = React.memo<AutoCompleteProps>(
  forwardRef(({ stylist, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.AutoComplete;
    const { svg, Input } = global.mapping;

    // Extends from default props
    let {
      error,
      color,
      options: arrOptions,
      // Styles
      variants,
      style,
      ...rest
    } = factory2<AutoCompleteProps>(props, options);

    const [search, setSearch] = useState('');
    const [items, setItems] = useState([]);

    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef();

    color = theme.color(error ? 'error' : color || 'primary');

    style = [
      isFocused && { borderColor: color },
      // !disabled && {
      //   borderColor: !error && !focused && !colorful ? 'gray.light' : color,
      // },

      style,
    ];

    const focus = useCallback(() => {
      inputRef.current?.focus();
    }, [inputRef]);

    const add = useCallback((item: SelectOption) => {
      setItems((current) => [...current, item]);
    }, []);

    const remove = useCallback((item: SelectOption) => {
      setItems((current) => current.filter(({ value }) => value !== item.value));
    }, []);

    const filteredOptions = (arrOptions || []).filter((option) => {
      const searchValue = `${search ?? ''}`.trim();

      if (searchValue && !option.label.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }

      return !items.some(({ value }) => value === option.value);
    });

    const handleFocus = () => {
      setIsFocused(true);
      setActiveIndex(0);
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsFocused(false);
        setActiveIndex(-1);
      }, 100);
    };

    const handleSubmit = (e) => {
      e?.preventDefault?.();

      const newItem = search.trim();

      if (newItem) {
        setSearch('');
        add({ label: newItem, value: newItem });
      }

      focus();
    };

    const handleAdd = (e, item: SelectOption) => {
      add(item);
      focus();
    };

    const handleRemove = (e, item: SelectOption) => {
      remove(item);
      focus();
    };

    const handleKeyDown = (e) => {
      const { key } = e;
      const isVisible = activeIndex >= 0;

      let newIndex = 0;

      if (key === 'Enter') {
        e?.preventDefault?.();

        newIndex = isVisible ? -1 : 0;

        const item = filteredOptions?.[activeIndex];

        if (item) {
          setSearch('');
          add(item);
        }
      }

      if (key === 'Escape' && isVisible) {
        e?.preventDefault?.();
        newIndex = -1;
      }

      if (key === 'Backspace' && !search && items.length) {
        e?.preventDefault?.();
        remove(items.at(-1));
      }

      if (newIndex >= 0) {
        if (key === 'ArrowUp') {
          newIndex = activeIndex - 1;
        }

        if (key === 'ArrowDown') {
          newIndex = activeIndex + 1;
        }

        if (key === 'Home') {
          newIndex = 0;
        }

        if (key === 'End') {
          newIndex = filteredOptions.length - 1;
        }

        if (newIndex >= filteredOptions.length) {
          newIndex = 0;
        }

        if (newIndex < 0) {
          newIndex = filteredOptions.length - 1;
        }

        if (newIndex !== activeIndex) {
          e?.preventDefault?.();
        }
      }

      setActiveIndex(newIndex);
    };

    return (
      <>
        <OutlineFactory
          ref={ref}
          visible={isFocused}
          color={color}
          style={style}
          stylist={[variants.root, stylist]}
          {...rest}
          onPress={focus}
        >
          {items.map((item, index) => (
            <BoxFactory key={index} stylist={[variants.item]}>
              <TextFactory flex>{item.label}</TextFactory>
              <ButtonFactory
                circular
                variant="text"
                color="text"
                size="xsmall"
                m={-1}
                ml={1}
                onPress={(e) => handleRemove(e, item)}
              >
                <Times svg={svg} color={theme.color('text')} />
              </ButtonFactory>
            </BoxFactory>
          ))}

          <BoxFactory
            ref={inputRef}
            noRootStyles
            component={Input}
            value={search}
            stylist={[variants.input]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setSearch(e.target.value)}
            // onKeyDown={(e) => (e.key === 'Enter' || e.keyCode === 13) && handleSubmit(e)}
            onKeyDown={handleKeyDown}
          />

          {activeIndex >= 0 && (
            <CardFactory overflow="hidden" position="absolute" t="100%" l={0} shadow={1} w="100%" mt={1} p={0}>
              {filteredOptions?.map((option, index) => {
                const isActive = index === activeIndex;

                return (
                  <BoxFactory
                    key={index}
                    p={2}
                    bg={isActive && 'background.secondary'}
                    onPress={(e) => handleAdd(e, option)}
                  >
                    <TextFactory>{option.label}</TextFactory>
                  </BoxFactory>
                );
              })}
            </CardFactory>
          )}
        </OutlineFactory>
      </>
    );
  }),
);

AutoCompleteFactory.displayName = 'AutoCompleteFactory';

export default AutoCompleteFactory;
