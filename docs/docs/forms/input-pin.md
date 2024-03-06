---
sidebar_position: 7
---

# Input Pin

Used to create a secure and user-friendly input field for entering a pin code, providing features such as masking, validation, and auto-focus.

## Import

```jsx
import { InputPin } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<InputPin />
```

### Types

```jsx live
<Grid gap maxw={400}>
    <Box>
        <Label mb={1}>Alphanumeric</Label>
        <InputPin type="alphanumeric" />
    </Box>
    <Box>
        <Label mb={1}>Numeric</Label>
        <InputPin type="numeric" />
    </Box>
    <Box>
        <Label mb={1}>Alphabetic</Label>
        <InputPin type="alphabetic" />
    </Box>
</Grid>
```

### Length

```jsx live
<InputPin length={6} />
```

## Styles

### **`style`**
To the outer wrapper.

### **`inputStyle`**
To the input element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`autoFocus`**

If `true`, focuses the input on `componentDidMount` or `useEffect`.

➤ Type: **`boolean`** <br/>

---

### **`color`**

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`'primary'`**

---

### **`colorful`**

➤ Type: **`boolean`** <br/>

---

### **`defaultValue`**

Provides an initial value that will change when the user starts typing. Useful for use-cases where you do not want to deal with listening to
events and updating the value prop to keep the controlled state in sync.

➤ Type: **`string` `number`** <br/>

---

### **`disabled`**

➤ Type: **`boolean`** <br/>

---

### **`length`**

➤ Type: **`number`** <br/>
➤ Default: **`4`**

---

### **`name`**

➤ Type: **`string`** <br/>

---

### **`notNull`**

Final empty value will be empty string ("") or null depending on this prop.

➤ Type: **`bool`** <br/>

---

### **`placeholder`**

The string that will be rendered before text input has been entered.

➤ Type: **`string`** <br/>

---

### **`placeholderColor`**

➤ Type: **`string`** <br/>
➤ Default: **`'text.primary'`**

---

### **`readOnly`**

If `true`, text is not editable.

➤ Type: **`boolean`** <br/>

---

### **`returnKeyType`**

Determines how the return key should look.

➤ Type: **`'default'` `'done'` `'go'` `'next'` `'search'` `'send'`** <br/>
➤ Default: **`'default'`** <br/>

---

### **`secure`**

If `true`, the text input obscures the text entered so that sensitive text like passwords stay secure.

➤ Type: **`boolean`** <br/>

---

### **`size`**

➤ Type: **`'xsmall'` `'small'` `'medium'` `'large'` `'xlarge'`** <br/>
➤ Default: **`'medium'`** <br/>

---

### **`textColor`**

➤ Type: **`boolean`** <br/>
➤ Default: **`'text.primary'`**

---

### **`type`**

➤ Type: **`'alphanumeric'` `'alphabetic'` `'numeric'`** <br/>
➤ Default: **`'alphanumeric'`**

---

### **`value`**

The value to show for the text input.

➤ Type: **`string`** <br/>

## Events

### **`onChange`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onSubmit`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onFormChange`**

Combined with [Form](/docs/forms/form), triggers every time when form data changes.
Eg.: [Input](/docs/forms/input), [Select](/docs/forms/select), [Checkbox](/docs/forms/checkbox).

➤ Type: **`Function`([`RbkFormEvent`](/docs/type-reference/rbk-form-event))** <br/>
