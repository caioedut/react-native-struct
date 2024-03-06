---
sidebar_position: 9
---

# Select

Used to create a selectable drop-down list.

## Import

```jsx
import { Select } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Grid column gap maxw={400}>
    <Box>
        <Select
            label="Theme"
            placeholder="Select a theme"
            options={[
                {value: 1, label: 'Light'},
                {value: 2, label: 'Dark'},
            ]}
        />
    </Box>
    <Box>
       <Select
           colorful
           label="Colorful"
           placeholder="Select a theme"
           options={[
               {value: 1, label: 'Light'},
               {value: 2, label: 'Dark'},
           ]}
       />
   </Box>
</Grid>
```

### Sizes

```jsx live
<Grid column gap maxw={400}>
  <Box>
      <Select size="xsmall" placeholder="Select (xsmall)"  options={[{value: 1, label: 'Option 1'}]} />
  </Box>
  <Box>
      <Select size="small" placeholder="Select (small)" options={[{value: 1, label: 'Option 1'}]} />
  </Box>
  <Box>
      <Select size="medium" placeholder="Select (medium)" options={[{value: 1, label: 'Option 1'}]}/>
  </Box>
  <Box>
      <Select size="large" placeholder="Select (large)" options={[{value: 1, label: 'Option 1'}]}/>
  </Box>
  <Box>
      <Select size="xlarge" placeholder="Select (xlarge)" options={[{value: 1, label: 'Option 1'}]}/>
  </Box>
</Grid>
```

### Error

```jsx live
<Box maxw={400}>
  <Select
    error="Please select a theme."
    options={[
      {value: 1, label: 'Light'},
      {value: 2, label: 'Dark'},
    ]}
  />
</Box>
```

### Addons

```jsx live
<Box maxw={400}>
  <Select placeholder="Username" startAddon="👤" />
</Box>
```

## Styles

### **`style`**
To the outer wrapper.

### **`buttonStyle`**
To the button element.

### **`errorStyle`**
To the error element when has [`error`](#error) prop.

### **`labelStyle`**
To the label element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`color`**

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`'primary'`**

---

### **`colorful`**

➤ Type: **`boolean`** <br/>

---

### **`controlled`**

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

### **`endAddon`**

➤ Type: **`string` `ReactNode`** <br/>

---

### **`error`**

➤ Type: **`string`** <br/>

---

### **`label`**

➤ Type: **`string`** <br/>

---

### **`loading`**

➤ Type: **`boolean`** <br/>

---

### **`name`**

➤ Type: **`string`** <br/>

---

### **`options`**

➤ Type: **`Array<RbkSelectOption>`** <br/>

```jsx title="RbkSelectOption"
{
  value: string | number
  label: string
  disabled?: boolean
}
```

---

### **`placeholder`**

The string that will be rendered before text input has been entered.

➤ Type: **`string`** <br/>

---

### **`readOnly`**

➤ Type: **`boolean`** <br/>

---

### **`searchCount`**

Minimum number of options to appear the search input

➤ Type: **`number`** <br/>
➤ Default: **`20`** <br/>

---

### **`size`**

➤ Type: **`'xsmall'` `'small'` `'medium'` `'large'` `'xlarge'`** <br/>
➤ Default: **`'medium'`** <br/>

---

### **`startAddon`**

➤ Type: **`string` `ReactNode`** <br/>

---

### **`value`**

➤ Type: **`string` `number`** <br/>

## Events

### **`onBlur`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onChange`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onFocus`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onFormChange`**

Combined with [Form](/docs/forms/form), triggers every time when form data changes.
Eg.: [Input](/docs/forms/input), [Select](/docs/forms/select), [Checkbox](/docs/forms/checkbox).

➤ Type: **`Function`([`RbkFormEvent`](/docs/type-reference/rbk-form-event))** <br/>

---
