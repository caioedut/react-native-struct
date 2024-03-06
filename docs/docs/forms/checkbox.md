---
sidebar_position: 4
---

# Checkbox

The checkbox is shown as a square box that is ticked (checked) when activated.

## Import

```jsx
import { Checkbox } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<>
    <Checkbox />
    <Checkbox unique />
</>
```

### Composition

```jsx live
<Box maxw={400}>
  <Grid gap>
    <Box xs>
        <Checkbox label="Checkbox" />
    </Box>
    <Box xs>
        <Checkbox label="Radio" unique />
    </Box>
  </Grid>
  <Grid gap>
    <Box xs>
        <Checkbox label="Checked" checked />
    </Box>
    <Box xs>
        <Checkbox label="Checked" unique checked />
    </Box>
  </Grid>
  <Grid gap>
    <Box xs>
        <Checkbox label="Disabled" disabled />
    </Box>
    <Box xs>
        <Checkbox label="Disabled" unique disabled />
    </Box>
  </Grid>
  <Grid gap>
    <Box xs>
        <Checkbox label="Read Only" readOnly />
    </Box>
    <Box xs>
        <Checkbox label="Read Only" unique readOnly />
    </Box>
  </Grid>
</Box>
```

## Styles

### **`style`**
To the outer wrapper.

### **`buttonStyle`**
To the button element.

### **`labelStyle`**
To the label element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`controlled`**

➤ Type: **`boolean`** <br/>

---

### **`disabled`**

➤ Type: **`boolean`** <br/>

---

### **`label`**

➤ Type: **`string`** <br/>

---

### **`name`**

➤ Type: **`string`** <br/>

---

### **`readOnly`**

➤ Type: **`boolean`** <br/>

---

### **`size`**

➤ Type: **`'xsmall'` `'small'` `'medium'` `'large'` `'xlarge'`** <br/>
➤ Default: **`'medium'`** <br/>

---

### **`unique`**

If `true`, renders a radio button.

➤ Type: **`boolean`** <br/>

## Events

### **`onBlur`**

➤ Type: **`Function`([`RbkCheckboxEvent`](/docs/type-reference/rbk-checkbox-event))** <br/>

---

### **`onChange`**

➤ Type: **`Function`([`RbkCheckboxEvent`](/docs/type-reference/rbk-checkbox-event))** <br/>

---

### **`onFocus`**

➤ Type: **`Function`([`RbkCheckboxEvent`](/docs/type-reference/rbk-checkbox-event))** <br/>

---

### **`onFormChange`**

Combined with [Form](/docs/forms/form), triggers every time when form data changes.
Eg.: [Input](/docs/forms/input), [Select](/docs/forms/select), [Checkbox](/docs/forms/checkbox).

➤ Type: **`Function`([`RbkFormEvent`](/docs/type-reference/rbk-form-event))** <br/>

---

