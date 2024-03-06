# Tooltip

Used to display informative message when hovered or pressed.


## Import

```jsx
import { Tooltip } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Box row center>
  <Tooltip title="Add to cart">
    <Button circular>+</Button>
  </Tooltip>
</Box>
```

### Position

```jsx live
<Grid center gap={12}>
  <Box>
    <Tooltip title="Add to cart" position="top">
      <Text>Top</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" position="bottom">
      <Text>Bottom</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" position="left">
      <Text>Left</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" position="right">
      <Text>Right</Text>
    </Tooltip>
  </Box>
</Grid>
```

### Colors

```jsx live
<Grid center gap={12}>
  <Box>
    <Tooltip title="Add to cart" color="primary">
      <Text>Primary</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" color="secondary">
      <Text>Secondary</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" color="success">
      <Text>Success</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" color="error">
      <Text>Error</Text>
    </Tooltip>
  </Box>
  <Box>
    <Tooltip title="Add to cart" color="#f30892">
      <Text>Custom</Text>
    </Tooltip>
  </Box>
</Grid>
```

## Props

Extends all [`Text`](/docs/core/text#props) props.

### **`color`**

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`black`** <br/>

---

### **`offset`**

➤ Type: **`number` `string`** <br/>
➤ Default Web: **`1`** <br/>
➤ Default Native: **`2`** <br/>

---

### **`position`**

➤ Type: **`'top'` `'bottom'` `'left'` `'right'`** <br/>

---

### **`title`**

➤ Type: **`string`** <br/>

---

### **`visible`**

➤ Type: **`boolean`** <br/>

---

## Styles

### **`style`**
To the main element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---
