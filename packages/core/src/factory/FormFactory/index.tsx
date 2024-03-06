import React, {
  ForwardedRef,
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import { FormField, FormProps, FormRef, RbkFormEvent } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';

const Context = createContext<FormRef>(null as any);

export const useForm = () => useContext<FormRef>(Context);

const FormFactory = React.memo<FormProps>(
  forwardRef(({ stylist, ...props }, ref: ForwardedRef<FormRef>) => {
    const theme = useTheme();
    const options = theme.components.Form;
    const { web, Form } = global.mapping;

    // Extends from default props
    const {
      data,
      errors,
      // Events
      onSubmit,
      onCancel,
      onClear,
      onChange,
      // Styles
      variants,
      ...rest
    } = factory2<FormProps>(props, options);

    const defaultRef = useRef(null);
    const formRef = useRef<ReactNode>(null);
    const fieldsRef = useRef<FormField[]>([]);
    const dataRef = useRef<any>({});

    ref = ref || defaultRef;

    if (web) {
      rest.noValidate = true;
    }

    const getField = useCallback(
      (name: string): FormField | undefined => {
        return fieldsRef.current.find((item) => item?.name === name);
      },
      [fieldsRef],
    );

    const setField = useCallback(
      (options: FormField) => {
        const { name } = options;
        let field = getField(name);

        if (field) {
          Object.getOwnPropertyNames(field).forEach((prop) => delete field?.[prop]);
          Object.assign(field, options);
        } else {
          field = options;
          fieldsRef.current.push(options);
        }

        const newValue = field.get();

        if (dataRef.current[name] !== newValue) {
          dataRef.current[name] = newValue;
          dispatchEvent('change', field);
        }
      },
      [dataRef, fieldsRef, getField, dispatchEvent],
    );

    const unsetField = useCallback(
      (name: string) => {
        fieldsRef.current = fieldsRef.current.filter((item) => item?.name !== name);
      },
      [fieldsRef],
    );

    const getValue = useCallback((name: string): any => getField(name)?.get?.(), [getField]);

    const setValue = useCallback((name: string, value: any) => getField(name)?.set?.(value), [getField]);

    const getData = useCallback(() => {
      const data = {};

      fieldsRef.current.forEach(({ name, get }) => (data[name] = get()));

      return data;
    }, [fieldsRef]);

    const setData = useCallback(
      (data: any = {}) => {
        Object.keys(Object(data)).forEach((attr) => {
          const field = getField(attr);

          if (field) {
            const value = data[attr];

            if (value !== field.get()) {
              field.set(value);
            }
          }
        });
      },
      [getField],
    );

    const setErrors = useCallback(
      (errors: FormProps['errors']) => {
        fieldsRef.current.forEach((item) => {
          item?.setError?.(errors?.[item.name] ?? false);
        });
      },
      [fieldsRef],
    );

    function dispatchEvent(type: string, field?: FormField, nativeEvent?: any) {
      const callback = {
        change: onChange,
        submit: onSubmit,
        cancel: onCancel,
        clear: onClear,
      }[type];

      const target = formRef.current;
      const data = getData();

      const event: RbkFormEvent = {
        type,
        name: field?.name,
        target,
        form: context,
        nativeEvent,
      };

      if (type === 'change') {
        fieldsRef.current.forEach(({ onFormChange }) => onFormChange?.(event, data));
      }

      if (typeof callback === 'function') {
        callback(event, data);
      }
    }

    function submit(e?: any) {
      e?.preventDefault?.();
      const nativeEvent = e?.nativeEvent ?? e;
      dispatchEvent('submit', undefined, nativeEvent);
    }

    function cancel(e?: any) {
      e?.preventDefault?.();
      const nativeEvent = e?.nativeEvent ?? e;
      dispatchEvent('cancel', undefined, nativeEvent);
    }

    function clear(e?: any) {
      e?.preventDefault?.();
      const nativeEvent = e?.nativeEvent ?? e;

      fieldsRef.current.forEach(({ set }) => set(null));
      setErrors(null);

      dispatchEvent('clear', undefined, nativeEvent);
    }

    const context = {
      submit,
      cancel,
      clear,
      getData,
      setData,
      setErrors,
      getValue,
      setValue,
      getField,
      setField,
      unsetField,
      target: formRef.current,
    };

    useImperativeHandle(ref, () => context, [context]);

    useEffect(() => {
      // @ts-ignore
      Object.assign(ref?.current || {}, { target: formRef.current });
    }, [ref, formRef]);

    useEffect(() => {
      setData(data || {});
    }, [data, setData]);

    useEffect(() => {
      setErrors(errors);
    }, [errors, setErrors]);

    return (
      <Context.Provider value={context}>
        <BoxFactory ref={formRef} component={Form} stylist={[variants.root, stylist]} {...rest} onSubmit={submit} />
      </Context.Provider>
    );
  }),
);

FormFactory.displayName = 'FormFactory';

export default FormFactory;
