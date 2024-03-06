---
sidebar_position: 8
---

# Label

Used to create caption for an item in a user interface.

## Import

```jsx
import { Label } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Label>Full name</Label>
```

### Reference

```jsx live
function Home () {
  const inputRef = useRef();

  return (
    <Grid column gap={3} maxw={400}>
      <Box>
        <Input ref={inputRef} />
      </Box>
      <Box>
        <Label forRef={inputRef} bold>Custom label "for". Press me!</Label>
      </Box>
    </Grid>
  );
}
```


### Composition

```jsx live
<Grid column gap={3} maxw={400}>
  <Box>
    <Input label="Full name" />
  </Box>
  <Box>
    <Select
      label="Theme"
      options={[
        {value: 1, label: 'Light'},
        {value: 2, label: 'Dark'},
      ]}
    />
  </Box>
  <Box>
    <Checkbox label="Accept terms!" />
  </Box>
</Grid>
```

## Props

Extends all [`Text`](/docs/core/text#props) props.

### **`for`**

Commonly used fo Web.

➤ Type: **`string`** <br/>

---

### **`forRef`**

Commonly used fo Native.

➤ Type: **`RefObject<ReactNode>`** <br/>

---

## Styles

### **`style`**
To the main element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---
