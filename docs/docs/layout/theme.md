---
sidebar_position: 3
---

# Theme

Allow you to customize all components and its defaults using theme. You own your design!

## Usage

```jsx title="src/index.js"
import ReactBulk from '@react-bulk/core';
import theme from './src/themes/main.js'

export default function App() {
  return (
    <ReactBulk theme={theme}>
      {/* other like contexts and routes */}
    </ReactBulk>
  );
}
```

## Basic

### Shape

```jsx title="src/themes/main.js"
export default {
  // other options
  shape: {
    borderRadius: 4,
    spacing: 4,
    gap: 4 // gap is generally multiplied by spacing
  },
};
```

### Typography

```jsx title="src/themes/main.js"
export default {
  // other options
  typography: {
    fontSize: 16,
    lineHeight: 1.15,
  },
};
```

### Colors

```jsx title="src/themes/main.js"
export default {
  // other options
  colors: {
    primary: '#8b5cf6',
    secondary: '#f59e0b',

    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    customColorToken: '#ff00ff',

    gray: '#6b7280',
    red: '#ef4444',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    lime: '#84cc16',
    green: '#22c55e',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    fuchsia: '#d946ef',
    pink: '#ec4899',

    common: {
      trans: 'rgba(0, 0, 0, 0)',
      black: '#000000',
      white: '#ffffff',
    },
  },
};
```

```jsx live
function App() {
  const theme = useTheme();

  const predefined = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
  ];

  const other = [
    'gray',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'teal',
    'cyan',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
  ];

  return [predefined, other].map((colors, index) => (
    <Grid key={index} gap={3} mb={6}>
      {colors.map((color) => (
        <Box key={color} bg={color}>
          <Text color={theme.contrast(color)}>{color}</Text>
        </Box>
      ))}
    </Grid>
  ));
}
```

### Breakpoints

```jsx title="src/themes/main.js"
export default {
  // other options
  breakpoints: {
    xs: 0,
    sm: 320,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
};
```

## Components

### Default Props

```jsx title="src/themes/main.js"
export default {
  // other options
  components: {
    Button: {
      defaultProps: {
        color: 'secondary',
        size: 'xlarge',
      }
    }
  },
};
```

### Default Styles

```jsx title="src/themes/main.js"
export default {
  // other options
  components: {
    Button: {
      defaultStyles: {
        root: {
          bg: 'secondary',
          borderRadius: 16,
        }
      }
    }
  },
};
```

### Variants
Coming soon...
