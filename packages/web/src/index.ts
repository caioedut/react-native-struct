import ReactBulk, {
  AnimationFactory,
  AutoCompleteFactory,
  AvatarFactory,
  BackdropFactory,
  BadgeFactory,
  BoxFactory,
  ButtonFactory,
  ButtonGroupFactory,
  CalendarFactory,
  CardFactory,
  CarouselFactory,
  CheckboxFactory,
  CollapseFactory,
  DividerFactory,
  DrawerFactory,
  DropdownFactory,
  FormFactory,
  GridFactory,
  ImageFactory,
  InputDateFactory,
  InputFactory,
  InputPinFactory,
  LabelFactory,
  LinkFactory,
  ListFactory,
  ListItemFactory,
  LoadingFactory,
  ModalFactory,
  OutlineFactory,
  ProgressFactory,
  RbkMap,
  RbkTheme,
  ScrollableFactory,
  SelectFactory,
  SliderFactory,
  TableFactory,
  TabsFactory,
  TerminalFactory,
  TextFactory,
  TooltipFactory,
  global,
  useTheme as useCoreTheme,
} from '@react-bulk/core';

import useDimensions from './useDimensions';

global.mapping = {
  web: true,
  native: false,
  ios: false,
  android: false,

  locale: typeof navigator !== 'undefined' ? navigator.languages?.[0] ?? navigator.language : null,

  useDimensions,

  dimensions: {
    window() {
      let width = 0;
      let height = 0;

      if (typeof window !== 'undefined') {
        width = window.innerWidth;
        height = window.innerHeight;
      }

      return { width, height };
    },
  },

  Button: 'button',
  Dialog: 'div',
  Form: 'form',
  Image: 'img',
  Input: 'input',
  Label: 'label',
  Link: 'a',
  SafeAreaView: 'div',
  ScrollView: 'div',
  Text: 'span',
  TextArea: 'textarea',
  View: 'div',

  Animated: {
    View: 'div',
  },

  // Svg
  svg: {
    Svg: 'svg',
    Circle: 'circle',
    Ellipse: 'ellipse',
    G: 'g',
    Text: 'text',
    TSpan: 'tspan',
    TextPath: 'textPath',
    Path: 'path',
    Polygon: 'polygon',
    Polyline: 'polyline',
    Line: 'line',
    Rect: 'rect',
    Use: 'use',
    Image: 'image',
    Symbol: 'symbol',
    Defs: 'defs',
    LinearGradient: 'linearGradient',
    RadialGradient: 'radialGradient',
    Stop: 'stop',
    ClipPath: 'clipPath',
    Pattern: 'pattern',
    Mask: 'mask',
  },
} as RbkMap;

export const AutoComplete = AutoCompleteFactory;
export const Avatar = AvatarFactory;
export const Animation = AnimationFactory;
export const Backdrop = BackdropFactory;
export const Badge = BadgeFactory;
export const Box = BoxFactory;
export const Button = ButtonFactory;
export const ButtonGroup = ButtonGroupFactory;
export const Calendar = CalendarFactory;
export const Card = CardFactory;
export const Carousel = CarouselFactory;
export const Checkbox = CheckboxFactory;
export const Collapse = CollapseFactory;
export const Divider = DividerFactory;
export const Drawer = DrawerFactory;
export const Dropdown = DropdownFactory;
export const Form = FormFactory;
export const Grid = GridFactory;
export const Image = ImageFactory;
export const Input = InputFactory;
export const InputDate = InputDateFactory;
export const InputPin = InputPinFactory;
export const Label = LabelFactory;
export const Link = LinkFactory;
export const List = ListFactory;
export const ListItem = ListItemFactory;
export const Loading = LoadingFactory;
export const Modal = ModalFactory;
export const Outline = OutlineFactory;
export const Progress = ProgressFactory;
export const Scrollable = ScrollableFactory;
export const Select = SelectFactory;
export const Slider = SliderFactory;
export const Table = TableFactory;
export const Tabs = TabsFactory;
export const Terminal = TerminalFactory;
export const Text = TextFactory;
export const Tooltip = TooltipFactory;

// Fix PARCEL hoisting types
export const useTheme: () => RbkTheme = useCoreTheme;

export { useDimensions };

export default ReactBulk;
