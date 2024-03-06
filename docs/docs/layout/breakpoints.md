---
sidebar_position: 2
---

# Breakpoints

Used to create responsive design. Commonly used with [Grid](/docs/layout/grid).

## Default

| Alias:     | xs       | sm          | md          | lg          | xl           | xxl         |
|------------|----------|-------------|-------------|-------------|--------------|-------------|
| Min Width: | `0` (px) | `320` (px)  | `768` (px)  | `992` (px)  | `1200` (px)  | `1400` (px) |

## Custom

[Read more about Theme](/docs/layout/theme).

```jsx
const theme = {
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

## Usage

### Grid

See [Grid](/docs/layout/grid.md)

### Components

```jsx live
function Home() {
  return (
    <Box>
      <Button style={{ display: 'none', xs: { display: 'flex' } }}>
        Visible on XS or higher
      </Button>
      <Button style={{ display: 'none', sm: { display: 'flex' } }} mt={3}>
        Visible on SM or higher
      </Button>
      <Button style={{ display: 'none', md: { display: 'flex' } }} mt={3}>
        Visible on MD or higher
      </Button>
      <Button style={{ display: 'none', lg: { display: 'flex' } }} mt={3}>
        Visible on LG or higher
      </Button>
      <Button style={{ display: 'none', xl: { display: 'flex' } }} mt={3}>
        Visible on XL or higher
      </Button>
      <Button style={{ display: 'none', xxl: { display: 'flex' } }} mt={3}>
        Visible on XXL or higher
      </Button>
    </Box>
  );
}
```
