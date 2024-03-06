import { CSSProperties, JSXElementConstructor, ReactNode, Ref, RefObject, SyntheticEvent } from 'react';

import { customSpacings, styleProps } from './styles/constants';

/****************************
 * FOR INTERNAL USE (START) *
 ****************************/

/** @internal */
export type RequiredSome<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/** @internal */
type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never;

/** @internal */
type Overwrite<T, NewT> = DistributiveOmit<T, keyof NewT> & NewT;

/** @internal */
type PropsWithStyles<T1, T2 = {}> = Overwrite<BoxProps, Overwrite<StyleProps, Overwrite<T1, T2>>>;

/** @internal */
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
      ? RecursivePartial<T[P]>
      : T[P];
};

/** @internal */
type ColorTypographyToken = 'text' | 'background';

/** @internal */
type ColorTypographyTone = 'primary' | 'secondary' | 'disabled';

/** @internal */
type ColorToken = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

/** @internal */
type ColorTone = 'main' | 'light' | 'lighter' | 'dark' | 'darker' | 'contrast';

/** @internal */
type FlexJustifyValues =
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
type FlexAlignValues =
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

    // Flexbox container
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: FlexJustifyValues;
    alignContent?: FlexAlignValues;
    justifyItems?: FlexJustifyValues;
    alignItems?: FlexAlignValues | 'baseline';

    // Flexbox item
    order?: number;
    grow?: number;
    shrink?: number;
    basis?: 'auto' | (string & {}) | (number & {});
    align?: FlexAlignValues;
    justify?: FlexJustifyValues;

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
type RbkStyleVar = undefined | null | false | AnyObject | (CSSProperties & StyleProps);

/** @internal */
export type SelectOption = {
  label: string;
  value: InputValue;
  disabled?: boolean;
  [key: string]: any;
};

/** @internal */
export type TableColumn = {
  header?: ReactElement | AnyCallback | string;
  content?: ReactElement | AnyCallback | string;
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

/****************************
 * FOR INTERNAL USE (END) *
 ****************************/

export type ReactElement = ReactNode | ReactNode[] | JSX.Element | JSX.Element[];

export type AnyObject = { [key: string | number]: any };

export type AnyCallback = (...args: any[]) => any;

export type TimeoutType = ReturnType<typeof setTimeout> | null;

export type IntervalType = ReturnType<typeof setInterval> | null;

export type InputValue = any;

export interface RbkMap {
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

  Animated: {
    View: ReactElement;
  };

  svg: {
    [key: string]: ReactElement;
  };

  [key: string]: ReactElement | any;
}

export type RbkSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | (number & {});

export type RbkColor =
  | ColorTypographyToken
  | ColorToken
  | `${ColorTypographyToken}.${ColorTypographyTone}`
  | `${ColorToken}.${ColorTone}`
  | `${ColorTypographyToken}.${ColorTypographyTone}.${number}`
  | `${ColorToken}.${ColorTone}.${number}`
  | (string & {});

export interface RbkRect {
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
}

export interface RbkAnimation {
  boomerang?: boolean;
  delay?: number;
  duration?: number;
  timing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  iterations?: number | 'infinite';

  /** @deprecated use duration instead */
  speed?: number;
}

export interface RbkTransition {
  to: Omit<RbkStyleProps, 'transform'>;
  from?: Omit<RbkStyleProps, 'transform'>;

  boomerang?: boolean;
  delay?: number;
  duration?: number;
  iterations?: number | 'infinite';
  throttle?: number;
  timing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface RbkFormEvent {
  name?: string;
  type: string;
  form: FormRef;
  target: ReactElement | any;
  nativeEvent?: Event | SyntheticEvent;
}

export interface RbkInputEvent {
  type: string;
  value: InputValue;
  name?: string;
  target: ReactElement | any;
  form?: FormRef;
  focus: () => any;
  blur: () => any;
  clear: () => any;
  isFocused: () => any;
  nativeEvent?: Event | SyntheticEvent;
}

export interface RbkCheckboxEvent extends Omit<RbkInputEvent, 'value'> {
  checked: boolean;
}

export interface AccessibilityProps {
  accessible?: boolean;
  hint?: string;
  label?: string;
  role?:
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'alert'
    | 'checkbox'
    | 'combobox'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
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
}

export interface PressableProps {
  pressable?: boolean;
  onPress?: Function;
  onPressIn?: Function;
  onPressOut?: Function;
  onLongPress?: Function;

  /** @deprecated use onPress(event) instead */
  onClick?: Function;
  /** @deprecated use onPressIn(event) instead */
  onMouseDown?: Function;
  /** @deprecated use onPressOut(event) instead */
  onMouseUp?: Function;
}

export interface FocusableProps {
  autoFocus?: boolean;
  blur?: () => void;
  focus?: () => void;
  isFocused?: () => boolean;
  // Events
  onBlur?: Function;
  onFocus?: Function;
}

export type FormField = {
  name: string;
  get: () => InputValue | null | undefined;
  set: (value: InputValue) => any;
  setError?: (error: boolean | string) => any;
  onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
};

export type FormRef = {
  cancel: () => any;
  clear: () => any;
  getData: () => AnyObject;
  setData: (data: AnyObject) => any;
  setErrors: (errors: FormProps['errors']) => any;
  getValue: (name: string) => InputValue | undefined;
  setValue: (name: string, value: InputValue) => any;
  submit: () => any;
  target: ReactElement;
  getField: (name: string) => FormField | null | undefined;
  setField: (options: FormField) => any;
  unsetField: (name: string) => any;
};

export type RbkStyle = RbkStyleVar | RbkStyleVar[];

export type RbkStyleProps = CSSProperties & StyleProps;

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

export type ThemeComponentStyleContexts<Contexts extends keyof any> = {
  [context in Contexts | 'root']: RbkStyle;
};

export type ThemeComponentProps<Props, Contexts extends keyof any> = {
  name: string;
  defaultProps: Partial<Props>;
  defaultStyles: ThemeComponentStyleContexts<Contexts>;
  variants?: {
    [prop: string]: {
      [value: string]: Partial<ThemeComponentStyleContexts<Contexts>>;
    };
  };
};

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

  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  rem: (multiplier?: number, base?: number | null) => number;
  spacing: (multiplier?: number) => number;
  color: (color: RbkColor, alpha?: `${number}%` | number | null, luminosity?: `${number}%` | number | null) => string;
  contrast: (color: RbkColor, lightColor?: string | null, darkColor?: string | null) => string;

  components: {
    AutoComplete: ThemeComponentProps<AutoCompleteProps, 'root' | 'item' | 'input'>;
    Avatar: ThemeComponentProps<AvatarProps, 'root' | 'content'>;
    Animation: ThemeComponentProps<AnimationProps, 'root'>;
    Backdrop: ThemeComponentProps<BackdropProps, 'root'>;
    Badge: ThemeComponentProps<BadgeProps, 'root' | 'label'>;
    Box: ThemeComponentProps<BoxProps, 'root'>;
    Button: ThemeComponentProps<ButtonProps, 'root' | 'label'>;
    ButtonGroup: ThemeComponentProps<ButtonGroupProps, 'root' | 'content'>;
    Calendar: ThemeComponentProps<CalendarProps, 'root'>;
    Card: ThemeComponentProps<CardProps, 'root'>;
    Carousel: ThemeComponentProps<CarouselProps, 'root' | 'content' | 'chevron'>;
    Checkbox: ThemeComponentProps<CheckboxProps, 'root' | 'button'>;
    Collapse: ThemeComponentProps<CollapseProps, 'root'>;
    InputDate: ThemeComponentProps<InputDateProps, 'root'>;
    Divider: ThemeComponentProps<DividerProps, 'root'>;
    Drawer: ThemeComponentProps<DrawerProps, 'root' | 'backdrop'>;
    Dropdown: ThemeComponentProps<DropdownProps, 'root' | 'backdrop'>;
    Form: ThemeComponentProps<FormProps, 'root'>;
    Grid: ThemeComponentProps<GridProps, 'root' | 'item'>;
    Image: ThemeComponentProps<ImageProps, 'root'>;
    Input: ThemeComponentProps<InputProps, 'root' | 'content' | 'label' | 'input' | 'hint' | 'error'>;
    InputPin: ThemeComponentProps<InputPinProps, 'root'>;
    Label: ThemeComponentProps<LabelProps, 'root'>;
    Link: ThemeComponentProps<LinkProps, 'root'>;
    List: ThemeComponentProps<ListProps, 'root'>;
    ListItem: ThemeComponentProps<ListItemProps, 'root'>;
    Loading: ThemeComponentProps<LoadingProps, 'root' | 'label'>;
    Modal: ThemeComponentProps<ModalProps, 'root' | 'backdrop'>;
    Outline: ThemeComponentProps<OutlineProps, 'root'>;
    Progress: ThemeComponentProps<ProgressProps, 'root' | 'bar' | 'label'>;
    Scrollable: ThemeComponentProps<ScrollableProps, 'root' | 'content'>;
    Select: ThemeComponentProps<SelectProps, 'root' | 'label' | 'error'>;
    Slider: ThemeComponentProps<SliderProps, 'root' | 'rule' | 'bar' | 'thumb'>;
    Table: ThemeComponentProps<TableProps, 'root'>;
    Tabs: ThemeComponentProps<TabsProps, 'root' | 'content' | 'button' | 'active'>;
    Terminal: ThemeComponentProps<TabsProps, 'root'>;
    Text: ThemeComponentProps<TextProps, 'root'>;
    Toaster: ThemeComponentProps<ToasterProps, 'root'>;
    Tooltip: ThemeComponentProps<TooltipProps, 'root'>;
  };
};

export type ThemeEditProps = RecursivePartial<ThemeProps>;

/** @deprecated use ThemeEditProps instead */
export type ThemeOptionalProps = RecursivePartial<ThemeProps>;

export type RbkTheme = ThemeProps & {
  setTheme: (options: ThemeModeValues | ThemeEditProps) => any;
};

export type BoxProps = { [key: string | number]: any } & Overwrite<
  PressableProps,
  Overwrite<
    StyleProps,
    {
      /** @internal */
      stylist?: any[];

      ref?: Ref<any>;
      children?: ReactElement | any;

      id?: string;
      className?: any;
      platform?: object;
      accessibility?: AccessibilityProps;
      invisible?: boolean;
      hidden?: boolean;

      mount?: boolean;
      component?: any;
      componentProps?: AnyObject;
      noRootStyles?: boolean;

      // Styles
      style?: RbkStyle;
      rawStyle?: RbkStyle;

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

export type TextProps = PropsWithStyles<{
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
}>;

export type LabelProps = PropsWithStyles<
  TextProps,
  {
    for?: string;
    forRef?: RefObject<ReactElement>;
  }
>;

export type ButtonProps = PropsWithStyles<
  FocusableProps,
  {
    badge?: number | BadgeProps;
    circular?: boolean;
    color?: RbkColor;
    contrastColor?: RbkColor;
    disabled?: boolean;
    endAddon?: ReactElement;
    href?: string;
    label?: string;
    loading?: boolean;
    size?: RbkSize;
    startAddon?: ReactElement;
    transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width';
    type?: 'button' | 'submit' | 'cancel' | 'clear';
    variant?: 'solid' | 'outline' | 'text';
    // Styles
    contentStyle?: RbkStyle;
    labelStyle?: RbkStyle;

    /** @deprecated use startAddon instead */
    startIcon?: ReactElement;
    /** @deprecated use endAddon instead */
    endIcon?: ReactElement;
  }
>;

export type ButtonGroupProps = PropsWithStyles<{
  color?: RbkColor;
  disabled?: boolean;
  loading?: boolean;
  size?: RbkSize;
  variant?: 'solid' | 'outline' | 'text';
  // Styles
  contentStyle?: RbkStyle;
}>;

export type InputProps = PropsWithStyles<
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
    endAddon?: ReactElement;
    error?: string | boolean;
    hint?: string;
    inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | (string & {});
    label?: string;
    mask?: (value: InputValue) => any;
    max?: number;
    maxLength?: number;
    min?: number;
    multiline?: boolean;
    name?: string;
    notNull?: boolean;
    placeholder?: string;
    placeholderColor?: RbkColor;
    readOnly?: boolean;
    returnKeyType?: 'default' | 'done' | 'go' | 'next' | 'search' | 'send';
    rows?: number;
    secure?: boolean;
    selectionColor?: RbkColor;
    selectTextOnFocus?: boolean;
    size?: RbkSize;
    startAddon?: ReactElement;
    textColor?: RbkColor;
    type?: 'text' | 'number' | 'password' | 'email' | 'phone' | 'url' | 'hidden' | (string & {});
    unmask?: (value: InputValue) => any;
    value?: InputValue;
    // Events
    onFocus?: (event: RbkInputEvent, value: InputValue) => void;
    onBlur?: (event: RbkInputEvent, value: InputValue) => void;
    onSubmit?: (event: RbkInputEvent, value: InputValue) => any;
    onChange?: (event: RbkInputEvent | RbkChangeEvent | RbkEvent, value: InputValue) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    contentStyle?: RbkStyle;
    hintStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;
    inputStyle?: RbkStyle;

    /** @deprecated use startAddon instead */
    startIcon?: ReactElement;
    /** @deprecated use endAddon instead */
    endIcon?: ReactElement;
    /** @deprecated use onChange(event, value) instead */
    onInput?: Function;
    /** @deprecated use onChange(event, value) instead */
    onChangeText?: Function;
  }
>;

export type SelectProps = PropsWithStyles<
  FocusableProps,
  {
    color?: RbkColor;
    colorful?: boolean;
    controlled?: boolean;
    defaultValue?: InputValue;
    disabled?: boolean;
    endAddon?: ReactElement;
    error?: string | boolean;
    label?: string;
    loading?: boolean;
    name?: string;
    options?: SelectOption[];
    placeholder?: string;
    readOnly?: boolean;
    searchCount?: number;
    size?: RbkSize;
    startAddon?: ReactElement;
    value?: InputValue;
    // Events
    onFocus?: (event: RbkInputEvent, value: InputValue, option?: SelectOption | null) => void;
    onBlur?: (event: RbkInputEvent, value: InputValue, option?: SelectOption | null) => void;
    onChange?: (
      event: RbkInputEvent | RbkChangeEvent | RbkEvent,
      value: InputValue,
      option?: SelectOption | null,
    ) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    buttonStyle?: RbkStyle;
    errorStyle?: RbkStyle;
    labelStyle?: RbkStyle;

    /** @deprecated use startAddon instead */
    startIcon?: ReactElement;
    /** @deprecated use endAddon instead */
    endIcon?: ReactElement;
  }
>;

export type CheckboxProps = PropsWithStyles<
  FocusableProps,
  {
    checked?: boolean;
    controlled?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    label?: string;
    name?: string;
    readOnly?: boolean;
    size?: RbkSize;
    unique?: boolean;
    value?: InputValue;
    // Events
    onFocus?: (event: RbkCheckboxEvent, checked: boolean) => void;
    onBlur?: (event: RbkCheckboxEvent, checked: boolean) => void;
    onChange?: (event: RbkCheckboxEvent | RbkChangeEvent | RbkEvent, checked: boolean) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
    // Styles
    buttonStyle?: RbkStyle;
    labelStyle?: RbkStyle;
  }
>;

export type SliderProps = PropsWithStyles<
  FocusableProps,
  {
    defaultValue?: number;
    disabled?: boolean;
    max?: number;
    min?: number;
    name?: string;
    readOnly?: boolean;
    size?: RbkSize;
    value?: number;
    // Events
    onFocus?: (event: AnyObject, value: number) => any;
    onBlur?: (event: AnyObject, value: number) => any;
    onSlide?: (event: AnyObject, value: number) => any;
    onChange?: (event: AnyObject, value: number) => any;
    onFormChange?: (event: RbkFormEvent, data: AnyObject) => any;
  }
>;

export type CardProps = PropsWithStyles<{}>;

export type CarouselProps = PropsWithStyles<{
  chevron?:
    | boolean
    | 'visible'
    | 'hidden'
    | ((options: { prev: boolean; next: boolean; color: RbkColor; onPress: Function }) => ReactElement);
  color?: RbkColor;
  gap?: number | true;
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
}>;

export type InputDateProps = PropsWithStyles<
  InputProps,
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

export type ScrollableProps = PropsWithStyles<{
  contentInset?:
    | number
    | {
        vertical?: number;
        horizontal?: number;

        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };

  direction?: 'vertical' | 'horizontal';
  hideScrollBar?: boolean;

  /** Note: vertical pagination is not supported on Android. **/
  pagingEnabled?: boolean;

  // Styles
  contentStyle?: RbkStyle;
}>;

export type ImageProps = PropsWithStyles<{
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
}>;

export type DividerProps = PropsWithStyles<{
  color?: RbkColor;
  opacity?: number;
  size?: number | string;
  vertical?: boolean;
}>;

export type BackdropProps = PropsWithStyles<{
  visible?: boolean;
}>;

export type ModalProps = PropsWithStyles<{
  halign?: 'center' | 'left' | 'right';
  valign?: 'center' | 'top' | 'bottom';
  visible?: boolean;
  // Events
  onClose?: Function;

  /** @deprecated use onClose instead */
  onBackdropPress?: Function;
}>;

export type CollapseProps = PropsWithStyles<{
  visible?: boolean;

  /** @deprecated use visible instead */
  in?: boolean;
}>;

export type DropdownProps = PropsWithStyles<{
  placement?: 'top' | 'bottom';
  triggerRef?: RefObject<ReactElement>;
  visible?: boolean;
  // Events
  onClose?: Function;
}>;

export type LoadingProps = PropsWithStyles<{
  color?: RbkColor;
  label?: string;
  size?: RbkSize;
  // Styles
  labelStyle?: RbkStyle;
}>;

export type GridProps = PropsWithStyles<{
  breakpoints?: Partial<ThemeProps['breakpoints']>;
  gap?: number | true;
  size?: number;
}>;

export type TableProps = PropsWithStyles<{
  columns: TableColumn[];
  rows?: any[] | any;
}>;

export type BadgeProps = PropsWithStyles<{
  value?: number;
  size?: RbkSize;
  dot?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  // Styles
  labelStyle?: RbkStyle;
}>;

// TODO: remove event as "any" in next major release
export type FormProps = PropsWithStyles<{
  data?: any;
  errors?: { [key: string]: string | boolean } | null;
  onSubmit?: (event: RbkFormEvent | any, data: AnyObject) => any;
  onCancel?: (event: RbkFormEvent | any, data: AnyObject) => any;
  onClear?: (event: RbkFormEvent | any, data: AnyObject) => any;
  onChange?: (event: RbkFormEvent | any, data: AnyObject) => any;
}>;

export type TooltipProps = PropsWithStyles<{
  color?: 'black' | 'white' | RbkColor;
  offset?: number | string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  title?: string;
  visible?: boolean;
}>;

export type AnimationProps = PropsWithStyles<{
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  duration?: number;
  from?: RbkStyle;
  in?: boolean;
  loop?: boolean | number;
  throttle?: number;
  timing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  to?: RbkStyle;

  // Pre-defined animations
  fade?: boolean | 1 | -1;
  zoom?: boolean | 1 | -1;
  spin?: boolean | 1 | -1;

  /** @deprecated use duration instead */
  speed?: number;
}>;

export type ProgressProps = PropsWithStyles<{
  color?: RbkColor;
  label?: boolean | ((value: number) => ReactElement);
  size?: RbkSize;
  value?: number;
  // Styles
  barStyle?: RbkStyle;
  labelStyle?: RbkStyle;
}>;

export type ListItemProps = PropsWithStyles<{
  chevron?: boolean | ReactElement;
  endAddon?: ReactElement;
  gap?: number | true;
  startAddon?: ReactElement;
  // Styles
  chevronStyle?: Overwrite<RbkStyle, { size?: number; color?: RbkColor }>;

  /** @deprecated use startAddon instead */
  startIcon?: ReactElement;
  /** @deprecated use endAddon instead */
  endIcon?: ReactElement;
}>;

export type LinkProps = PropsWithStyles<
  TextProps,
  {
    underline?: boolean;
  }
>;

export type DrawerProps = PropsWithStyles<{
  placement?: 'left' | 'right' | 'top' | 'bottom';

  // Styles
  backdropStyle?: RbkStyle;
}>;

export type OutlineProps = PropsWithStyles<
  BoxProps,
  {
    color?: RbkColor;
    size?: number;
    visible?: 'auto' | boolean;
  }
>;

export type TabsProps = PropsWithStyles<
  ScrollableProps,
  {
    color?: RbkColor;
    size?: RbkSize;
    tabs: TabItem[];
    value?: string | number;
    variant?: 'group' | 'card' | 'nav';
    // Events
    onChange?: (event: Event, value: string | number) => any;
    // Styles
    contentStyle?: RbkStyle;
    buttonStyle?: RbkStyle;
    activeStyle?: RbkStyle;
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
  onPress?: Function;
};

export type CalendarProps = PropsWithStyles<{
  color?: RbkColor;
  date?: Date | string | number | null | undefined;
  disableds?: (Date | string | number)[] | ((date: Date) => boolean);
  events?: (Date | string | number)[];
  // Events
  onPressDate?: (event: AnyObject, date: Date) => any;
}>;

export type AutoCompleteProps = PropsWithStyles<{
  color?: RbkColor;
  options: SelectOption[] | undefined;
}>;

export type AvatarProps = PropsWithStyles<{
  alt?: string;
  color?: RbkColor;
  corners?: number;
  placeholder?: ReactElement;
  size?: number;
  source?: { uri?: string } | (string & {}) | (number & {});
  // Styles
  contentStyle?: RbkStyle;
}>;

export type TerminalProps = PropsWithStyles<
  ScrollableProps,
  {
    prompt?: string;
    version?: string;
    welcomeMessage?: string;
    commands?: {
      [key: string]: string | (() => Promise<string | void>);
    }[];
  }
>;

export type ListProps = PropsWithStyles<
  ScrollableProps,
  {
    renderDelay?: number;
    rowHeight?: number;
    rowFallbackComponent?: JSXElementConstructor<any> | string;
  }
>;

export type InputPinProps = PropsWithStyles<
  Pick<
    InputProps,
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

/************************
 * DEPRECATIONS (START) *
 ************************/

/** @deprecated use native Event instead */
export type EventCallback = (event: any) => any;

/** @deprecated use RbkInputEvent instead */
export interface RbkEvent extends RbkInputEvent {}

/** @deprecated use RbkInputEvent instead */
export interface RbkChangeEvent extends RbkInputEvent {}

/** @deprecated use RbkFormEvent instead */
export interface RbkFormChangeEvent extends RbkFormEvent {}

/** @deprecated use RbkSize instead */
export type SizeValues = RbkSize;

/** @deprecated use RbkStyle instead */
export type RbkStyles = RbkStyle;

/************************
 * DEPRECATIONS (END) *
 ************************/
