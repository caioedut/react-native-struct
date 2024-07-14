import { ThemeProps } from '../types';
import defined from '../utils/defined';
import stdout from '../utils/stdout';
import string from '../utils/string';
import light from './light';

const base: ThemeProps = {
  custom: {},

  shape: {
    borderRadius: 6,
    spacing: 4,
    gap: 4, // gap is generally multiplied by spacing
  },

  typography: {
    fontSize: 16,
    lineHeight: 1.15,
  },

  colors: {
    primary: '#7E57C2',
    secondary: '#C0CA33',

    info: '#1E88E5',
    success: '#43A047',
    warning: '#F39C12',
    error: '#E53935',

    amber: '#FFAB00',
    blue: '#2962FF',
    blueGray: '#455A64',
    brown: '#5D4037',
    cyan: '#00B8D4',
    deepOrange: '#DD2C00',
    deepPurple: '#6200EA',
    fuchsia: '#D946EF',
    gray: '#616161',
    green: '#00C853',
    indigo: '#304FFE',
    lime: '#AEEA00',
    orange: '#FF6D00',
    pink: '#C51162',
    purple: '#AA00FF',
    red: '#D50000',
    teal: '#00BFA5',
    violet: '#8B5CF6',
    yellow: '#FFD600',

    common: {
      transparent: '#00000000',
      trans: '#00000000',
      black: '#000000',
      white: '#FFFFFF',
    },

    text: light.colors.text,

    background: light.colors.background,
  },

  breakpoints: {
    xs: 0,
    sm: 320,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },

  mixins: {
    transitions: {
      slow: {
        transitionProperty: 'all',
        transitionDuration: '0.5s',
        transitionTimingFunction: 'ease',
      },
      medium: {
        transitionProperty: 'all',
        transitionDuration: '0.35s',
        transitionTimingFunction: 'ease',
      },
      fast: {
        transitionProperty: 'all',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease',
      },
    },

    scroll: {
      '&::-webkit-scrollbar': { height: '0.375rem', width: '0.375rem' },
      '&::-webkit-scrollbar-track': { background: '#0000000D' },
      '&::-webkit-scrollbar-corner': { background: '#00000000' },
      '&::-webkit-scrollbar-thumb': { bg: 'text.disabled', borderRadius: '0.1875rem' },
    },

    zIndex: {
      backdrop: 900,
      modal: 901,
      dropdown: 902,
      tooltip: 903,
      toaster: 904,
    },
  },

  rem(multiplier = 1, base = null) {
    return (base || this.typography.fontSize) * multiplier;
  },

  spacing(multiplier = 1) {
    return this.shape.spacing * multiplier;
  },

  color(mixin, alpha?, luminosity?) {
    const [color, variation = 'main', opacity] = `${mixin || ''}`.split('.');

    let newColor =
      this?.colors[color]?.[variation] ??
      this?.colors[color]?.primary ??
      this?.colors[color] ??
      this?.colors?.common?.[color] ??
      mixin;

    // Convert RGB(A) to HEX
    if (string(newColor).startsWith('rgb')) {
      newColor =
        '#' +
        newColor
          .replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
          .split(',') // splits them at ","
          .map((string) => parseFloat(string)) // Converts them to numbers
          .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
          .map((number: number) => number.toString(16)) // Converts numbers to hex
          .map((string) => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
          .join('');
    }

    // 6-digit HEX
    if (string(newColor).startsWith('#')) {
      if (newColor.length < 7) {
        newColor = `#${newColor[1]}${newColor[1]}${newColor[2]}${newColor[2]}${newColor[3]}${newColor[3]}`;
      }
    }

    if (defined(luminosity)) {
      if (!string(newColor).startsWith('#')) {
        stdout.warn(`theme.color() cannot apply luminosity on color "${mixin}".`);
      } else {
        if (typeof luminosity === 'string') {
          luminosity = Number(luminosity.replace('%', ''));
        }

        if (typeof luminosity === 'number') {
          const digits = newColor.replace(/[^0-9A-Fa-f]/gi, '');
          const decimalColor = parseInt(digits, 16);

          let r = (decimalColor >> 16) + luminosity;
          r > 255 && (r = 255);
          r < 0 && (r = 0);
          let g = (decimalColor & 0x0000ff) + luminosity;
          g > 255 && (g = 255);
          g < 0 && (g = 0);
          let b = ((decimalColor >> 8) & 0x00ff) + luminosity;
          b > 255 && (b = 255);
          b < 0 && (b = 0);

          newColor = `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
        }
      }
    }

    if (!defined(alpha) && opacity) {
      alpha = Number(opacity) / 100;
    }

    if (defined(alpha)) {
      if (!string(newColor).startsWith('#')) {
        stdout.warn(`theme.color() cannot apply luminosity on color "${mixin}".`);
      } else {
        if (typeof alpha === 'string') {
          alpha = Number(alpha.replace('%', '')) / 100;
        }

        if (typeof alpha === 'number') {
          newColor = `${newColor}${Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, '0')}`;
        }
      }
    }

    return newColor;
  },

  contrast(mixin, lightColor?: string | null, darkColor?: string | null) {
    let color = this.color(mixin);
    lightColor = this.color(lightColor || this.colors.common.white);
    darkColor = this.color(darkColor || this.colors.common.black);

    // Transparent
    if (color === 'transparent') {
      return darkColor;
    }

    if (!string(color).startsWith('#')) {
      stdout.warn(`theme.contrast() cannot check color "${mixin}".`);
      return darkColor;
    }

    color = color.replace('#', '');

    // Convert to RGB value
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Get YIQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? darkColor : lightColor;
  },

  // Warn user about ReactBulk context
  // @ts-ignore
  setTheme() {
    stdout.error('setTheme() only works when the app is wrapped in the <ReactBulk /> context.');
  },

  get components(): ThemeProps['components'] {
    return {
      Avatar: {
        name: 'rbk-avatar',
        defaultProps: {
          alt: 'Avatar',
          color: 'gray',
          size: 64,
        },
        defaultStyles: {
          root: {
            position: 'relative',
            aspectRatio: '1/1',
            borderRadius: 32,
          },
          content: {
            position: 'absolute',
            inset: 0,
            bg: 'gray',
            borderRadius: 32,
            overflow: 'hidden',
          },
        },
        variants: {},
      },
      Backdrop: {
        name: 'rbk-backdrop',
        defaultProps: {
          platform: {
            web: {
              accessibility: { role: 'dialog' },
            },
          },
        },
        defaultStyles: {
          root: {
            position: 'absolute',
            inset: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        variants: {},
      },
      Badge: {
        name: 'rbk-badge',
        defaultProps: {
          color: 'secondary',
          size: 'medium',
        },
        defaultStyles: {
          root: {
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            alignSelf: 'center',
            justifySelf: 'center',

            backgroundColor: 'secondary',
            borderRadius: '0.5625rem',
            overflow: 'hidden',
            minHeight: '1.125rem',
            minWidth: '1.125rem',
            paddingVertical: '0.25rem',
            paddingHorizontal: '0.375rem',
          },
          label: {
            color: 'white',
            fontSize: '0.5625rem',
            fontWeight: 'bold',

            web: { lineHeight: 1 },
          },
        },
        variants: {
          dot: {
            true: {
              root: {
                minWidth: 0,
                minHeight: 0,
                px: 1,
              },
            },
          },
        },
      },
      Box: {
        name: 'rbk-box',
        defaultProps: {},
        defaultStyles: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            flexShrink: 0,
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            alignItems: 'stretch',

            web: { '-webkit-tap-highlight-color': '#00000000' },
          },
        },
        variants: {},
      },
      Button: {
        name: 'rbk-button',
        defaultProps: {
          accessibility: { role: 'button' },
          color: 'primary',
          disabledColor: 'gray.lighter',
          size: 'medium',
          transform: 'uppercase',
          variant: 'solid',
        },
        defaultStyles: {
          root: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',

            bg: 'primary',
            border: '1px solid primary',
            borderRadius: (theme) => theme.shape.borderRadius,
            margin: 0,
            minHeight: '2.25rem',
            minWidth: '2.25rem',
            padding: 0,
            paddingHorizontal: '0.75rem',

            web: {
              backgroundImage: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              '-webkit-user-select': 'none',
              '-ms-user-select': 'none',
              'user-select': 'none',
              outline: '0 !important',
              textDecorationLine: 'none !important',
              ...this.mixins.transitions.fast,
              transitionProperty: 'background-color, box-shadow',

              '&:hover': { bg: (theme) => theme.color('primary', 0.8) },
            },
          },
          label: {
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            letterSpacing: 1,
            textAlign: 'center',

            web: {
              lineHeight: '0.75rem',
            },
          },
        },
        variants: {
          block: {
            true: { root: { width: '100%' } },
          },
          circular: {
            true: { root: { borderRadius: '1rem' } },
          },
          disabled: {
            true: {
              root: {
                opacity: 0.75,
                web: {
                  cursor: 'not-allowed !important',
                  '& *': { cursor: 'not-allowed !important' },
                },
              },
            },
          },
          loading: {
            true: {
              root: {
                web: {
                  cursor: 'wait',
                  '& *': { cursor: 'wait !important' },
                },
              },
            },
          },
          size: {
            xsmall: {
              root: {
                minHeight: '1.25rem',
                minWidth: '1.25rem',
                paddingHorizontal: '0.25rem',
              },
            },
            small: {
              root: {
                minHeight: '1.75rem',
                minWidth: '1.75rem',
                paddingHorizontal: '0.5rem',
              },
            },
            large: {
              root: {
                minHeight: '2.75rem',
                minWidth: '2.75rem',
                paddingHorizontal: '1rem',
              },
            },
            xlarge: {
              root: {
                minHeight: '3.25rem',
                minWidth: '3.25rem',
                paddingHorizontal: '1.25rem',
              },
            },
          },
          transform: {
            none: { label: { textTransform: 'none' } },
            capitalize: { label: { textTransform: 'capitalize' } },
            uppercase: { label: { textTransform: 'uppercase' } },
            lowercase: { label: { textTransform: 'lowercase' } },
            'full-width': { label: { textTransform: 'full-width' } },
          },
          variant: {
            outline: {
              root: {
                bg: 'trans',
                web: { '&:hover': { bg: (theme) => theme.color('primary', 0.2) } },
              },
              label: {
                color: 'primary',
              },
            },
            text: {
              root: {
                bg: 'trans',
                borderColor: 'trans',
                web: { '&:hover': { bg: (theme) => theme.color('primary', 0.2) } },
              },
              label: {
                color: 'primary',
              },
            },
          },
        },
      },
      ButtonGroup: {
        name: 'rbk-button-group',
        defaultProps: {
          color: 'primary',
        },
        defaultStyles: {
          root: {
            m: -1,
          },
          content: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'stretch',
            p: 1,
          },
        },
        variants: {},
      },
      Calendar: {
        name: 'rbk-calendar',
        defaultProps: {
          color: 'primary',
        },
        defaultStyles: {
          root: {},
        },
        variants: {},
      },
      Card: {
        name: 'rbk-card',
        defaultProps: {},
        defaultStyles: {
          root: {
            backgroundColor: 'background.primary',
            corners: 2,
            p: '1gap',
          },
        },
        variants: {},
      },
      Carousel: {
        name: 'rbk-carousel',
        defaultProps: {
          chevron: true,
          color: 'primary',
          gap: 0,
          pagingEnabled: true,
          pointerScroll: true,
          xs: 1,
          // TODO: move to defaultStyles
          chevronStyle: { px: 0 },
        },
        defaultStyles: {
          root: {
            position: 'relative',
          },
          content: {},
          chevron: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        variants: {},
      },
      Checkbox: {
        name: 'rbk-checkbox',
        defaultProps: {
          accessibility: { role: 'checkbox' },
          color: 'primary',
          size: 'medium',
        },
        defaultStyles: {
          root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
          },
          button: {
            padding: 0,
            marginLeft: '-0.5rem',
            minHeight: 0,
            minWidth: 0,
          },
          error: {
            color: 'error',
            mx: 1,
            mt: 1,
          },
        },
        variants: {},
      },
      Collapse: {
        name: 'rbk-collapse',
        defaultProps: {
          timing: 'ease',
        },
        defaultStyles: {
          root: {
            overflow: 'hidden',
          },
        },
        variants: {},
      },
      Divider: {
        name: 'rbk-divider',
        defaultProps: {
          color: 'text.primary',
          size: 1,
          opacity: 0.15,
        },
        defaultStyles: {
          root: {
            backgroundColor: 'text.primary',
            height: 1,
            opacity: 0.15,
            width: 'auto',
          },
        },
        variants: {
          vertical: {
            true: {
              root: {
                alignSelf: 'stretch',
                height: 'auto',
                width: 1,
              },
            },
          },
        },
      },
      Drawer: {
        name: 'rbk-drawer',
        defaultProps: {
          placement: 'right',
        },
        defaultStyles: {
          root: {
            position: 'absolute',
            bg: 'background',
            maxh: '100%',
            maxw: '100%',
          },
          backdrop: {},
        },
        variants: {
          placement: {
            left: {
              root: { top: 0, left: 0, height: '100%' },
            },
            right: {
              root: { top: 0, right: 0, height: '100%' },
            },
            top: {
              root: { top: 0, left: 0, width: '100%' },
            },
            bottom: {
              root: { bottom: 0, left: 0, width: '100%' },
            },
          },
        },
      },
      Dropdown: {
        name: 'rbk-dropdown',
        defaultProps: {
          accessibility: { role: 'menu' },
          placement: 'bottom',
        },
        defaultStyles: {
          root: {
            position: 'absolute',
          },
          backdrop: {
            justifyContent: 'flex-start',
            justifyItems: 'flex-start',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
            bg: 'rgba(0, 0, 0, 0.2)',
            zIndex: (theme) => theme.mixins.zIndex.dropdown,
          },
        },
        variants: {},
      },
      Form: {
        name: 'rbk-form',
        defaultProps: {},
        defaultStyles: {
          root: {
            margin: 0,
            padding: 0,
          },
        },
        variants: {},
      },
      Grid: {
        name: 'rbk-grid',
        defaultProps: {
          size: 12,
        },
        defaultStyles: {
          root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'stretch',
          },
          item: {
            m: 0,
            p: 0,
          },
        },
        variants: {
          direction: {
            horizontal: {
              root: { flexDirection: 'row' },
            },
            vertical: {
              root: { flexDirection: 'column' },
            },
          },
        },
      },
      GrowBox: {
        name: 'rbk-grow-box',
        defaultProps: {},
        defaultStyles: {
          root: {
            overflow: 'hidden',
          },
        },
        variants: {},
      },
      Image: {
        name: 'rbk-image',
        defaultProps: {
          accessibility: { role: 'image' },
          mode: 'cover',
        },
        defaultStyles: {
          root: {
            web: { display: 'block' },
          },
        },
        variants: {},
      },
      InputBase: {
        name: 'rbk-input-base',
        defaultProps: {
          autoCapitalize: 'none',
          color: 'primary',
          returnKeyType: 'default',
          size: 'medium',
          type: 'text',
        },
        defaultStyles: {
          root: {
            position: 'relative',
          },
          content: {
            position: 'relative',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'gray.light',
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: (theme) => theme.color('trans'),
            web: {
              ...this.mixins.transitions.fast,
              transitionProperty: 'box-shadow',
            },
          },
          label: {
            mx: 1,
            mb: 1,
          },
          input: {
            backgroundColor: (theme) => theme.color('trans'),
            borderWidth: 0,
            color: 'text.primary',
            flex: 1,
            fontSize: '1rem',
            height: '2.25rem',
            margin: 0,
            paddingVertical: 0,
            paddingHorizontal: '0.625rem',
            textDecorationLine: 'none',
            width: '100%',

            web: {
              backgroundImage: 'none',
              boxShadow: 'none',
              cursor: 'inherit',
              lineHeight: '1rem',
              outline: '0 !important',
              paddingVertical: '0.625rem',

              '-moz-appearance': 'textfield',
              appearance: 'textfield',
              '&::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                appearance: 'none',
              },
            },
          },
          hint: {
            mx: 1,
            mt: 1,
          },
          error: {
            color: 'error',
            mx: 1,
            mt: 1,
          },
        },
        variants: {
          disabled: {
            true: {
              content: {
                backgroundColor: (theme) => theme.color('background.disabled', 0.125),
                borderColor: (theme) => theme.color('background.disabled', 0.25),
              },
              input: {
                web: {
                  cursor: 'not-allowed !important',
                  '& *': { cursor: 'not-allowed !important' },
                },
              },
            },
          },
          multiline: {
            true: {
              input: {
                textAlignVertical: 'top',
              },
            },
          },
        },
      },
      Input: {
        name: 'rbk-input',
        defaultProps: {
          color: 'primary',
          size: 'medium',
        },
        defaultStyles: {
          root: {},
          content: {},
          label: {},
          input: {},
          hint: {},
          error: {},
        },
        variants: {},
      },
      InputDate: {
        name: 'rbk-input-date',
        defaultProps: {
          color: 'primary',
          size: 'medium',
          translate: {
            cancel: 'Cancel',
            clear: 'Clear',
            today: 'Today',
          },
        },
        defaultStyles: {
          root: {},
          content: {},
          label: {},
          input: {},
          hint: {},
          error: {},
        },
        variants: {},
      },
      InputPin: {
        name: 'rbk-pin-input',
        defaultProps: {
          length: 4,
          size: 'medium',
          type: 'alphanumeric',
        },
        defaultStyles: {
          root: {},
          content: {},
          label: {},
          input: {},
          hint: {},
          error: {},
        },
        variants: {},
      },
      Label: {
        name: 'rbk-label',
        defaultProps: {},
        defaultStyles: {
          root: {
            web: {
              textRendering: 'optimizeLegibility',
              '-webkit-font-smoothing': 'antialiased',
              '-moz-osx-font-smoothing': 'grayscale',
              'font-smooth': 'always',
            },
          },
        },
        variants: {},
      },
      Link: {
        name: 'rbk-link',
        defaultProps: {},
        defaultStyles: {
          root: {
            color: 'primary',
            web: { cursor: 'pointer' },
          },
        },
        variants: {
          underline: {
            true: {
              root: { textDecoration: 'underline' },
            },
          },
        },
      },
      List: {
        name: 'rbk-list',
        defaultProps: {
          direction: 'vertical',
          renderOffset: 200,
        },
        defaultStyles: {
          root: {
            position: 'relative',
          },
        },
        variants: {},
      },
      ListItem: {
        name: 'rbk-list-item',
        defaultProps: {
          gap: 1,
        },
        defaultStyles: {
          root: {},
        },
        variants: {},
      },
      Loading: {
        name: 'rbk-loading',
        defaultProps: {
          duration: 500,
          accessibility: { role: 'progressbar' },
          color: 'primary',
          size: '1rem',
        },
        defaultStyles: {
          root: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          label: {
            color: 'primary',
            fontSize: '1rem',
            ml: '0.5gap',
          },
        },
        variants: {},
      },
      Modal: {
        name: 'rbk-modal',
        defaultProps: {
          halign: 'center',
          valign: 'center',
        },
        defaultStyles: {
          root: {
            maxh: '100%',
            maxw: '100%',
          },
          backdrop: {
            p: '1gap',
            zIndex: (theme) => theme.mixins.zIndex.modal,
          },
        },
        variants: {
          halign: {
            center: {
              backdrop: { alignItems: 'center' },
            },
            left: {
              backdrop: { alignItems: 'flex-start' },
            },
            right: {
              backdrop: { alignItems: 'flex-end' },
            },
          },
          valign: {
            center: {
              backdrop: { justifyContent: 'center' },
            },
            top: {
              backdrop: { justifyContent: 'flex-start' },
            },
            bottom: {
              backdrop: { justifyContent: 'flex-end' },
            },
          },
        },
      },
      Outline: {
        name: 'rbk-outline',
        defaultProps: {
          color: 'primary',
          size: 4,
          visible: 'auto',
        },
        defaultStyles: {
          root: {
            web: {
              outline: '0 !important',
              ...this.mixins.transitions.fast,
              transitionProperty: 'box-shadow',
            },
          },
        },
        variants: {},
      },
      Progress: {
        name: 'rbk-progress',
        defaultProps: {
          accessibility: { role: 'progressbar' },
          color: 'primary',
          label: true,
          size: 'medium',
        },
        defaultStyles: {
          root: {
            position: 'relative',
            bg: 'text.main.25',
            corners: 2.5,
            overflow: 'hidden',
          },
          bar: {
            bg: 'primary',
            h: '1.25rem',
          },
          label: {
            textAlign: 'center',
          },
        },
        variants: {},
      },
      Resizable: {
        name: 'rbk-resizable',
        defaultProps: {},
        defaultStyles: {
          root: {
            position: 'relative',
            overflow: 'hidden',
            web: {
              '&::-webkit-resizer': { opacity: 0 },
            },
          },
        },
        variants: {},
      },
      Scrollable: {
        name: 'rbk-scrollable',
        defaultProps: {
          direction: 'vertical',
        },
        defaultStyles: {
          root: {
            flexGrow: 1,
            flexShrink: 1,
            flexDirection: 'column',
            web: {
              display: 'flex',
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              ...this.mixins.scroll,
            },
          },
          content: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            flexGrow: 1,
          },
        },
        variants: {
          direction: {
            horizontal: {
              root: {
                flexDirection: 'row',
                web: { overflowX: 'auto' },
              },
              content: {
                flexDirection: 'row',
              },
            },
          },
          hideScrollBar: {
            true: {
              root: {
                web: {
                  '-ms-overflow-style': 'none',
                  'scrollbar-width': 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                },
              },
            },
          },
        },
      },
      Select: {
        name: 'rbk-select',
        defaultProps: {
          accessibility: { role: 'combobox' },
          color: 'primary',
          searchCount: 20,
          size: 'medium',
        },
        defaultStyles: {
          root: {},
          label: {
            mx: 1,
            mb: 1,
          },
          error: {
            color: 'error',
            mx: 1,
            mt: 1,
          },
        },
        variants: {},
      },
      Switch: {
        name: 'rbk-switch',
        defaultProps: {
          accessibility: { role: 'switch' },
          size: 'medium',
          onColor: 'primary',
          offColor: 'gray.lighter',
          onThumbColor: 'white',
          offThumbColor: 'white',
        },
        defaultStyles: {
          root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
          },
          button: {
            p: 0,
            h: '1.875rem',
            w: '3.375rem',
            minh: 0,
            minw: 0,
          },
          label: {
            ml: '1gap',
          },
          thumb: {
            bg: 'white',
            borderRadius: '0.75rem',
            h: '1.5rem',
            w: '1.5rem',
          },
          error: {
            color: 'error',
            mx: 1,
            mt: 1,
          },
        },
        variants: {},
      },
      Table: {
        name: 'rbk-table',
        defaultProps: {},
        defaultStyles: {
          root: {
            corners: 1,
          },
        },
        variants: {},
      },
      Tabs: {
        name: 'rbk-tabs',
        defaultProps: {
          accessibility: { role: 'tablist' },
          alignment: 'start',
          variant: 'group',
        },
        defaultStyles: {
          root: {
            m: -1,
          },
          content: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'stretch',
            minw: '100%',
            p: 1,
          },
          button: {
            web: { transitionProperty: 'all' },
          },
          active: {},
        },
        variants: {
          alignment: {
            start: {
              content: { justifyContent: 'start' },
            },
            center: {
              content: { justifyContent: 'center' },
            },
            end: {
              content: { justifyContent: 'end' },
            },
          },
          variant: {
            group: {
              button: {
                borderBottomWidth: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                marginLeft: -1,
              },
            },
            card: {
              root: {
                mx: -2,
              },
              button: {
                mx: 1,
              },
            },
          },
        },
      },
      Terminal: {
        name: 'rbk-terminal',
        defaultProps: {
          commands: [],
          prompt: '$',
          version: '0.0.0',
          welcomeMessage: 'Welcome to Terminal!',
        },
        defaultStyles: {
          root: {
            backgroundColor: 'background.primary',
            border: '1px solid backgorund.secondary',
            corners: 1,
            cursor: 'text',
          },
        },
        variants: {},
      },
      Text: {
        name: 'rbk-text',
        defaultProps: {},
        defaultStyles: {
          root: {
            color: 'text.primary',
            fontSize: '1rem',
            margin: 0,
            textAlign: 'left',
            textDecorationLine: 'none',
            web: {
              display: 'block',
              '& .rbk-text': { display: 'inline' },
            },
            native: {
              flexDirection: 'row',
            },
          },
        },
        variants: {
          variant: {
            h1: { root: { fontSize: '2.6rem', fontWeight: 700 } },
            h2: { root: { fontSize: '2.1rem', fontWeight: 700 } },
            h3: { root: { fontSize: '1.8rem', fontWeight: 700 } },
            h4: { root: { fontSize: '1.4rem', fontWeight: 700 } },
            h5: { root: { fontSize: '1.2rem', fontWeight: 700 } },
            h6: { root: { fontSize: '1.1rem', fontWeight: 700 } },
            title: { root: { fontSize: '1.5rem', fontWeight: 600 } },
            subtitle: { root: { fontSize: '1.25rem', fontWeight: 500 } },
            primary: { root: { fontSize: '1rem', fontWeight: 400 } },
            secondary: { root: { fontSize: '0.875rem', fontWeight: 400, color: 'text.secondary' } },
            caption: { root: { fontSize: '0.75rem', fontWeight: 400, letterSpacing: 0.5 } },
          },
          bold: {
            true: { root: { fontWeight: 'bold' } },
            false: { root: { fontWeight: 'normal' } },
          },
          italic: {
            true: { root: { fontStyle: 'italic' } },
            false: { root: { fontStyle: 'normal' } },
          },
          center: {
            true: { root: { textAlign: 'center' } },
            false: { root: { web: { textAlign: 'initial' }, native: { textAlign: 'auto' } } },
          },
          left: {
            true: { root: { textAlign: 'left' } },
            false: { root: { web: { textAlign: 'initial' }, native: { textAlign: 'auto' } } },
          },
          right: {
            true: { root: { textAlign: 'right' } },
            false: { root: { web: { textAlign: 'initial' }, native: { textAlign: 'auto' } } },
          },
          justify: {
            true: { root: { textAlign: 'justify' } },
            false: { root: { web: { textAlign: 'initial' }, native: { textAlign: 'auto' } } },
          },
          smallCaps: {
            true: { root: { web: { fontVariant: 'small-caps' }, native: { fontVariant: ['small-caps'] } } },
            false: { root: { web: { fontVariant: 'initial' }, native: { fontVariant: [] } } },
          },
          selectable: {
            false: {
              root: {
                web: {
                  '-webkit-user-select': 'none',
                  '-ms-user-select': 'none',
                  'user-select': 'none',
                },
              },
            },
          },
        },
      },
      Toaster: {
        name: 'rbk-toaster',
        defaultProps: {
          color: 'gray.dark',
          duration: 4000,
          halign: 'left',
          valign: 'bottom',
          offset: {
            x: '1gap',
            y: '1gap',
          },
        },
        defaultStyles: {
          root: {
            position: 'relative',
            corners: 2,
            p: '1gap',
            bg: 'gray.dark',
            overflow: 'hidden',
          },
        },
        variants: {},
      },
      Tooltip: {
        name: 'rbk-tooltip',
        defaultProps: {
          position: 'top',
          color: 'black',
          delay: 200,
          offset: 1,
        },
        defaultStyles: {
          root: {
            zIndex: (theme) => theme.mixins.zIndex.tooltip,

            web: {
              position: 'fixed',
              opacity: 0,
              pointerEvents: 'none',
              visibility: 'hidden',
              zIndex: -1,
              ...this.mixins.transitions.fast,
            },

            native: {
              position: 'absolute',
              display: 'none',
            },
          },
          label: {
            backgroundColor: 'black',
            borderRadius: (theme) => theme.shape.borderRadius,
            color: 'white',
            fontSize: '0.75rem',
            overflow: 'hidden',
            py: 1,
            px: 1.5,
            textAlign: 'center',
          },
        },
        variants: {
          visible: {
            true: {
              root: {
                web: {
                  opacity: 1,
                  visibility: 'visible',
                  zIndex: (theme) => theme.mixins.zIndex.tooltip,
                },

                native: {
                  display: 'flex',
                },
              },
            },
          },
        },
      },
    };
  },
};

export default base;
