---
sidebar_position: 2
---

# Button

Allow users to take actions and make choices, with a single tap.

## Import

```jsx
import { Button } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Button onPress={() => alert('Button Pressed!')}>Button</Button>
```

### Variants

```jsx live
<Grid column center gap={3}>
  <Box>
    <Button variant="solid">Solid</Button>
  </Box>
  <Box>
    <Button variant="outline">Outline</Button>
  </Box>
  <Box>
    <Button variant="text">Text</Button>
  </Box>
</Grid>
```

### Sizes

```jsx live
<Grid column center gap={3}>
  <Box>
    <Button size="xsmall">Button</Button>
  </Box>
  <Box>
    <Button size="small">Button</Button>
  </Box>
  <Box>
    <Button size="medium">Button</Button>
  </Box>
  <Box>
    <Button size="large">Button</Button>
  </Box>
  <Box>
    <Button size="xlarge">Button</Button>
  </Box>
</Grid>
```

### Loading

Try press the buttons.

```jsx live
function Home () {
  const [loading, setLoading] = useState(true);

  const handleToggleLoading = () => setLoading(!loading);

  return (
    <Grid center gap={3}>
      <Box>
        <Button loading={loading} onPress={handleToggleLoading}>
          🡢
        </Button>
      </Box>
      <Box>
        <Button loading={loading} onPress={handleToggleLoading}>Button</Button>
      </Box>
    </Grid>
  )
}
```

### Group and Toggle

[Learn more about `ButtonGroup`](/docs/forms/button-group).

```jsx live
function Home() {
  const [state, setState] = useState('edit');

  return (
    <ButtonGroup variant="solid" size="small">
      <Button variant={state !== 'edit' && 'outline'} onPress={() => setState('edit')}>
        Edit
      </Button>
      <Button variant={state !== 'preview' && 'outline'} onPress={() => setState('preview')}>
        Preview
      </Button>
    </ButtonGroup>
  );
}
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`autoFocus`**

If `true`, focuses the input on `componentDidMount` or `useEffect`.

➤ Type: **`boolean`** <br/>

---

### **`badge`**

A number or object representing the button's badge.

➤ Type: **`number` | [`BadgeProps`](/docs/feedback/badge#props)** <br/>

---

### **`circular`**

Indicates whether the button is circular.

➤ Type: **`boolean`** <br/>

---

### **`color`**

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`primary`**

---

### **`contrastColor`**

A color to use on labels and addons to contrast with the color of the button.

➤ Type: **`RbkColor`** <br/>

---

### **`disabled`**

Indicates whether the button is disabled.

➤ Type: **`boolean`** <br/>

---

### **`endAddon`**

A React element that is added to the end of the button.

➤ Type: **`string` | `ReactElement`** <br/>

---

### **`href`**

For web only.<br/>
The URL to which the button should redirect when clicked.

➤ Type: **`string`** <br/>

---

### **`label`**

Render text label as child.

➤ Type: **`string`** <br/>

---

### **`loading`**

Indicates whether the button is loading.

➤ Type: **`boolean`** <br/>

---

### **`size`**

➤ Type: **`'small'` `'medium'` `'large'` `'xlarge'`** <br/>
➤ Default: **`medium`**

---

### **`startAddon`**

A React element that is added to the start of the button.

➤ Type: **`string` `ReactElement`** <br/>

---

### **`transform`**

The text transform value of the label.

➤ Type: **`'none'` `'captalize'` `'uppercase'` `'lowercase'` `'full-width'`** <br/>
➤ Default: **`'uppercase'` <br/>

---

### **`type`**

➤ Type: **`'button'` `'submit'` `'cancel'` `'clear'`** <br/>
➤ Default: **`button`**

---

### **`variant`**

➤ Type: **`'solid'` `'outline'` `'text'`** <br/>
➤ Default: **`solid`**

## Styles

### **`style`**
To the button element.

### **`contentStyle`**
To the inner wrapper of `children` or `label`.

### **`labelStyle`**
To the label of the button.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Events

### **`onBlur`**

➤ Type: **`Function(Event)`** <br/>

---

### **`onFocus`**

➤ Type: **`Function(Event)`** <br/>

---

### **`onPress`**

➤ Type: **`Function(Event)`** <br/>

---

### **`onPressIn`**

➤ Type: **`Function(Event)`** <br/>

---

### **`onPressOut`**

➤ Type: **`Function(Event)`** <br/>

---
