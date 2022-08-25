const base = {
  shape: {
    borderRadius: 4,
    spacing: 4,
  },

  typography: {
    fontSize: 16,
  },

  color(mixin) {
    const [color, variation = 'main'] = `${mixin || ''}`.split('.');
    return this?.colors[color]?.[variation] ?? this?.colors[color]?.primary ?? this?.colors[color] ?? mixin ?? 'transparent';
  },

  colors: {
    common: {
      trans: 'rgba(0, 0, 0, 0)',
      black: '#000000',
      white: '#ffffff',
    },

    primary: {
      main: '#673ab7',
      light: '#9a67ea',
      dark: '#320b86',
    },

    secondary: {
      main: '#009688',
      light: '#52c7b8',
      dark: '#00675b',
    },

    info: {
      main: '#2196f3',
      light: '#6ec6ff',
      dark: '#0069c0',
    },

    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },

    warning: {
      main: '#ff9800',
      light: '#ffc947',
      dark: '#c66900',
    },

    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
  },

  rem(multiplier = 1, base = null) {
    return (base || this.typography.fontSize) * multiplier;
  },

  spacing(multiplier = 1) {
    return this.shape.spacing * multiplier;
  },

  hex2rgba(hex: string, alpha = 1) {
    const [r, g, b] =
      this.color(hex)
        .match(/\w\w/g)
        ?.map((x) => parseInt(x, 16)) || [];

    return `rgba(${r || 0},${g || 0},${b || 0},${alpha})`;
  },

  mixins: {
    transition: '0.3s ease',

    zIndex: {
      modal: 900,
      dropdown: 901,
    },
  },

  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },

  components: {
    Badge: {
      defaultProps: {
        color: 'error.dark',
        size: 'medium',
      },
    },
    Box: {
      defaultProps: {},
    },
    Button: {
      defaultProps: {
        accessibility: {
          role: 'button',
        },
      },
    },
    ButtonGroup: {
      defaultProps: {
        color: 'primary',
      },
    },
    Card: {
      defaultProps: {},
    },
    Checkbox: {
      defaultProps: {
        accessibility: {
          role: 'combobox',
        },
      },
    },
    Collapse: {
      defaultProps: {},
    },
    Divider: {
      defaultProps: {
        color: 'text.secondary',
        opacity: 0.25,
        size: 1,
      },
    },
    Dropdown: {
      defaultProps: {
        accessibility: {
          role: 'menu',
        },
      },
    },
    Form: {
      defaultProps: {},
    },
    Grid: {
      defaultProps: {},
    },
    Group: {
      defaultProps: {
        color: 'primary',
      },
    },
    Icon: {
      defaultProps: {
        color: 'primary',
        weight: 'regular',
      },
    },
    Image: {
      defaultProps: {
        accessibility: {
          role: 'image',
        },
        mode: 'cover',
      },
    },
    Input: {
      defaultProps: {
        autoCapitalize: 'sentences',
        autoCorrect: true,
        color: 'primary',
        get selectionColor() {
          return this.color;
        },
      },
    },
    Label: {
      defaultProps: {},
    },
    Loading: {
      defaultProps: {
        color: 'primary',
        accessibility: {
          role: 'progressbar',
        },
        speed: '1s',
      },
    },
    Modal: {
      defaultProps: {},
    },
    Scrollable: {
      defaultProps: {},
    },
    Select: {
      defaultProps: {
        accessibility: {
          role: 'combobox',
        },
      },
    },
    Table: {
      defaultProps: {},
    },
    Text: {
      defaultProps: {
        color: 'text',
      },
    },
  },
};

export default base;
