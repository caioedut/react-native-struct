import { CSSProperties, JSXElementConstructor, ReactNode, Ref, RefObject, SyntheticEvent } from 'react';

import { customSpacings, styleProps, transformProps } from './styles/constants';

export type ReactElement = ReactNode | ReactNode[] | JSX.Element | JSX.Element[];

export type ReactOnlyElement = ReactNode | JSX.Element;

export type AnyObject = { [key: PropertyKey]: any };

export type TimeoutType = ReturnType<typeof setTimeout> | null;

export type IntervalType = ReturnType<typeof setInterval> | null;

export type InputValue = any;

export type Prettify<T> = { [K in keyof T]: T[K] };

export type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never;

export type Overwrite<T, NewT> = DistributiveOmit<T, keyof NewT> & NewT;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
      ? RecursivePartial<T[P]>
      : T[P];
};

/** @internal */
type StyleValue = undefined | null | false | AnyObject | (CSSProperties & StyleProps);

/** @internal */
export type RequiredSome<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/** @internal */
type PropsWithStyles<ALLOW_ANY, T1, T2 = {}> = Overwrite<BaseProps, Overwrite<T1, T2>> &
  (ALLOW_ANY extends true ? { [key: string | number]: any } : {});

/** @internal */
type ColorTypographyToken = 'text' | 'background';

/** @internal */
type ColorTypographyTone = 'primary' | 'secondary' | 'disabled';

/** @internal */
type ColorToken = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

/** @internal */
type ColorTone = 'main' | 'light' | 'lighter' | 'dark' | 'darker' | 'contrast';

/** @internal */
type CSSFlexJustify =
  | 'center'
  | 'stretch'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  // Aliases
  | 'start'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

/** @internal */
type CSSFlexAlign =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  // Aliases
  | 'start'
  | 'end';

/** @internal */
type StyleProps = Overwrite<
  Overwrite<
    {
      [K in (typeof styleProps)[number]]?: any;
    },
    {
      [K in (typeof customSpacings)[number]]?: number | string | true;
    }
  >,
  {
    position?: 'relative' | 'absolute' | (string & {});

    // Transform
    transform?: {
      [key in (typeof transformProps)[number]]?: any;
    };

    // Flexbox container
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: CSSFlexJustify;
    alignContent?: CSSFlexAlign;
    justifyItems?: CSSFlexJustify;
    alignItems?: CSSFlexAlign | 'baseline';

    // Flexbox item
    order?: number;
    grow?: number;
    shrink?: number;
    basis?: 'auto' | (string & {}) | (number & {});
    align?: CSSFlexAlign;
    justify?: CSSFlexJustify;

    h?: number | string | true;
    w?: number | string | true;
    minw?: number | string | true;
    maxw?: number | string | true;
    minh?: number | string | true;
    maxh?: number | string | true;
    hh?: number | string | true;
    ww?: number | string | true;

    bg?: string;
    border?: string | number | boolean;
    corners?: number;
    shadow?: number;
  }
>;

/** @internal */
export type SelectOption = {
  value: InputValue;
  disabled?: boolean;
  [key: string]: any;
} & (
  | {
      label: string;
      searchLabel?: string;
    }
  | {
      label: ReactElement;
      searchLabel: string;
    }
);

/** @internal */
export type TableColumn<RowData = any> = {
  header?: ReactElement | ((column: TableColumn<RowData>) => ReactElement);
  content?: ReactElement | ((row: RowData) => ReactElement);
  style?: RbkStyle;
};

/** @internal */
export type TabItem = Overwrite<
  DistributiveOmit<ButtonProps, 'children'>,
  {
    label: string;
    value?: string | number;
  }
>;

/** @internal */
export type FormField = {
  name: string;
  initialValue?: any;
  get: () => InputValue | null | undefined;
  set: (value: InputValue) => any;
  getError?: () => string | boolean | null | undefined;
  setError?: (error: string | boolean | null | undefined) => any;
  onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
};

export type FormRef = {
  initialData: AnyObject | undefined;
  cancel: () => any;
  reset: () => any;
  clear: () => any;
  getData: () => AnyObject;
  setData: (data: AnyObject) => any;
  getErrors: () => null | AnyObject;
  setErrors: (errors: FormProps['errors']) => any;
  getValue: (name: string) => InputValue | undefined;
  setValue: (name: string, value: InputValue) => any;
  submit: () => any;
  target: ReactElement;
  getField: (name: string) => FormField | null | undefined;
  setField: (options: FormField) => any;
  unsetField: (name: string) => any;
};

export type RbkMap = {
  web: boolean;
  native: boolean;
  ios: boolean;
  android: boolean;

  useDimensions: () => {
    width: number;
    height: number;
  };

  dimensions: {
    window: () => {
      width: number;
      height: number;
    };
  };

  svg: {
    [key: string]: ReactElement;
  };

  [key: string]: ReactElement | any;
};

export type RbkBreakpoints = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  [key: string]: number;
};

export type RbkUnit =
  | `${number}px`
  | `${number}%`
  | `${number}rem`
  | `${number}vw`
  | `${number}vh`
  | `${number}gap`
  | (number & {})
  | (string & {});

export type RbkUnitPixelable = number | `${number}px` | `${number}rem` | `${number}gap`;

export type RbkSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | (number & {});

export type RbkColor =
  | 'white'
  | 'black'
  | ColorTypographyToken
  | ColorToken
  | `${ColorTypographyToken}.${ColorTypographyTone}`
  | `${ColorToken}.${ColorTone}`
  | `${ColorTypographyToken}.${ColorTypographyTone}.${number}`
  | `${ColorToken}.${ColorTone}.${number}`
  | (string & {});

export type RbkRect = {
  width: number;
  height: number;

  /** Left offset relative to the Document */
  offsetX: number;

  /** Top offset relative to the Document */
  offsetY: number;

  /** Left offset relative to the Window */
  pageOffsetX: number;

  /** Top offset relative to the Window */
  pageOffsetY: number;
};

export type RbkAnimation = {
  to: RbkStyleProps;
  from?: RbkStyleProps;

  boomerang?: boolean;
  delay?: number;
  duration?: number;
  iterations?: number | 'infinite';
  throttle?: number;
  timing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

  web_useRawStyle?: boolean;
};

export type RbkTouch = {
  identifier: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
};

export type RbkEvent<EventType = any, TargetType = any> = {
  type: string;
  handler: 'RbkEvent';
  target: TargetType;
  currentTarget: TargetType;
  timestamp: number;
  nativeEvent: EventType;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export type RbkKeyboardEvent<EventType = any, TargetType = any> = Overwrite<
  RbkEvent<EventType, TargetType>,
  {
    handler: 'RbkKeyboardEvent';
    key: string;
    code: string;
    keyCode: number;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
  }
>;

export type RbkPointerEvent<EventType = any, TargetType = any> = Overwrite<
  RbkEvent<EventType, TargetType>,
  {
    handler: 'RbkPointerEvent';

    /**
     * The X position of the touch, relative to the element
     */
    offsetX: number;

    /**
     * The Y position of the touch, relative to the element
     */
    offsetY: number;

    /**
     * The X position of the touch, relative to the screen
     */
    pageX: number;

    /**
     * The Y position of the touch, relative to the screen
     */
    pageY: number;

    touches: RbkTouch[];
  }
>;

export type RbkScrollEvent<EventType = any, TargetType = any> = Overwrite<
  RbkEvent<EventType, TargetType>,
  {
    handler: 'RbkScrollEvent';
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
    offsetX: number;
    offsetY: number;
    contentInset?: {
      top: RbkUnit;
      bottom: RbkUnit;
      left: RbkUnit;
      right: RbkUnit;
    };
  }
>;

export type RbkInputEvent = Overwrite<
  RbkEvent,
  {
    handler: 'RbkInputEvent';
    value: InputValue;
    name?: string;
    form?: FormRef;
    focus: () => void;
    blur: () => void;
    clear: () => void;
    reset: () => void;
    isFocused: () => boolean;
  }
>;

export type RbkFormEvent = {
  type: string;
  name?: string;
  form: FormRef;
  target: ReactOnlyElement;
  nativeEvent?: Event | SyntheticEvent;
};

export type RbkStyle = StyleValue | StyleValue[];

export type RbkStyleProps = Overwrite<CSSProperties, StyleProps>;

export type ThemeModeValues = 'light' | 'dark';

export type ThemeColorsProps =
  | {
      main?: string;
      light?: string;
      lighter?: string;
      dark?: string;
      darker?: string;
    }
  | (string & {});

export type ThemeComponentProps<Props extends AnyObject> = Prettify<{
  name: string;
  defaultProps: Partial<Props>;
  defaultStyles: { root: RbkStyle } & {
    [key in keyof NonNullable<Props['variants']>]: RbkStyle;
  };
  variants: {
    [prop: string]: {
      [value: string]: { root?: RbkStyle } & {
        [key in keyof NonNullable<Props['variants']>]?: RbkStyle;
      };
    };
  };
}>;

export type ThemeProps = {
  mode: ThemeModeValues;

  custom: AnyObject;

  shape: {
    borderRadius: number;
    spacing: number;
    gap: number;
  };

  typography: {
    fontSize: number;
    lineHeight: number;
  };

  colors: {
    primary: ThemeColorsProps;
    secondary: ThemeColorsProps;

    info: ThemeColorsProps;
    success: ThemeColorsProps;
    warning: ThemeColorsProps;
    error: ThemeColorsProps;

    gray: ThemeColorsProps;
    red: ThemeColorsProps;
    orange: ThemeColorsProps;
    amber: ThemeColorsProps;
    yellow: ThemeColorsProps;
    lime: ThemeColorsProps;
    green: ThemeColorsProps;
    teal: ThemeColorsProps;
    cyan: ThemeColorsProps;
    blue: ThemeColorsProps;
    indigo: ThemeColorsProps;
    violet: ThemeColorsProps;
    purple: ThemeColorsProps;
    fuchsia: ThemeColorsProps;
    pink: ThemeColorsProps;

    common: {
      transparent: string;
      black: string;
      white: string;

      /** Alias for "transparent" */
      trans: string;
    };

    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };

    background: {
      primary: string;
      secondary: string;
      disabled: string;
    };

    [key: string]: ThemeColorsProps | any;
  };

  mixins: {
    transitions: {
      slow: AnyObject;
      medium: AnyObject;
      fast: AnyObject;
    };

    scroll: AnyObject;

    zIndex: {
      backdrop: number;
      modal: number;
      dropdown: number;
      tooltip: number;
      toaster: number;
    };
  };

  breakpoints: RbkBreakpoints;

  rem: (multiplier?: number, base?: number | null) => number;
  spacing: (multiplier?: number) => number;
  color: (color: RbkColor, alpha?: `${number}%` | number | null, luminosity?: `${number}%` | number | null) => string;
  contrast: (color: RbkColor, lightColor?: string | null, darkColor?: string | null) => string;

  components: {
    Avatar: ThemeComponentProps<AvatarProps>;
    Backdrop: ThemeComponentProps<BackdropProps>;
    Badge: ThemeComponentProps<BadgeProps>;
    Box: ThemeComponentProps<BoxProps>;
    Button: ThemeComponentProps<ButtonProps>;
    ButtonGroup: ThemeComponentProps<ButtonGroupProps>;
    Calendar: ThemeComponentProps<CalendarProps>;
    Card: ThemeComponentProps<CardProps>;
    Carousel: ThemeComponentProps<CarouselProps>;
    Checkbox: ThemeComponentProps<CheckboxProps>;
    Collapse: ThemeComponentProps<CollapseProps>;
    Divider: ThemeComponentProps<DividerProps>;
    Drawer: ThemeComponentProps<DrawerProps>;
    Dropdown: ThemeComponentProps<DropdownProps>;
    Form: ThemeComponentProps<FormProps>;
    Grid: ThemeComponentProps<GridProps>;
    GrowBox: ThemeComponentProps<GrowBoxProps>;
    Image: ThemeComponentProps<ImageProps>;
    InputBase: ThemeComponentProps<InputBaseProps>;
    Input: ThemeComponentProps<InputProps>;
    InputDate: ThemeComponentProps<InputDateProps>;
    InputPin: ThemeComponentProps<InputPinProps>;
    Label: ThemeComponentProps<LabelProps>;
    Link: ThemeComponentProps<LinkProps>;
    List: ThemeComponentProps<ListProps>;
    ListItem: ThemeComponentProps<ListItemProps>;
    Loading: ThemeComponentProps<LoadingProps>;
    Modal: ThemeComponentProps<ModalProps>;
    Outline: ThemeComponentProps<OutlineProps>;
    Progress: ThemeComponentProps<ProgressProps>;
    Resizable: ThemeComponentProps<ResizableProps>;
    Scrollable: ThemeComponentProps<ScrollableProps>;
    Select: ThemeComponentProps<SelectProps>;
    Switch: ThemeComponentProps<SwitchProps>;
    Table: ThemeComponentProps<TableProps>;
    Tabs: ThemeComponentProps<TabsProps>;
    Terminal: ThemeComponentProps<TerminalProps>;
    Text: ThemeComponentProps<TextProps>;
    Toaster: ThemeComponentProps<ToasterProps>;
    Tooltip: ThemeComponentProps<TooltipProps>;
  };
};

export type ThemeEditProps = RecursivePartial<ThemeProps>;

export type RbkTheme = ThemeProps & {
  setTheme: (value: ThemeModeValues | ThemeEditProps | ((theme: ThemeProps) => ThemeEditProps)) => any;
};

export type AccessibilityProps = {
  accessible?: boolean;
  hint?: string;
  label?: string;
  role?:
    | 'adjustable'
    | 'alert'
    | 'button'
    | 'checkbox'
    | 'combobox'
    | 'grid'
    | 'header'
    | 'image'
    | 'imagebutton'
    | 'keyboardkey'
    | 'link'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'none'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'search'
    | 'spinbutton'
    | 'summary'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'text'
    | 'timer'
    | 'togglebutton'
    | 'toolbar';
  state?: {
    checked?: boolean | any;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
    busy?: boolean;
  };
  value?: {
    max?: number;
    min?: number;
    now?: number;
    text?: string;
  };
};

export type PressableProps = {
  pressable?: boolean;
  onPress?: (event: RbkPointerEvent) => void;
  onPressIn?: (event: RbkPointerEvent) => void;
  onPressOut?: (event: RbkPointerEvent) => void;
  onLongPress?: (event: RbkPointerEvent) => void;

  /** @deprecated use onPress(event) instead */
  onClick?: (event: RbkPointerEvent) => void;
  /** @deprecated use onPressIn(event) instead */
  onMouseDown?: (event: RbkPointerEvent) => void;
  /** @deprecated use onPressOut(event) instead */
  onMouseUp?: (event: RbkPointerEvent) => void;
};

export type FocusableProps = {
  autoFocus?: boolean;
  blur?: () => void;
  focus?: () => void;
  isFocused?: () => boolean;
  // Events
  onBlur?: (event: RbkEvent) => void;
  onFocus?: (event: RbkEvent) => void;
  onKeyPress?: (event: RbkKeyboardEvent) => void;
  onKeyDown?: (event: RbkKeyboardEvent) => void;
  onKeyUp?: (event: RbkKeyboardEvent) => void;
};

export type BaseProps = Overwrite<
  PressableProps,
  Overwrite<
    StyleProps,
    {
      ref?: Ref<any>;
      children?: ReactElement | any;

      id?: string;
      className?: any;
      platform?: object;
      accessibility?: AccessibilityProps;
      invisible?: boolean;
      hidden?: boolean | { [key in keyof RbkBreakpoints]?: boolean };

      mount?: boolean;
      component?: any;
      componentProps?: AnyObject;
      noRootStyles?: boolean;

      // Styles
      style?: RbkStyle;
      rawStyle?: RbkStyle;
      animation?: RbkAnimation & {
        // Events
        onStart?: () => void;
        onEnd?: () => void;
      };

      // Flexbox container
      row?: boolean;
      column?: boolean;
      reverse?: boolean;
      wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
      noWrap?: boolean;
      center?: boolean;

      // Flexbox item
      flex?: boolean;

      // To use only on children of Grid
      xs?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
      sm?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
      md?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
      lg?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
      xl?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
      xxl?: 'auto' | 'flex' | 'hide' | (number & {}) | (boolean | {});
    }
  >
>;

export type BoxProps<ALLOW_ANY = true> = PropsWithStyles<ALLOW_ANY, {}>;

export type TextProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle' | 'primary' | 'secondary' | 'caption';
    size?: number;
    color?: RbkColor;
    center?: boolean;
    left?: boolean;
    right?: boolean;
    justify?: boolean;
    bold?: boolean;
    italic?: boolean;
    selectable?: boolean;
    smallCaps?: boolean;
    weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | (string & {});
    transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width';
    numberOfLines?: number;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type LabelProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  TextProps<false>,
  {
    for?: string;
    forRef?: RefObject<ReactElement>;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type ButtonProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  FocusableProps,
  {
    badge?: number | BadgeProps;
    circular?: boolean;
    color?: RbkColor;
    contrastColor?: RbkColor;
    disabled?: boolean;
    disabledColor?: RbkColor;
    endAddon?: ReactElement | ((options: { color: RbkColor }) => ReactElement);
    href?: string;
    label?: string;
    loading?: boolean;
    size?: RbkSize;
    startAddon?: ReactElement | ((options: { color: RbkColor }) => ReactElement);
    transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width';
    type?: 'button' | 'submit' | 'cancel' | 'reset' | 'clear';
    variant?: 'solid' | 'outline' | 'text';
    // Styles
    contentStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    variants?: {
      root?: any;
      label?: any;
    };
  }
>;

export type ButtonGroupProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    disabled?: boolean;
    loading?: boolean;
    size?: RbkSize;
    variant?: 'solid' | 'outline' | 'text';
    // Styles
    contentStyle?: RbkStyle;
    variants?: {
      root?: any;
      content?: any;
    };
  }
>;

export type InputBaseProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  FocusableProps,
  {
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoComplete?:
      | 'off'
      | 'additional-name'
      | 'address-line1'
      | 'address-line2'
      | 'cc-number'
      | 'country'
      | 'current-password'
      | 'email'
      | 'family-name'
      | 'given-name'
      | 'honorific-prefix'
      | 'honorific-suffix'
      | 'name'
      | 'new-password'
      | 'one-time-code'
      | 'postal-code'
      | 'street-address'
      | 'tel'
      | 'username'
      | (string & {});
    autoCorrect?: boolean;
    caretHidden?: boolean;
    color?: RbkColor;
    colorful?: boolean;
    controlled?: boolean;
    defaultValue?: InputValue;
    disabled?: boolean;
    endAddon?: ReactElement | ((options: { color: RbkColor }) => ReactElement);
    error?: string | boolean | null | undefined;
    hint?: string;
    inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | (string & {});
    label?: string;
    multiline?: boolean;
    name?: string;
    placeholder?: string;
    placeholderColor?: RbkColor;
    readOnly?: boolean;
    returnKeyType?: 'default' | 'done' | 'go' | 'next' | 'search' | 'send';
    rows?: number;
    secure?: boolean;
    selectionColor?: RbkColor;
    selectTextOnFocus?: boolean;
    size?: RbkSize;
    startAddon?: ReactElement | ((options: { color: RbkColor }) => ReactElement);
    textColor?: RbkColor;
    type?: 'text' | 'number' | 'password' | 'email' | 'phone' | 'url' | 'hidden' | (string & {});
    value?: InputValue;
    // Styles
    contentStyle?: RbkStyle;
    hintStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    inputStyle?: RbkStyle;
    variants?: {
      root: any;
      content: any;
      label: any;
      input: any;
      hint: any;
      error: any;
    };
  }
>;

export type InputProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  InputBaseProps<false>,
  {
    mask?: (value: InputValue) => any;
    max?: number;
    maxLength?: number;
    min?: number;
    notNull?: boolean;
    unmask?: (value: InputValue) => any;
    // Events
    onFocus?: (event: RbkInputEvent, value: InputValue) => void;
    onBlur?: (event: RbkInputEvent, value: InputValue) => void;
    onSubmit?: (event: RbkInputEvent, value: InputValue) => void;
    onChange?: (event: RbkInputEvent, value: InputValue) => void;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => void;
    // Styles
    variants?: {
      root: any;
      content: any;
      label: any;
      input: any;
      hint: any;
      error: any;
    };
  }
>;

export type SelectProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  ButtonProps<false>,
  {
    colorful?: boolean;
    controlled?: boolean;
    defaultValue?: InputValue;
    error?: string | boolean | null | undefined;
    label?: string;
    name?: string;
    options?: SelectOption[];
    placeholder?: string;
    readOnly?: boolean;
    searchCount?: number;
    value?: InputValue;
    // Events
    onFocus?: (event: RbkInputEvent, value: InputValue, option?: SelectOption | null) => void;
    onBlur?: (event: RbkInputEvent, value: InputValue, option?: SelectOption | null) => void;
    onChange?: (event: RbkInputEvent, value: InputValue, option?: SelectOption | null) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    buttonStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    // Styles
    variants?: {
      root?: any;
      label?: any;
      error?: any;
    };
  }
>;

export type CheckboxProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  ButtonProps<false>,
  {
    checked?: boolean;
    color?: RbkColor;
    controlled?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    error?: string | boolean | null | undefined;
    label?: ReactElement;
    name?: string;
    readOnly?: boolean;
    size?: RbkSize;
    unique?: boolean;
    value?: InputValue;
    // Events
    onFocus?: (event: RbkInputEvent, checked: boolean) => void;
    onBlur?: (event: RbkInputEvent, checked: boolean) => void;
    onChange?: (event: RbkInputEvent, checked: boolean) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    buttonStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    variants?: {
      root?: any;
      button?: any;
      label?: any;
      error?: any;
    };
  }
>;

export type SwitchProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  ButtonProps<false>,
  {
    checked?: boolean;
    controlled?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    error?: string | boolean | null | undefined;
    label?: ReactElement;
    name?: string;
    readOnly?: boolean;
    size?: RbkSize;
    // Colors
    onColor?: RbkColor;
    offColor?: RbkColor;
    onThumbColor?: RbkColor;
    offThumbColor?: RbkColor;
    // Events
    onFocus?: (event: RbkInputEvent, checked: boolean) => void;
    onBlur?: (event: RbkInputEvent, checked: boolean) => void;
    onChange?: (event: RbkInputEvent, checked: boolean) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    buttonStyle?: RbkStyle;
    thumbStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    variants?: {
      root?: any;
      button?: any;
      label?: any;
      thumb?: any;
      error?: any;
    };
  }
>;

export type CardProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type CarouselProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    chevron?:
      | boolean
      | 'visible'
      | 'hidden'
      | ((options: { prev: boolean; next: boolean; color: RbkColor; onPress: () => void }) => ReactElement);
    color?: RbkColor;
    gap?: GridProps<false>['gap'];
    pagingEnabled?: boolean;
    pointerScroll?: boolean;
    // Column Count
    xs?: number | 'auto' | RbkStyle;
    sm?: number | 'auto' | RbkStyle;
    md?: number | 'auto' | RbkStyle;
    lg?: number | 'auto' | RbkStyle;
    xl?: number | 'auto' | RbkStyle;
    // Styles
    itemStyle?: RbkStyle;
    chevronStyle?: { color?: RbkColor; size?: number } & RbkStyle;
    // Styles
    variants?: {
      root?: any;
      content?: any;
      chevron?: any;
    };
  }
>;

export type InputDateProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  InputProps<false>,
  {
    // format?: 'Y-M-D' | 'Y/M/D' | 'D-M-Y' | 'D/M/Y' | 'M-D-Y' | 'M/D/Y';
    locale?: Intl.LocalesArgument;
    format?: {
      month?: 'long' | 'narrow' | 'numeric' | 'short' | '2-digit';
      day?: 'numeric' | '2-digit';
      year?: 'numeric' | '2-digit';
    };
    max?: Date | string | number | null | undefined;
    min?: Date | string | number | null | undefined;
    value?: Date | string | number | null | undefined;
    variant?: 'modal' | 'inline' | 'dropdown';
    translate?: {
      cancel?: string;
      clear?: string;
      today?: string;
    };
  }
>;

export type ScrollableProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    contentInset?:
      | RbkUnit
      | {
          vertical?: RbkUnit;
          horizontal?: RbkUnit;
          top?: RbkUnit;
          bottom?: RbkUnit;
          left?: RbkUnit;
          right?: RbkUnit;
        };

    direction?: 'vertical' | 'horizontal';
    hideScrollBar?: boolean;

    /** Note: vertical pagination is not supported on Android. **/
    pagingEnabled?: boolean;

    // Events
    onScroll?: (event: RbkScrollEvent) => void;

    // Styles
    contentStyle?: RbkStyle;
    variants?: {
      root?: any;
      content?: any;
    };
  }
>;

export type ImageProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    source: { uri?: string } | (string & {}) | (number & {});
    alt?: string;
    circular?: boolean;
    fallback?: ReactElement;
    mode?: 'cover' | 'contain' | 'fill';
    width?: number | string;
    height?: number | string;
    // Events
    onLoad?: Function;
    onError?: Function;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type DividerProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    opacity?: number;
    size?: number | string;
    vertical?: boolean;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type BackdropProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    keepMounted?: boolean;
    visible?: boolean;

    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type ModalProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    keepMounted?: boolean;
    animation?: 'fade' | 'zoom-in' | 'zoom-out' | 'slide-bottom' | 'slide-top' | 'slide-left' | 'slide-right';
    halign?: 'center' | 'left' | 'right';
    valign?: 'center' | 'top' | 'bottom';
    visible?: boolean;
    // Events
    onClose?: PressableProps['onPress'];
    // Styles
    variants?: {
      root?: any;
      backdrop?: any;
    };
  }
>;

export type CollapseProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  Pick<RbkAnimation, 'delay' | 'duration' | 'timing'>,
  {
    visible?: boolean;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type DropdownProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    keepMounted?: boolean;
    placement?: 'top' | 'bottom';
    triggerRef?: RefObject<ReactElement>;
    visible?: boolean;
    // Events
    onClose?: PressableProps['onPress'];
    // Styles
    variants?: {
      root?: any;
      backdrop?: any;
    };
  }
>;

export type LoadingProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    duration?: number;
    label?: string;
    size?: RbkUnitPixelable;
    // Styles
    labelStyle?: RbkStyle;
    // Styles
    variants?: {
      root?: any;
      label?: any;
    };
  }
>;

export type GridProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    breakpoints?: Partial<RbkBreakpoints>;
    gap?: number | true;
    size?: number;
    // Styles
    variants?: {
      root?: any;
      item?: any;
    };
  }
>;

export type TableProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    columns: TableColumn[];
    rows?: any[] | any;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type BadgeProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    value?: number;
    size?: RbkSize;
    dot?: boolean;
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    // Styles
    labelStyle?: RbkStyle;
    variants?: {
      root?: any;
      label?: any;
    };
  }
>;

export type FormProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    initialData?: AnyObject;
    // Events
    onSubmit?: (event: RbkFormEvent, data: AnyObject, errors: AnyObject | null) => void;
    onCancel?: (event: RbkFormEvent, data: AnyObject, errors: AnyObject | null) => void;
    onReset?: (event: RbkFormEvent, data: AnyObject, errors: AnyObject | null) => void;
    onClear?: (event: RbkFormEvent, data: AnyObject, errors: AnyObject | null) => void;
    onChange?: (event: RbkFormEvent, data: AnyObject, errors: AnyObject | null) => void;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type TooltipProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: 'black' | 'white' | RbkColor;
    delay?: number;
    offset?: number | string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    title?: string;
    visible?: boolean;
    // Styles
    labelStyle?: RbkStyle;
    variants?: {
      root?: any;
      label?: any;
    };
  }
>;

export type AnimationProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    delay?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    duration?: number;
    from?: RbkStyle;
    in?: boolean;
    loop?: boolean | number;
    throttle?: number;
    timing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    to?: RbkStyle;

    // Pre-defined animations
    fade?: boolean | 1 | -1;
    zoom?: boolean | 1 | -1;
    spin?: boolean | 1 | -1;

    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type ProgressProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    label?: boolean | ((value: number) => ReactElement);
    size?: RbkSize;
    value?: number;
    // Styles
    barStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    // Styles
    variants?: {
      root?: any;
      bar?: any;
      label?: any;
    };
  }
>;

export type ListItemProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    chevron?: boolean | ReactElement;
    endAddon?: ReactElement;
    gap?: GridProps<false>['gap'];
    startAddon?: ReactElement;
    // Styles
    chevronStyle?: Overwrite<RbkStyle, { size?: number; color?: RbkColor }>;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type LinkProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  TextProps<false>,
  {
    underline?: boolean;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type DrawerProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    keepMounted?: boolean;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    visible?: boolean;
    // Styles
    backdropStyle?: RbkStyle;
    variants?: {
      root?: any;
      backdrop?: any;
    };
  }
>;

export type OutlineProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    size?: number;
    visible?: 'auto' | boolean;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type TabsProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  BoxProps<false>,
  {
    alignment?: 'start' | 'center' | 'end';
    color?: RbkColor;
    size?: RbkSize;
    tabs: TabItem[];
    value?: string | number;
    variant?: 'group' | 'card' | 'nav';
    // Events
    onChange?: (event: RbkPointerEvent, value: string | number) => any;
    // Styles
    contentStyle?: RbkStyle;
    buttonStyle?: RbkStyle;
    activeStyle?: RbkStyle;
    variants?: {
      root?: any;
      content?: any;
      button?: any;
      active?: any;
    };
  }
>;

export type ToasterProps = {
  content?: ReactElement;
  color?: RbkColor;
  duration?: number;
  halign?: 'left' | 'right' | 'center';
  offset?: { x?: number | string; y?: number | string };
  valign?: 'top' | 'bottom';
  width?: number | string;
  // Events
  onPress?: PressableProps['onPress'];
  // Styles
  variants?: {
    root?: any;
  };
};

export type CalendarProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    color?: RbkColor;
    date?: Date | string | number | null | undefined;
    disableds?: (Date | string | number)[] | ((date: Date) => boolean);
    events?: (Date | string | number)[];
    // Events
    onPressDate?: (event: AnyObject, date: Date) => any;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type AvatarProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    alt?: string;
    color?: RbkColor;
    corners?: number;
    placeholder?: ReactElement;
    size?: number;
    source?: { uri?: string } | (string & {}) | (number & {});
    // Styles
    contentStyle?: RbkStyle;
    variants?: {
      root?: any;
      content?: any;
    };
  }
>;

export type TerminalProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  ScrollableProps<false>,
  {
    prompt?: string;
    version?: string;
    welcomeMessage?: string;
    commands?: {
      [key: string]: string | (() => Promise<string | void>);
    }[];
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type ListProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  ScrollableProps<false>,
  {
    renderDelay?: number;
    renderOffset?: number;
    rowHeight?: number;
    rowWidth?: number;
    rowFallbackComponent?: JSXElementConstructor<any> | string;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type InputPinProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  Pick<
    InputProps<false>,
    | 'autoFocus'
    | 'color'
    | 'colorful'
    | 'defaultValue'
    | 'disabled'
    | 'name'
    | 'notNull'
    | 'placeholder'
    | 'placeholderColor'
    | 'readOnly'
    | 'returnKeyType'
    | 'secure'
    | 'size'
    | 'textColor'
    | 'value'
    // Styles
    | 'inputStyle'
    | 'variants'
    // Events
    | 'onChange'
    | 'onSubmit'
    | 'onFormChange'
  >,
  {
    length?: number;
    type?: 'alphanumeric' | 'alphabetic' | 'numeric';
  }
>;

export type GrowBoxProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    duration?: number;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;

export type ResizableProps<ALLOW_ANY = true> = PropsWithStyles<
  ALLOW_ANY,
  {
    horizontal?: boolean;
    vertical?: boolean;
    // Styles
    variants?: {
      root?: any;
    };
  }
>;
